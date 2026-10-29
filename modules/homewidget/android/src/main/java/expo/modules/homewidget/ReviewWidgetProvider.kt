package expo.modules.homewidget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

/**
 * O widget "Revisão do dia": mostra quantas revisões estão vencidas e a sequência de dias; tocar abre o app. O app guarda aqui
 * (SharedPreferences) o que está vencido agora e a hora em que vencem as próximas, então a conta continua certa a cada
 * atualização do sistema, mesmo com o app fechado.
 */
class ReviewWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(context: Context, manager: AppWidgetManager, appWidgetIds: IntArray) {
    for (id in appWidgetIds) manager.updateAppWidget(id, build(context))
  }

  companion object {
    private const val PREFS = "mojidojo_widget"
    private const val KEY_DUE = "due"
    private const val KEY_UPCOMING = "upcoming"
    private const val KEY_STREAK = "streak"

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

    fun build(context: Context): RemoteViews {
      val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
      val due = dueNow(context)
      val streak = prefs.getInt(KEY_STREAK, 0)
      val views = RemoteViews(context.packageName, R.layout.mojiwidget_review)
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

    /** Redesenha todos os widgets já colocados na tela. */
    fun refresh(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val ids = manager.getAppWidgetIds(component(context))
      if (ids.isNotEmpty()) manager.updateAppWidget(ids, build(context))
    }
  }
}
