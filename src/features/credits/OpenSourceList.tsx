import { useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { AppText, Bold, Button, Collapsible, PressableScale } from '@/components';
import { NOTICE_TEXTS, OPEN_SOURCE, type OpenSourceItem } from '@/content/openSource';
import { spacing, useTheme } from '@/theme';
import { groupByLicense, noticeLink } from './openSourceGroups';

const KIND_LABEL = { js: 'pacote do app', android: 'biblioteca Android', native: 'componente nativo' } as const;

/** Um componente: nome e versão, e, ao tocar, o texto da licença (ou um botão para os termos, quando não é licença livre). */
function Row({ item }: { item: OpenSourceItem }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const link = noticeLink(item);
  return (
    <View style={[styles.row, { borderBottomColor: colors.line }]}>
      <PressableScale accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${item.name}. ${open ? 'Aberto' : 'Fechado'}`} onPress={() => setOpen((v) => !v)}>
        <AppText>
          <Bold>{item.name}</Bold>
          {item.version ? ` ${item.version}` : ''}
        </AppText>
        <AppText variant="caption" color="muted">
          {KIND_LABEL[item.kind]} · {open ? 'tocar para fechar' : 'tocar para ver a licença'}
        </AppText>
      </PressableScale>
      {open ? (
        <>
          {item.text !== null ? (
            <AppText variant="caption" color="muted" selectable>
              {NOTICE_TEXTS[item.text]}
            </AppText>
          ) : null}
          {link ? <Button label="Abrir a página dos termos" variant="soft" onPress={() => void Linking.openURL(link)} /> : null}
        </>
      ) : null}
    </View>
  );
}

/** Os avisos de terceiros que acompanham o ONNX Runtime do VOICEVOX (muito longos: só são carregados ao abrir). */
function OnnxNotices() {
  const [chunks, setChunks] = useState<readonly string[]>([]);
  useEffect(() => {
    void import('@/content/openSourceOnnx').then((m) => setChunks(m.ONNX_NOTICES));
  }, []);
  return (
    <View style={styles.list}>
      {chunks.map((chunk, i) => (
        <AppText key={i} variant="caption" color="muted" selectable>
          {chunk}
        </AppText>
      ))}
    </View>
  );
}

/** Licenças de código aberto, agrupadas por licença; cada grupo abre com um toque. */
export function OpenSourceList() {
  const groups = useMemo(() => groupByLicense(OPEN_SOURCE), []);
  const native = OPEN_SOURCE.filter((i) => i.kind === 'native');
  return (
    <View style={styles.list}>
      <AppText color="muted">
        {OPEN_SOURCE.length} componentes de terceiros, com o aviso de licença de cada um, como as licenças pedem. Os pacotes do app são os que entram de fato no código; as bibliotecas Android são as que o Gradle empacota.
      </AppText>
      <Collapsible title="Componentes nativos" hint="VOICEVOX, ONNX Runtime, Open JTalk e ML Kit">
        <View style={styles.list}>
          {native.map((item) => (
            <Row key={item.name} item={item} />
          ))}
          <Collapsible title="Avisos do ONNX Runtime" hint="Texto longo: as licenças dos projetos que ele usa">
            <OnnxNotices />
          </Collapsible>
        </View>
      </Collapsible>
      {groups.map((group) => (
        <Collapsible key={group.license} title={`${group.license} (${group.items.length})`}>
          <View style={styles.list}>
            {group.items
              .filter((i) => i.kind !== 'native')
              .map((item) => (
                <Row key={`${item.kind}:${item.name}`} item={item} />
              ))}
          </View>
        </Collapsible>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  row: { gap: spacing.sm, paddingBottom: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
});
