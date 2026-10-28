import { useEffect, useState } from 'react';
import { Linking, StyleSheet, Switch, TextInput, View } from 'react-native';
import { AppText, Bold, Button, Card, ChipRow } from '@/components';
import { useNow } from '@/hooks/useNow';
import { useAiStore, useSettingsStore } from '@/store';
import { fonts, fontSizes, radii, spacing, useTheme } from '@/theme';
import { AiError } from './client';
import { cleanKey, looksLikeKey, useAiKeys } from './keyStore';
import { PROVIDER_IDS, PROVIDERS, type AiProvider } from './providers';
import { LIMIT_OPTIONS, limitLabel, sanitizeCustomUrl, usageToday } from './settings';
import { ask } from './useAi';

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; text: string } | { kind: 'error'; text: string };

/** Ajustes → IA: liga o recurso, escolhe o provedor (Gemini, Claude ou GPT), guarda a chave com segurança e testa a conexão. */
export function AiSettingsCard() {
  const { colors } = useTheme();
  const ai = useSettingsStore((s) => s.ai);
  const usage = useSettingsStore((s) => s.aiUsage);
  const setAi = useSettingsStore((s) => s.setAi);
  const phrases = useAiStore((s) => s.phrases.length);
  const clearAll = useAiStore((s) => s.clearAll);
  const now = useNow();
  const { loaded, has, refresh, save, remove } = useAiKeys();
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  // null = mostra o modelo salvo; texto = o que está sendo digitado.
  const [modelDraft, setModelDraft] = useState<string | null>(null);

  useEffect(() => {
    if (!loaded) void refresh();
  }, [loaded, refresh]);

  const provider = ai.provider;
  const info = PROVIDERS[provider];
  const hasKey = has[provider];
  const isCustom = provider === 'custom';
  const [urlDraft, setUrlDraft] = useState<string | null>(null);
  const shownUrl = urlDraft ?? ai.customUrl;
  const urlProblem = urlDraft !== null && urlDraft.trim() !== '' && sanitizeCustomUrl(urlDraft) === '';
  const commitUrl = () => {
    if (urlDraft === null) return;
    const clean = sanitizeCustomUrl(urlDraft);
    if (clean !== ai.customUrl && (clean !== '' || urlDraft.trim() === '')) setAi({ customUrl: clean });
    if (!urlProblem) setUrlDraft(null);
  };
  const today = usageToday(usage, now);

  const choose = (value: AiProvider) => {
    setAi({ provider: value });
    setStatus({ kind: 'idle' });
    setDraft('');
    setModelDraft(null);
  };

  const saveKey = async () => {
    const key = cleanKey(draft);
    if (!looksLikeKey(key)) {
      setStatus({ kind: 'error', text: 'Isso não parece uma chave de API. Cole a chave inteira, sem espaços.' });
      return;
    }
    const ok = await save(provider, key);
    setDraft('');
    setStatus(ok ? { kind: 'ok', text: 'Chave guardada com segurança neste aparelho.' } : { kind: 'error', text: 'Não consegui guardar a chave neste aparelho.' });
  };

  const test = async () => {
    setStatus({ kind: 'busy' });
    try {
      const reply = await ask({
        system: 'Responda somente com JSON.',
        user: 'Responda exatamente {"ok": true}.',
        maxTokens: 50,
        parse: (json) => (typeof json === 'object' && json !== null && (json as { ok?: unknown }).ok === true ? true : null),
      });
      setStatus(reply ? { kind: 'ok', text: `Funcionando com ${ai.models[provider]}.` } : { kind: 'error', text: 'Resposta inesperada.' });
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof AiError ? error.message : 'Não consegui falar com a IA.' });
    }
  };

  const commitModel = () => {
    const value = (modelDraft ?? '').trim();
    if (value && value !== ai.models[provider]) setAi({ models: { ...ai.models, [provider]: value } });
    setModelDraft(null);
  };

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Inteligência artificial</AppText>
      <AppText color="muted">
        Opcional. Com a sua chave de API, a IA corrige suas frases, explica erros e cria frases para o simulador. Ela só gera <Bold>texto</Bold>: o áudio continua sendo a voz do
        aparelho. Sem internet ou sem chave, o app funciona normalmente.
      </AppText>

      <View style={styles.row}>
        <View style={styles.flex}>
          <AppText>Usar IA</AppText>
          <AppText variant="caption" color="muted">
            Desligado, nenhum recurso de IA aparece.
          </AppText>
        </View>
        <Switch
          value={ai.enabled}
          onValueChange={(enabled) => setAi({ enabled })}
          accessibilityLabel="Usar IA"
          trackColor={{ false: colors.line, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>

      {ai.enabled ? (
        <>
          <AppText variant="caption" color="muted">
            PROVEDOR
          </AppText>
          <ChipRow wrap options={PROVIDER_IDS.map((id) => ({ value: id, label: PROVIDERS[id].label }))} value={provider} onChange={choose} />

          {isCustom ? (
            <>
              <AppText variant="caption" color="muted">
                ENDEREÇO DO SERVIDOR
              </AppText>
              <TextInput
                value={shownUrl}
                onChangeText={setUrlDraft}
                onBlur={commitUrl}
                onSubmitEditing={commitUrl}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                placeholder="https://meu-servidor.exemplo/v1"
                placeholderTextColor={colors.muted}
                accessibilityLabel="Endereço do servidor de IA"
                style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: urlProblem ? colors.bad : colors.line }]}
              />
              <AppText variant="caption" color={urlProblem ? 'bad' : 'muted'}>
                {urlProblem
                  ? 'Esse endereço não serve. Use https:// (o app não aceita http, que viaja sem criptografia), sem espaços e sem usuário e senha.'
                  : 'Qualquer servidor que fale o formato de chat da OpenAI (Ollama, LM Studio, llama.cpp, vLLM...) e responda por https. Para um servidor seu em casa, use um túnel ou proxy com https (por exemplo Tailscale Funnel ou Cloudflare Tunnel).'}
              </AppText>
            </>
          ) : null}
          <AppText variant="caption" color="muted">
            CHAVE DE API {isCustom ? '(opcional)' : ''} {hasKey ? '(guardada)' : '(não cadastrada)'}
          </AppText>
          <TextInput
            value={draft}
            onChangeText={(t) => {
              setDraft(t);
              setStatus({ kind: 'idle' });
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={hasKey ? 'Cole uma nova chave para trocar' : 'Cole a chave aqui'}
            placeholderTextColor={colors.muted}
            accessibilityLabel={`Chave de API do ${info.label}`}
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <View style={styles.buttons}>
            <Button label="Salvar chave" onPress={saveKey} disabled={draft.trim().length === 0} style={styles.flex} />
            {hasKey ? (
              <Button
                label="Apagar chave"
                variant="ghost"
                onPress={async () => {
                  await remove(provider);
                  setStatus({ kind: 'ok', text: 'Chave apagada.' });
                }}
                style={styles.flex}
              />
            ) : null}
          </View>
          <AppText variant="caption" color="muted">
            A chave fica no armazenamento seguro do Android, só neste aparelho. Ela <Bold>não entra no backup</Bold> nem é enviada a ninguém além de {isCustom ? 'do servidor que você informou' : info.label.split(' ')[0]}.
          </AppText>
          {isCustom ? null : (
            <AppText variant="caption" color="primary" accessibilityRole="link" onPress={() => void Linking.openURL(info.keyUrl)} style={styles.link}>
              Criar uma chave: {info.keyUrl.replace('https://', '')}
            </AppText>
          )}

          <AppText variant="caption" color="muted">
            MODELO
          </AppText>
          <TextInput
            value={modelDraft ?? ai.models[provider]}
            onChangeText={setModelDraft}
            onBlur={commitModel}
            onSubmitEditing={commitModel}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Nome do modelo"
            style={[styles.input, { color: colors.ink, backgroundColor: colors.background, borderColor: colors.line }]}
          />
          <AppText variant="caption" color="muted">
            {isCustom ? 'O nome do modelo como o seu servidor o conhece (por exemplo, o que o "ollama list" mostra).' : `O padrão é um modelo barato e rápido. Sugestões: ${info.models.join(', ')}.`}
          </AppText>

          <AppText variant="caption" color="muted">
            LIMITE DE PEDIDOS POR DIA
          </AppText>
          <ChipRow wrap options={LIMIT_OPTIONS.map((n) => ({ value: String(n), label: limitLabel(n) }))} value={String(ai.dailyLimit)} onChange={(v) => setAi({ dailyLimit: Number(v) })} />
          <AppText variant="caption" color="muted">
            Hoje: {today.calls} pedido{today.calls === 1 ? '' : 's'}, {today.tokensIn + today.tokensOut} tokens. Cada pedido usa a sua cota ou o seu crédito no provedor.
          </AppText>

          <Button label={status.kind === 'busy' ? 'Testando...' : 'Testar conexão'} variant="soft" onPress={test} disabled={(isCustom ? ai.customUrl === '' : !hasKey) || status.kind === 'busy'} />
          {status.kind === 'ok' || status.kind === 'error' ? (
            <AppText accessibilityLiveRegion="polite" color={status.kind === 'ok' ? 'ok' : 'bad'}>
              {status.text}
            </AppText>
          ) : null}

          {phrases > 0 ? (
            <Button label={`Apagar ${phrases} frase${phrases === 1 ? '' : 's'} geradas pela IA`} variant="ghost" onPress={clearAll} />
          ) : null}
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  buttons: { flexDirection: 'row', gap: spacing.sm },
  link: { textDecorationLine: 'underline', paddingVertical: spacing.xs },
  input: { borderWidth: 1.5, borderRadius: radii.md, paddingHorizontal: spacing.md, minHeight: 48, fontFamily: fonts.regular, fontSize: fontSizes.body },
});
