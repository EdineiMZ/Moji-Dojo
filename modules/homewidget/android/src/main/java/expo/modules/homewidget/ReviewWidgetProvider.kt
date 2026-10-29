package expo.modules.homewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.RemoteViews

/**
 * O widget "Revisão do dia": mostra quantas revisões estão vencidas e a sequência de dias; tocar abre o app. O app guarda aqui
 * (SharedPreferences) o que está vencido agora e a hora em que vencem as próximas, então a conta continua certa a cada
 * atualização do sistema, mesmo com o app fechado.
 *
 * O tamanho varia conforme o lançador: alguns (como o Niagara) esticam o widget na largura da tela e o deixam baixo. Por isso há
 * duas disposições, a compacta (vertical) e a larga (número à esquerda, texto à direita), escolhidas pelo tamanho que o
 * lançador informa, e o widget é redesenhado quando esse tamanho muda.
 */
class ReviewWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context: Context, manager: AppWidgetManager, appWidgetIds: IntArray) {
    for (id in appWidgetIds) manager.updateAppWidget(id, build(context, manager.getAppWidgetOptions(id)))
  }

  /** O lançador mudou o tamanho do widget (redimensionado pela pessoa, ou ajustado por ele): escolhe a disposição de novo. */
  override fun onAppWidgetOptionsChanged(context: Context, manager: AppWidgetManager, appWidgetId: Int, newOptions: Bundle) {
    manager.updateAppWidget(appWidgetId, build(context, newOptions))
  }

  companion object {
    private const val PREFS = "mojidojo_widget"
    private const val KEY_DUE = "due"
    private const val KEY_UPCOMING = "upcoming"
    private const val KEY_STREAK = "streak"

    /** A partir desta largura (dp), e com altura baixa, vale a disposição larga. */
    private const val WIDE_MIN_WIDTH_DP = 200
    private const val WIDE_MAX_HEIGHT_DP = 110

    /** Guarda o que o app calculou: vencidas agora, as horas (ms) em que vencem as próximas e a sequência de dias. */
    fun save(context: Context, dueNow: Int, upcoming: String, streak: Int) {
      context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
        .putInt(KEY_DUE, dueNow)
        .putString(KEY_UPCOMING, upcoming)
        .putInt(KEY_STREAK, streak)
        .apply()
    }

    /** Quantas estão vencidas agora: as que já estavam e as que venceram desde que o app guardou a lista; -1 se o app nunca guardou nada. */
    fun dueNow(context: Context, now: Long = System.currentTimeMillis()): Int {
      val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      val base = prefs.getInt(KEY_DUE, -1)
      if (base < 0) return -1
      val upcoming = prefs.getString(KEY_UPCOMING, "").orEmpty()
      val arrived = if (upcoming.isEmpty()) 0 else upcoming.split(',').count { (it.toLongOrNull() ?: Long.MAX_VALUE) <= now }
      return base + arrived
    }

    /** O widget está largo e baixo (como no Niagara)? Sem o tamanho informado, vale a disposição compacta. */
    fun isWide(options: Bundle?): Boolean {
      if (options == null) return false
      val width = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0)
      val height = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0)
      return width >= WIDE_MIN_WIDTH_DP && height in 1 until WIDE_MAX_HEIGHT_DP
    }

    fun build(context: Context, options: Bundle? = null): RemoteViews {
      val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      val due = dueNow(context)
      val streak = prefs.getInt(KEY_STREAK, 0)
      val layout = if (isWide(options)) R.layout.mojiwidget_review_wide else R.layout.mojiwidget_review
      val views = RemoteViews(context.packageName, layout)
      val days = if (streak == 1) "dia" else "dias"
      when {
        due < 0 -> {
          views.setTextViewText(R.id.mojiwidget_count, "—")
          views.setTextViewText(R.id.mojiwidget_label, "Abra o app para começar")
        }
        due == 0 -> {
          views.setTextViewText(R.id.mojiwidget_count, "0")
          views.setTextViewText(R.id.mojiwidget_label, if (streak > 0) "Em dia · $streak $days seguidos" else "Nada para revisar")
        }
        else -> {
          val what = if (due == 1) "revisão vencida" else "revisões vencidas"
          views.setTextViewText(R.id.mojiwidget_count, due.toString())
          views.setTextViewText(R.id.mojiwidget_label, if (streak > 0) "$what · $streak $days" else what)
        }
      }
      val launch = context.packageManager.getLaunchIntentForPackage(context.packageName)
      if (launch != null) {
        launch.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED
        val pending = PendingIntent.getActivity(context, 0, launch, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        views.setOnClickPendingIntent(R.id.mojiwidget_root, pending)
      }
      return views
    }

    fun component(context: Context) = ComponentName(context, ReviewWidgetProvider::class.java)

    /** Redesenha todos os widgets já colocados, cada um com o tamanho que o lançador deu a ele. */
    fun refresh(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      for (id in manager.getAppWidgetIds(component(context))) manager.updateAppWidget(id, build(context, manager.getAppWidgetOptions(id)))
    }
  }
}
