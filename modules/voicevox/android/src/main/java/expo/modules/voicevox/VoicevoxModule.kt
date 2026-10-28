package expo.modules.voicevox

import android.content.Context
import android.system.Os
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import jp.hiroshiba.voicevoxcore.StyleType
import jp.hiroshiba.voicevoxcore.blocking.Onnxruntime
import jp.hiroshiba.voicevoxcore.blocking.OpenJtalk
import jp.hiroshiba.voicevoxcore.blocking.Synthesizer
import jp.hiroshiba.voicevoxcore.blocking.VoiceModelFile
import java.io.File
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.security.MessageDigest
import java.util.UUID
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.roundToInt

private const val ASSETS_ROOT = "voicevox"
private const val CACHE_LIMIT_BYTES = 80L * 1024 * 1024

/** Pico-alvo do áudio (16 bits): perto de -2 dBFS, como as amostras do site oficial. */
private const val TARGET_PEAK = 26000.0

/** Quanto o áudio pode ser amplificado: evita transformar ruído de fundo em chiado quando a fala é quase muda. */
private const val MAX_GAIN = 8.0
private val MODEL_NAME = Regex("^\\d{1,3}\\.vvm$")

class VoicevoxException(code: String, message: String, cause: Throwable? = null) : CodedException(code, message, cause)

/**
 * VOICEVOX CORE rodando no aparelho. O dicionário e a biblioteca ONNX vêm empacotados no app (preparados por
 * `npm run voicevox:setup`); as vozes (.vvm) são baixadas pela pessoa, pelo JavaScript, para `modelsPath()` e entram
 * aqui por `commitModel`. A síntese devolve o caminho de um WAV em cache; quem toca é o JavaScript.
 */
class VoicevoxModule : Module() {
  private val lock = Any()
  private var synthesizer: Synthesizer? = null
  private var speakers: List<Map<String, Any>> = emptyList()

  /** Vozes carregadas no motor: nome do arquivo → id do modelo (para descarregar sem recriar o motor). */
  private val loaded = mutableMapOf<String, UUID>()

  private val context: Context
    get() = appContext.reactContext ?: throw VoicevoxException("NO_CONTEXT", "O app ainda não está pronto.")

  override fun definition() = ModuleDefinition {
    Name("Voicevox")

    /** O motor (dicionário do Open JTalk) está dentro do app? As vozes são conferidas à parte, por `installedModels`. */
    AsyncFunction("isInstalled") { -> installed() }

    /** Pasta (caminho absoluto) onde as vozes baixadas ficam; sobrevive às atualizações do app. */
    AsyncFunction("modelsPath") { -> modelsDir().absolutePath }

    /** Nomes dos arquivos de voz (.vvm) já baixados. */
    AsyncFunction("installedModels") { -> installedModels() }

    /** Confere o tamanho de `<nome>.part` e o promove a voz instalada; se o motor já está de pé, carrega a voz. */
    AsyncFunction("commitModel") { name: String, expectedBytes: Double -> commitModel(name, expectedBytes.toLong()) }

    /** Descarrega e apaga uma voz baixada. */
    AsyncFunction("removeModel") { name: String -> removeModel(name) }

    /** Carrega o motor e as vozes baixadas (a primeira vez copia o dicionário e leva alguns segundos). Devolve os personagens e estilos. */
    AsyncFunction("prepare") { -> prepare() }

    /** Sintetiza o texto e devolve o caminho (file://) de um WAV; falas repetidas saem do cache. */
    AsyncFunction("synthesize") { text: String, styleId: Int, speed: Double -> synthesize(text, styleId, speed) }

    /** Apaga os áudios em cache. */
    AsyncFunction("clearCache") { -> cacheDir().listFiles()?.forEach { it.delete() }; Unit }
  }

  private fun assetNames(path: String): Array<String> = try {
    context.assets.list(path) ?: emptyArray()
  } catch (_: IOException) {
    emptyArray()
  }

  private fun onnxLibrary(): File? {
    val dir = File(context.applicationInfo.nativeLibraryDir)
    return dir.listFiles()?.firstOrNull { it.name.startsWith("libvoicevox_onnxruntime") && it.name.endsWith(".so") }
  }

  private fun installed(): Boolean = assetNames("$ASSETS_ROOT/dict").isNotEmpty()

  private fun cacheDir(): File = File(context.cacheDir, "voicevox").apply { mkdirs() }

  private fun modelsDir(): File = File(context.filesDir, "voicevox-models").apply { mkdirs() }

