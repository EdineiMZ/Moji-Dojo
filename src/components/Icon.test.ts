import { splitIconLabel } from './Icon';

describe('splitIconLabel', () => {
  it('troca o emoji do começo do rótulo por um ícone e guarda o resto do texto', () => {
    expect(splitIconLabel('🔊 Ouvir')).toEqual({ icon: 'speaker', text: 'Ouvir' });
    expect(splitIconLabel('📷 Câmera')).toEqual({ icon: 'camera', text: 'Câmera' });
    expect(splitIconLabel('✨ IA')).toEqual({ icon: 'sparkles', text: 'IA' });
    expect(splitIconLabel('🎁 Abrir o baú do dia')).toEqual({ icon: 'gift', text: 'Abrir o baú do dia' });
  });

  it('um rótulo só com o emoji fica sem texto', () => {
    expect(splitIconLabel('🔊')).toEqual({ icon: 'speaker', text: '' });
  });

  it('rótulo sem emoji no começo fica como está', () => {
    expect(splitIconLabel('Revisar agora (10)')).toEqual({ icon: null, text: 'Revisar agora (10)' });
    expect(splitIconLabel('Ouvir 🔊')).toEqual({ icon: null, text: 'Ouvir 🔊' });
  });
});
