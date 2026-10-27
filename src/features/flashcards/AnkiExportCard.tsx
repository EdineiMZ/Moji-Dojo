import { useMemo, useState } from 'react';
import { Share } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppText, Button, Card } from '@/components';
import { useProgressStore } from '@/store';
import { ANKI_SETS, buildAnkiFile, type AnkiSet } from './anki';

const FILE_NAME = 'moji-dojo-anki.txt';

/** Exporta cartões num arquivo que o Anki importa (Arquivo → Importar), para continuar estudando fora do app. */
export function AnkiExportCard() {
  const vocab = useProgressStore((s) => s.vocab);
  const myPhrases = useProgressStore((s) => s.myPhrases);
  const [selected, setSelected] = useState<readonly AnkiSet[]>(['words-learned']);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const built = useMemo(() => buildAnkiFile(selected, { vocab, myPhrases }), [selected, vocab, myPhrases]);

  const toggle = (id: AnkiSet) => {
    setMessage(null);
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };

  const share = async () => {
    setMessage(null);
    try {
      const file = new File(Paths.cache, FILE_NAME);
      file.create({ overwrite: true });
      file.write(built.text);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'text/plain', dialogTitle: 'Enviar cartões para o Anki' });
        setMessage({ text: `${built.count} cartões prontos. No Anki: Arquivo → Importar, e escolha este arquivo.`, ok: true });
      } else {
        await Share.share({ message: built.text });
      }
    } catch {
      // Se o arquivo não puder ser criado ou enviado, o texto ainda pode ser compartilhado como mensagem.
      Share.share({ message: built.text }).catch(() => undefined);
      setMessage({ text: 'Não consegui criar o arquivo; enviei os cartões como texto.', ok: false });
    }
  };

  return (
    <Card>
      <AppText variant="title">Exportar para o Anki</AppText>
      <AppText color="muted">
        Gera um arquivo para importar no Anki (computador ou celular) e continuar estudando fora do app. Escolha o que levar:
      </AppText>
      {ANKI_SETS.map((set) => {
        const on = selected.includes(set.id);
        return (
          <Button
            key={set.id}
            label={`${on ? '✓' : '○'} ${set.label}`}
            variant={on ? 'soft' : 'ghost'}
            onPress={() => toggle(set.id)}
          />
        );
      })}
      <AppText variant="caption" color="muted">
        {built.count} cartão(ões) neste arquivo. Cada um tem frente, verso e uma etiqueta (MojiDojo::...). No Anki, use o tipo de nota “Básico” ou “Básico (e cartão invertido)”.
      </AppText>
      <Button label="Gerar e enviar o arquivo" onPress={() => void share()} disabled={built.count === 0} />
      {message ? (
        <AppText color={message.ok ? 'ok' : 'bad'} accessibilityLiveRegion="polite">
          {message.text}
        </AppText>
      ) : null}
    </Card>
  );
}