  private fun installedModels(): List<String> =
    modelsDir().listFiles()?.filter { it.isFile && MODEL_NAME.matches(it.name) }?.map { it.name }
      ?.sortedBy { it.removeSuffix(".vvm").toInt() } ?: emptyList()

  private fun checkedName(name: String): String {
    if (!MODEL_NAME.matches(name)) throw VoicevoxException("BAD_NAME", "Nome de voz inválido: $name")
    return name
  }

  private fun copyAssets(path: String, target: File) {
    val children = assetNames(path)
    if (children.isEmpty()) {
      target.parentFile?.mkdirs()
      context.assets.open(path).use { input -> target.outputStream().use { input.copyTo(it) } }
      return
    }
    target.mkdirs()
    for (name in children) copyAssets("$path/$name", File(target, name))
  }

  /** Copia o dicionário do APK para a pasta do app (o VOICEVOX CORE lê por caminho). Refaz se o app foi atualizado. */
  private fun extractedRoot(): File {
    val root = File(context.filesDir, ASSETS_ROOT)
    val stamp = File(root, ".stamp")
    val version = context.packageManager.getPackageInfo(context.packageName, 0).lastUpdateTime.toString()
    if (stamp.exists() && stamp.readText() == version) return root
    root.deleteRecursively()
    copyAssets("$ASSETS_ROOT/dict", File(root, "dict"))
    stamp.writeText(version)
    return root
  }

  private fun findDictDir(root: File): File {
    val dict = File(root, "dict")
    return dict.walkTopDown().firstOrNull { it.isDirectory && File(it, "sys.dic").exists() }
      ?: throw VoicevoxException("NO_DICT", "O dicionário do Open JTalk não está no app.")
  }

  private fun buildEngine(): Synthesizer {
    val root = extractedRoot()
    Os.setenv("TMPDIR", context.cacheDir.absolutePath, true)
    val library = onnxLibrary()?.absolutePath ?: "libvoicevox_onnxruntime.so"
    val onnx = Onnxruntime.loadOnce().filename(library).perform()
    val openJtalk = OpenJtalk(findDictDir(root).absolutePath)
    return Synthesizer.builder(onnx, openJtalk).build()
  }

  /** Deixa no motor exatamente as vozes que estão na pasta: carrega as novas e descarrega as que foram apagadas. */
  private fun syncModels(engine: Synthesizer) {
    val onDisk = installedModels().toSet()
    for ((name, id) in loaded.toMap()) {
      if (name !in onDisk) {
        engine.unloadVoiceModel(id)
        loaded.remove(name)
      }
    }
    for (name in onDisk) {
      if (name in loaded) continue
      VoiceModelFile(File(modelsDir(), name).absolutePath).use { file ->
        engine.loadVoiceModel(file).perform()
        loaded[name] = file.id
      }
    }
    speakers = engine.metas().map { meta ->
      val talk = meta.styles.filter { it.type == null || it.type == StyleType.TALK || it.type.toString() == StyleType.TALK.toString() }
      mapOf(
        "name" to meta.name,
        "styles" to talk.map { mapOf("id" to it.id, "name" to it.name) },
      )
    }.filter { (it["styles"] as List<*>).isNotEmpty() }
  }

  private fun prepare(): List<Map<String, Any>> = synchronized(lock) {
    if (!installed()) throw VoicevoxException("NOT_INSTALLED", "O motor do VOICEVOX não está neste app (rode npm run voicevox:setup e gere o APK de novo).")
    if (synthesizer == null && installedModels().isEmpty()) throw VoicevoxException("NO_MODELS", "Nenhuma voz foi baixada ainda.")
    try {
      val engine = synthesizer ?: buildEngine().also { synthesizer = it }
      syncModels(engine)
      speakers
    } catch (e: VoicevoxException) {
      throw e
    } catch (e: Throwable) {
      throw VoicevoxException("PREPARE_FAILED", "Não consegui iniciar o VOICEVOX: ${e.message}", e)
    }
  }

  private fun commitModel(name: String, expectedBytes: Long): List<String> {
    checkedName(name)
    val part = File(modelsDir(), "$name.part")
    if (!part.exists() || part.length() != expectedBytes) {
      val got = if (part.exists()) part.length() else 0L
      part.delete()
      throw VoicevoxException("BAD_SIZE", "O download veio incompleto ($got de $expectedBytes bytes). Tente de novo.")
    }
    val target = File(modelsDir(), name)
    synchronized(lock) {
      // Uma voz com o mesmo nome (baixada de novo) sai do motor antes de o arquivo ser trocado.
      loaded.remove(name)?.let { synthesizer?.unloadVoiceModel(it) }
      target.delete()
      if (!part.renameTo(target)) throw VoicevoxException("MOVE_FAILED", "Não consegui guardar a voz baixada.")
      val engine = synthesizer ?: return installedModels()
      try {
        syncModels(engine)
      } catch (e: Throwable) {
        target.delete()
        loaded.remove(name)
        throw VoicevoxException("LOAD_FAILED", "A voz baixada não abriu (${e.message}). Tente baixar de novo.", e)
      }
    }
    return installedModels()
  }

