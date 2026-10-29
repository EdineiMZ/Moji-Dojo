import { useState } from 'react';
import { AppText, Button, Card } from '@/components';
import { useProgressStore } from '@/store';
import { pushWidget, requestPinWidget, widgetAvailable, widgetPlaced } from './homeWidget';

/** Ajustes: coloca o widget "Revisão do dia" na tela inicial do Android. */
export function WidgetCard() {
  const [message, setMessage] = useState('');

  if (!widgetAvailable) {
    return (
      <Card enterIndex={1}>
        <AppText variant="title">Widget na tela inicial</AppText>
        <AppText color="muted">Este app foi gerado sem o widget. Gere o APK de novo com o gerar-apk.bat para usá-lo.</AppText>
      </Card>
    );
  }

  const add = () => {
    // Já deixa o número certo no widget antes de ele aparecer.
    const { srs, vocab, conj, particles, days } = useProgressStore.getState();
    pushWidget({ srs, vocab, conj, particles, days });
    if (widgetPlaced()) {
      setMessage('O widget já está na sua tela inicial.');
      return;
    }
    setMessage(
      requestPinWidget()
        ? 'Confirme na janela que o Android abriu.'
        : 'O seu lançador não deixou o app adicionar o widget. Adicione pelo seletor de widgets dele e procure "Moji Dojo".',
    );
  };

  return (
    <Card enterIndex={1}>
      <AppText variant="title">Widget na tela inicial</AppText>
      <AppText color="muted">
        Mostra quantas revisões estão vencidas e os dias seguidos de estudo, sem abrir o app. Tocar nele abre o Moji Dojo. O número se atualiza sozinho ao longo do dia e a cada vez que você estuda.
      </AppText>
      <Button label="Adicionar à tela inicial" onPress={add} />
      {message ? (
        <AppText accessibilityLiveRegion="polite" color="muted">
          {message}
        </AppText>
      ) : null}
      <AppText variant="caption" color="muted">
        Alguns lançadores, como o Niagara, têm o próprio seletor de widgets e podem não abrir a confirmação do Android. Nesse caso, adicione o widget por esse seletor e procure &ldquo;Moji Dojo&rdquo; (ou segure um espaço vazio da tela inicial e toque em Widgets). O widget se ajusta sozinho ao tamanho que o lançador der: mais largo e baixo ele mostra o número ao lado do texto.
      </AppText>
    </Card>
  );
}
