import { useEffect } from 'react';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { useSettingsStore } from '@/store';
import { SPEECH_RATES, type VoiceEngine } from '@/store/settingsStore';
import { speakJapanese } from './voiceStore';
import { VoicePacks } from './VoicePacks';
import { creditFor, resolveStyle, useVoicevoxStore, warmUpVoicevox } from './voicevox';
import { speakerInfo } from './voicevoxPacks';
import { speakerLabel, styleLabel } from './voicevoxText';

const SAMPLE = 'こんにちは。きょうも いっしょに がんばりましょう。';

const STATUS_TEXT = {
  unsupported: 'Este app foi gerado sem o VOICEVOX, então só a voz do Android está disponível.',
  missing: 'Este APK não tem o motor do VOICEVOX (o dicionário). No computador, rode npm run voicevox:setup e gere o APK de novo com o gerar-apk.bat.',
  novoices: 'O motor está no app, mas nenhuma voz foi baixada ainda. Baixe uma abaixo para usar.',
  idle: 'As vozes baixadas estão no app. Escolha VOICEVOX para carregar.',
  loading: 'Carregando as vozes... na primeira vez leva alguns segundos.',
  error: 'Não consegui iniciar o VOICEVOX.',
  ready: 'Pronto: as vozes rodam dentro do aparelho, sem internet.',
} as const;

/** Ajustes → voz: escolhe entre a voz do Android e o VOICEVOX (vozes de personagens de anime, no próprio aparelho). */
export function VoicevoxCard() {
  const engine = useSettingsStore((s) => s.voiceEngine);
  const style = useSettingsStore((s) => s.voicevoxStyle);
  const speed = useSettingsStore((s) => s.speechSpeed);
  const setEngine = useSettingsStore((s) => s.setVoiceEngine);
  const setStyle = useSettingsStore((s) => s.setVoicevoxStyle);
  const { status, speakers, error, installed, check, clearCache } = useVoicevoxStore();

  useEffect(() => {
    void check();
  }, [check]);

  if (status === 'unsupported') return null;

  const usable = status !== 'missing' && installed.length > 0;
  const active = resolveStyle(speakers, style);
  const speaker = speakers.find((s) => s.styles.some((st) => st.id === active));
  const credit = creditFor(speakers, active);

  const chooseEngine = (value: VoiceEngine) => {
    setEngine(value);
    if (value === 'voicevox') warmUpVoicevox();
  };

  return (
    <Card>
      <AppText variant="title">Voz de anime (VOICEVOX)</AppText>
      <AppText color="muted">{STATUS_TEXT[status]}</AppText>
      {status === 'error' ? (
        <AppText color="bad" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      {usable ? (
        <ChipRow
          options={[
            { value: 'system' as const, label: 'Voz do Android' },
            { value: 'voicevox' as const, label: 'VOICEVOX' },
          ]}
          value={engine}
          onChange={chooseEngine}
        />
      ) : null}

      {status === 'ready' && speakers.length > 0 ? (
        <>
          <AppText variant="caption" color="muted">
            PERSONAGEM
          </AppText>
          <ChipRow
            options={speakers.map((s) => {
              const info = speakerInfo(s.name);
              return { value: s.name, label: info ? speakerLabel(s.name, info.slug) : s.name };
            })}
            value={speaker?.name ?? ''}
            onChange={(name) => {
              const next = speakers.find((s) => s.name === name);
              const first = next?.styles.find((st) => st.name === 'ノーマル') ?? next?.styles[0];
              if (first) setStyle(first.id);
            }}
          />
          {speaker && speaker.styles.length > 1 ? (
            <>
              <AppText variant="caption" color="muted">
                TOM
              </AppText>
              <ChipRow options={speaker.styles.map((st) => ({ value: String(st.id), label: styleLabel(st.name) }))} value={String(active)} onChange={(id) => setStyle(Number(id))} />
            </>
          ) : null}
          <Button label="🔊 Ouvir esta voz" variant="soft" onPress={() => speakJapanese(SAMPLE, SPEECH_RATES[speed])} disabled={engine !== 'voicevox'} />
          {engine !== 'voicevox' ? (
            <AppText variant="caption" color="muted">
              Escolha VOICEVOX acima para usar esta voz. As gravações de falantes nativos (em Sons e vibração) continuam tendo prioridade nas palavras que as têm; desligue-as para ouvir só o VOICEVOX.
            </AppText>
          ) : null}
          <Button label="Limpar áudios guardados" variant="ghost" onPress={() => void clearCache()} />
        </>
      ) : null}

      {status !== 'missing' ? <VoicePacks /> : null}

      <AppText variant="caption" color="muted">
        <Bold>Créditos:</Bold> vozes do VOICEVOX (voicevox.hiroshiba.jp). {credit ? `Voz em uso: ${credit}. ` : ''}Cada personagem tem os seus termos; todas as vozes pedem o crédito &ldquo;VOICEVOX:nome do personagem&rdquo;.
      </AppText>
    </Card>
  );
}
