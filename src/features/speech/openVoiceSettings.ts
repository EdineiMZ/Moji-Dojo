import { Linking } from 'react-native';

/** Abre os ajustes de conversão de texto em voz do Android; se não der, os ajustes gerais do app. */
export async function openVoiceSettings(): Promise<void> {
  try {
    await Linking.sendIntent('com.android.settings.TTS_SETTINGS');
  } catch {
    await Linking.openSettings();
  }
}
