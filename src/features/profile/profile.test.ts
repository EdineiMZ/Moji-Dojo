import { callName, cleanUsername, DEFAULT_PROFILE, isValidUsername, sanitizeProfile } from './profile';

describe('perfil', () => {
  it('limpa o nome: espaços, caracteres de controle e tamanho', () => {
    expect(cleanUsername('  Maria   da  Silva ')).toBe('Maria da Silva');
    expect(cleanUsername('Jo\u0000ão\n')).toBe('João');
    expect(cleanUsername('a'.repeat(50))).toHaveLength(20);
    expect(isValidUsername('   ')).toBe(false);
    expect(isValidUsername('Ed')).toBe(true);
  });

  it('lê um perfil estranho sem quebrar', () => {
    expect(sanitizeProfile(undefined)).toEqual(DEFAULT_PROFILE);
    expect(sanitizeProfile({ username: 42, onboarded: 'sim', goalMinutes: 'x' })).toEqual(DEFAULT_PROFILE);
    expect(sanitizeProfile({ username: ' Ana ', onboarded: true, goalMinutes: 20 })).toEqual({ username: 'Ana', onboarded: true, goalMinutes: 20 });
    expect(sanitizeProfile({ goalMinutes: -5 }).goalMinutes).toBe(0);
    expect(sanitizeProfile({ goalMinutes: 9999 }).goalMinutes).toBe(180);
  });

  it('chama a pessoa pelo nome só quando há nome', () => {
    expect(callName('Ana')).toBe('Ana, ');
    expect(callName('')).toBe('');
  });
});
