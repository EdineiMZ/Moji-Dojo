package expo.modules.sharetext

import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Recebe o texto que outro app compartilha com o Moji Dojo ("Compartilhar" → Moji Dojo). O texto vem de fora e é tratado como
 * dado não confiável: aqui só é lido e entregue; o JavaScript limpa, limita o tamanho e apenas preenche o campo, sem usar nada.
 */
class ShareTextModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ShareText")

    Events("onShareText")

    /** O texto compartilhado que abriu o app, uma única vez (depois de lido, sai do intent). Null se não há. */
    Function("consume") { -> take(appContext.currentActivity?.intent) }

    /** O app já estava aberto e recebeu outro compartilhamento. */
    OnNewIntent { intent ->
      take(intent)?.let { sendEvent("onShareText", mapOf("text" to it)) }
    }
  }

  /** Lê o texto de um intent "enviar texto" e o tira do intent, para não ser lido duas vezes. */
  private fun take(intent: Intent?): String? {
    if (intent == null || intent.action != Intent.ACTION_SEND) return null
    val type = intent.type ?: return null
    if (!type.startsWith("text/")) return null
    val text = intent.getCharSequenceExtra(Intent.EXTRA_TEXT)?.toString()
    intent.removeExtra(Intent.EXTRA_TEXT)
    return text?.takeIf { it.isNotBlank() }
  }
}
