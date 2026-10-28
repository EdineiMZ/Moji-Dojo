import { matchesSearch, sanitizeFavorites, sanitizeIntonation, sanitizePitch, sanitizeStaffStyle, toggleFavorite } from './voiceTuning';

describe('ajustes da voz', () => {
  it('altura e entonação ficam dentro do que o motor aceita', () => {
    expect(sanitizePitch(0.5)).toBe(0.15);
    expect(sanitizePitch(-3)).toBe(-0.15);
    expect(sanitizePitch('x')).toBe(0);
    expect(sanitizePitch(NaN)).toBe(0);
    expect(sanitizeIntonation(9)).toBe(1.5);
    expect(sanitizeIntonation(0)).toBe(0.5);
    expect(sanitizeIntonation(undefined)).toBe(1);
  });

  it('a voz do atendente é um estilo válido ou nada', () => {
    expect(sanitizeStaffStyle(3)).toBe(3);
    expect(sanitizeStaffStyle(-1)).toBeNull();
    expect(sanitizeStaffStyle(1.5)).toBeNull();
    expect(sanitizeStaffStyle('3')).toBeNull();
  });

  it('favoritos: sem repetir, só texto e liga/desliga', () => {
    expect(sanitizeFavorites(['a', 'a', 2, '', 'b'])).toEqual(['a', 'b']);
    expect(sanitizeFavorites('x')).toEqual([]);
    expect(toggleFavorite(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleFavorite(['a', 'b'], 'a')).toEqual(['b']);
  });

  it('a busca ignora maiúsculas e acentos e olha todos os campos', () => {
    expect(matchesSearch('zunda', 'Zundamon', 'Voz aguda')).toBe(true);
    expect(matchesSearch('AGUDA', 'Zundamon', 'Voz aguda')).toBe(true);
    expect(matchesSearch('voz gentil', 'Amehare Hau', 'Voz gentil e fofa')).toBe(true);
    expect(matchesSearch('aca', 'x', 'ação')).toBe(true);
    expect(matchesSearch('zzz', 'Zundamon', 'Voz aguda')).toBe(false);
    expect(matchesSearch('', 'qualquer')).toBe(true);
  });
});