  private fun removeModel(name: String): List<String> {
    checkedName(name)
    synchronized(lock) {
      File(modelsDir(), name).delete()
      File(modelsDir(), "$name.part").delete()
      synthesizer?.let {
        try {
          syncModels(it)
        } catch (e: Throwable) {
          throw VoicevoxException("UNLOAD_FAILED", "Não consegui descarregar a voz: ${e.message}", e)
        }
      }
    }
    return installedModels()
  }

  private fun hash(text: String): String =
    MessageDigest.getInstance("SHA-1").digest(text.toByteArray()).joinToString("") { "%02x".format(it) }

  private fun synthesize(text: String, styleId: Int, speed: Double): String {
    val clean = text.trim()
    if (clean.isEmpty()) throw VoicevoxException("EMPTY_TEXT", "Texto vazio.")
    val scale = speed.coerceIn(0.5, 1.6)
    // "v2": os áudios guardados antes da normalização de volume (v1) ficam de lado e são refeitos.
    val file = File(cacheDir(), hash("v2|$styleId|$scale|$clean") + ".wav")
    if (file.exists() && file.length() > 44) return "file://${file.absolutePath}"
    prepare()
    return synchronized(lock) {
      val engine = synthesizer ?: throw VoicevoxException("NOT_READY", "O VOICEVOX não está pronto.")
      try {
        val query = engine.createAudioQuery(clean, styleId)
        query.speedScale = scale
        val wav = normalizePeak(engine.synthesis(query, styleId).perform())
        val temp = File(file.parentFile, "${file.name}.tmp")
        temp.writeBytes(wav)
        temp.renameTo(file)
        trimCache()
        "file://${file.absolutePath}"
      } catch (e: Throwable) {
        throw VoicevoxException("SYNTH_FAILED", "Falha ao sintetizar: ${e.message}", e)
      }
    }
  }

  /**
   * Deixa o pico do WAV (PCM de 16 bits) em TARGET_PEAK. O motor entrega cada personagem num volume diferente (alguns saem uns
   * 12 dB abaixo das amostras do site e ficam quase inaudíveis no alto-falante), então todo áudio é nivelado pelo pico.
   */
  private fun normalizePeak(wav: ByteArray): ByteArray {
    var pos = 12
    while (pos + 8 <= wav.size) {
      val id = String(wav, pos, 4, Charsets.US_ASCII)
      val size = ByteBuffer.wrap(wav, pos + 4, 4).order(ByteOrder.LITTLE_ENDIAN).int
      if (id != "data") {
        if (size < 0) return wav
        pos += 8 + size + (size and 1)
        continue
      }
      val start = pos + 8
      val end = if (size <= 0) wav.size else min(wav.size, start + size)
      var peak = 0
      var i = start
      while (i + 1 < end) {
        peak = maxOf(peak, abs(sample(wav, i)))
        i += 2
      }
      if (peak < 200) return wav
      val gain = min(TARGET_PEAK / peak, MAX_GAIN)
      if (abs(gain - 1.0) < 0.05) return wav
      val out = wav.copyOf()
      i = start
      while (i + 1 < end) {
        val value = (sample(wav, i) * gain).roundToInt().coerceIn(-32768, 32767)
        out[i] = (value and 0xFF).toByte()
        out[i + 1] = ((value shr 8) and 0xFF).toByte()
        i += 2
      }
      return out
    }
    return wav
  }

  private fun sample(wav: ByteArray, at: Int): Int = ((wav[at + 1].toInt() shl 8) or (wav[at].toInt() and 0xFF)).toShort().toInt()

  /** Mantém o cache de áudio abaixo do limite, apagando os mais antigos. */
  private fun trimCache() {
    val files = cacheDir().listFiles()?.filter { it.isFile }?.sortedBy { it.lastModified() } ?: return
    var total = files.sumOf { it.length() }
    for (file in files) {
      if (total <= CACHE_LIMIT_BYTES) break
      total -= file.length()
      file.delete()
    }
  }
}
