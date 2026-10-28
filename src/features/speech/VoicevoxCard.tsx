import { useEffect } from 'react';
import { AppText, Bold, Card } from '@/components';
import { useSettingsStore } from '@/store';
import { MyVoices } from './MyVoices';
import { VoicePacks } from './VoicePacks';
import { creditFor, resolveStyle, useVoicevoxStore } from './voicevox';

const STATUS_TEXT = {
  unsupported: 'Este app foi gerado sem o VOICEVOX, então só a voz do Android está disponível.',
  missing: 'Este APK não tem o motor do VOICEVOX (o dicionário). No computador, rode npm run voicevox:setup e gere o APK de novo com o gerar-apk.bat.',
  novoices: 'O motor está no app, mas nenhuma voz foi baixada ainda. Em 3 passos: 1) baixe uma voz abaixo; 2) toque em "Usar esta voz"; 3) pronto, o app passa a falar com ela.',
  idle: 'As vozes baixadas estão no app. Escolha uma em "Minhas vozes" para usar.',
  loading: 'Carregando a voz... na primeira vez leva alguns segundos.',
  error: 'Não consegui iniciar o VOICEVOX.',
  ready: 'Pronto: a voz roda dentro do aparelho, sem internet.',
} as const;

/** Ajustes → voz de anime: "Minhas vozes" (escolher e ouvir o que já foi baixado) e "Baixar vozes" (o catálogo). */
export function VoicevoxCard() {
  const style = useSettingsStore((s) => s.voicevoxStyle);
  const { status, speakers, error, check } = useVoicevoxStore();

  useEffect(() => {
    void check();
  }, [check]);

  if (status === 'unsupported') return null;

  const credit = creditFor(speakers, resolveStyle(speakers, style));

  return (
    <Card>
      <AppText variant="title">Voz de anime (VOICEVOX)</AppText>
      <AppText color="muted">{STATUS_TEXT[status]}</AppText>
      {status === 'error' ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      <MyVoices />

      {status !== 'missing' ? <VoicePacks /> : null}

      <AppText variant="caption" color="muted">
        <Bold>Créditos:</Bold> vozes do VOICEVOX (voicevox.hiroshiba.jp). {credit ? `Voz em uso: ${credit}. ` : ''}Cada personagem tem os seus termos; todas as vozes pedem o crédito &ldquo;VOICEVOX:nome do personagem&rdquo;.
      </AppText>
    </Card>
  );
}
