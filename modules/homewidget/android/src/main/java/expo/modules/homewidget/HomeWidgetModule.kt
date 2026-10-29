package expo.modules.homewidget

import android.appwidget.AppWidgetManager
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/** Ponte do JavaScript com o widget "Revisão do dia" da tela inicial. */
class HomeWidgetModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw CodedException("NO_CONTEXT", "O app ainda não está pronto.", null)

  override fun definition() = ModuleDefinition {
    Name("HomeWidget")

    /** Guarda o que está vencido e redesenha os widgets. `upcoming`: as horas (ms) em que vencem as próximas, separadas por vírgula. */
    Function("update") { dueNow: Int, upcoming: String, streak: Int ->
      ReviewWidgetProvider.save(context, dueNow, upcoming, streak)
      ReviewWidgetProvider.refresh(context)
    }

    /** Há algum widget do Moji Dojo na tela inicial? */
    Function("hasWidget") { ->
      AppWidgetManager.getInstance(context).getAppWidgetIds(ReviewWidgetProvider.component(context)).isNotEmpty()
    }

    /** O lançador do aparelho aceita pedir para fixar um widget? */
    Function("canPin") { -> AppWidgetManager.getInstance(context).isRequestPinAppWidgetSupported }

    /** Pede ao lançador para adicionar o widget (o sistema mostra a confirmação). Devolve false se não deu. */
    Function("requestPin") { ->
      val manager = AppWidgetManager.getInstance(context)
      manager.isRequestPinAppWidgetSupported && manager.requestPinAppWidget(ReviewWidgetProvider.component(context), null, null)
    }
  }
}
