package expo.modules.textscan

import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/** Lê o texto de uma foto no próprio aparelho (ML Kit, modelo japonês embutido). */
class TextScanModule : Module() {
  private val recognizer by lazy { TextRecognition.getClient(JapaneseTextRecognizerOptions.Builder().build()) }

  override fun definition() = ModuleDefinition {
    Name("TextScan")

    /** Reconhece o texto da imagem (file:// ou content://). Devolve o texto inteiro e as linhas, na ordem em que o ML Kit as achou. */
    AsyncFunction("recognize") { uri: String, promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.reject(CodedException("NO_CONTEXT", "O app ainda não está pronto.", null))
        return@AsyncFunction
      }
      try {
        val image = InputImage.fromFilePath(context, Uri.parse(uri))
        recognizer
          .process(image)
          .addOnSuccessListener { result ->
            val lines = result.textBlocks.flatMap { block -> block.lines.map { it.text } }
            promise.resolve(mapOf("text" to result.text, "lines" to lines))
          }
          .addOnFailureListener { error ->
            promise.reject(CodedException("SCAN_FAILED", "Não consegui ler o texto da imagem: ${error.message}", error))
          }
      } catch (error: Throwable) {
        promise.reject(CodedException("BAD_IMAGE", "Não consegui abrir a imagem: ${error.message}", error))
      }
    }
  }
}
