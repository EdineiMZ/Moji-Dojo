import { MAX_TEXT_LENGTH } from '@/features/ai/tasks';
import { cleanShared, useShareStore } from './sharedText';

jest.mock('expo-router', () => ({ router: { navigate: jest.fn() } }));

describe('texto compartilhado de outro app', () => {
  it('limpa o que vem de fora: controle, direção do texto e quebras de linha', () => {
    expect(cleanShared('  こんにちは  ')).toBe('こんにちは');
    expect(cleanShared('a\r\nb\rc')).toBe('a\nb\nc');
    expect(cleanShared('a\n\n\n\n\nb')).toBe('a\n\nb');
    expect(cleanShared('日\u0000本\u0007語‮')).toBe('日本語');
    expect(cleanShared('a​b')).toBe('ab');
  });

  it('corta no tamanho que a tela aceita e descarta o que não é texto ou fica vazio', () => {
    expect(cleanShared('あ'.repeat(MAX_TEXT_LENGTH + 500))).toHaveLength(MAX_TEXT_LENGTH);
    expect(cleanShared('   \n  ')).toBe('');
    expect(cleanShared(null)).toBe('');
    expect(cleanShared(42)).toBe('');
    expect(cleanShared({ text: 'x' })).toBe('');
  });

  it('a loja guarda o texto, avisa que chegou um novo e solta quando a tela o usa', () => {
    const store = useShareStore;
    store.setState({ text: null, nonce: 0 });
    expect(store.getState().receive('   ')).toBe(false);
    expect(store.getState().nonce).toBe(0);
    expect(store.getState().receive('ありがとう')).toBe(true);
    expect(store.getState()).toMatchObject({ text: 'ありがとう', nonce: 1 });
    // O mesmo texto de novo é outro compartilhamento: a tela precisa saber.
    expect(store.getState().receive('ありがとう')).toBe(true);
    expect(store.getState().nonce).toBe(2);
    store.getState().clear();
    expect(store.getState().text).toBeNull();
    expect(store.getState().nonce).toBe(2);
  });
});
