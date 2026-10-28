import { useState } from 'react';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';

/** A melhor transcrição de uma lista de alternativas: a primeira que não é vazia, sem espaços sobrando e no tamanho máximo. */
export const pickTranscript = (results: readonly { transcript: string }[], max: number): string => (results.find((r) => r.transcript.trim() !== '')?.transcript.trim() ?? '').slice(0, max);

/** A mensagem para cada erro do reconhecimento de fala (em português, sem jargão). */
export function speechErrorMessage(code: string): string {
  if (code === 'no-speech') return 'Não ouvi nada. Fale perto do microfone e tente de novo.';
  if (code === 'not-allowed') return 'Sem permissão para o microfone ou para o reconhecimento de fala.';
  return 'O reconhecimento de fala falhou agora. Confira a internet e tente de novo.';
}

/**
 * Fala em japonês vira texto: `toggle` começa (ou para) de ouvir e `onText` recebe o que foi dito. Usa o serviço de fala do
 * Android, que pode enviar o áudio ao Google conforme a configuração do aparelho.
 */
export function useSpokenInput(onText: (text: string) => void, max: number) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');

  useSpeechRecognitionEvent('result', (event) => {
    if (!event.isFinal) return;
    const text = pickTranscript(event.results, max);
    if (text) onText(text);
  });
  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('error', (event) => {
    setListening(false);
    setError(speechErrorMessage(event.error));
  });

  const toggle = async () => {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    setError('');
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      setError('Este aparelho não tem reconhecimento de fala disponível (precisa do app Google).');
      return;
    }
    const { granted } = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!granted) {
      setError(speechErrorMessage('not-allowed'));
      return;
    }
    setListening(true);
    ExpoSpeechRecognitionModule.start({ lang: 'ja-JP', interimResults: false, maxAlternatives: 3, continuous: false });
  };

  return { listening, error, toggle };
}
