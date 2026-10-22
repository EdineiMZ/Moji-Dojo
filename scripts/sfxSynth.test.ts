// Este teste roda em Node, mas o projeto só carrega os tipos do Jest (para o código do app não usar
// APIs de Node por engano): declaramos aqui só o pedaço que usamos.
declare const __dirname: string;

interface Bytes {
  length: number;
  toString(encoding: string, start?: number, end?: number): string;
  readUInt16LE(offset: number): number;
  readUInt32LE(offset: number): number;
  equals(other: Bytes): boolean;
}
const fs = require('node:fs') as { readFileSync(file: string): Bytes; existsSync(file: string): boolean };
const path = require('node:path') as { join(...parts: string[]): string };

// O sintetizador é CommonJS (usado também pelo script de geração em Node); aqui só tipamos o retorno.
interface Synth {
  SAMPLE_RATE: number;
  SOUND_NAMES: string[];
  freq: (note: string) => number;
  renderSound: (name: string) => Float32Array;
  soundWav: (name: string) => Bytes;
}
const synth = require('./sfxSynth.cjs') as Synth;
const { SAMPLE_RATE, SOUND_NAMES, freq, renderSound, soundWav } = synth;

/** Energia da onda na frequência `hz` dentro de [from, to) segundos (algoritmo de Goertzel). */
function energyAt(samples: Float32Array, hz: number, from: number, to: number): number {
  const start = Math.floor(from * SAMPLE_RATE);
  const end = Math.min(samples.length, Math.floor(to * SAMPLE_RATE));
  const w = (2 * Math.PI * hz) / SAMPLE_RATE;
  const coeff = 2 * Math.cos(w);
  let s1 = 0;
  let s2 = 0;
  for (let i = start; i < end; i++) {
    const s0 = (samples[i] ?? 0) + coeff * s1 - s2;
    s2 = s1;
    s1 = s0;
  }
  return (s1 * s1 + s2 * s2 - coeff * s1 * s2) / (end - start) ** 2;
}

/** Qual das frequências candidatas tem mais energia no trecho. */
const loudest = (samples: Float32Array, candidates: Record<string, number>, from: number, to: number): string =>
  Object.entries(candidates).sort((a, b) => energyAt(samples, b[1], from, to) - energyAt(samples, a[1], from, to))[0]?.[0] ?? '';

describe('freq', () => {
  it('afinação de concerto: A4 = 440 Hz, C5 e uma oitava acima dobram', () => {
    expect(freq('A4')).toBeCloseTo(440);
    expect(freq('C5')).toBeCloseTo(523.25, 1);
    expect(freq('A5')).toBeCloseTo(880);
    expect(freq('C6') / freq('C5')).toBeCloseTo(2);
  });

  it('recusa notas inválidas', () => {
    expect(() => freq('H4')).toThrow();
  });
});

describe('os sons sintetizados', () => {
  it('há os seis sons usados pelo app', () => {
    expect([...SOUND_NAMES].sort()).toEqual(['complete', 'correct', 'open', 'perfect', 'tap', 'wrong']);
  });

  it.each(SOUND_NAMES.map((n) => [n]))('%s: sem estouro, sem estalo nas pontas e com som de verdade', (name) => {
    const samples = renderSound(name as string);
    const peak = samples.reduce((max, s) => Math.max(max, Math.abs(s)), 0);
    expect(peak).toBeGreaterThan(0.2); // audível
    expect(peak).toBeLessThanOrEqual(0.85 + 1e-6); // com folga, sem distorcer
    expect(Math.abs(samples[0] ?? 1)).toBeLessThan(0.01); // começa em silêncio
    expect(Math.abs(samples[samples.length - 1] ?? 1)).toBeLessThan(0.01); // termina em silêncio
  });

  it('são curtos: de 0,1 s (toque) a 1,5 s (100%), do menor para o maior em importância', () => {
    const seconds = (n: string) => renderSound(n).length / SAMPLE_RATE;
    expect(seconds('tap')).toBeLessThan(0.15);
    expect(seconds('open')).toBeLessThan(1.3);
    expect(seconds('correct')).toBeLessThan(0.7);
    expect(seconds('wrong')).toBeLessThan(0.7);
    expect(seconds('complete')).toBeLessThan(1.2);
    expect(seconds('perfect')).toBeGreaterThan(seconds('complete'));
    expect(seconds('perfect')).toBeLessThanOrEqual(1.6);
  });

  it('são determinísticos: sintetizar duas vezes dá exatamente as mesmas amostras', () => {
    for (const name of SOUND_NAMES) {
      const a = renderSound(name);
      const b = renderSound(name);
      expect(a.length).toBe(b.length);
      expect(a.every((value, i) => value === b[i])).toBe(true);
    }
  });
});

describe('as notas tocadas', () => {
  const notes = (names: string[]) => Object.fromEntries(names.map((n) => [n, freq(n)]));

  it('acerto: começa em sol e sobe para dó (soa "para cima")', () => {
    const s = renderSound('correct');
    const candidates = notes(['E5', 'G5', 'C6', 'E6']);
    expect(loudest(s, candidates, 0.02, 0.08)).toBe('G5');
    expect(loudest(s, candidates, 0.2, 0.3)).toBe('C6');
  });

  it('erro: notas graves e descendo, bem abaixo do acerto', () => {
    const s = renderSound('wrong');
    const candidates = notes(['F3', 'A3', 'G5', 'C6']);
    expect(loudest(s, candidates, 0.02, 0.1)).toBe('A3');
    expect(loudest(s, candidates, 0.25, 0.4)).toBe('F3');
    expect(freq('A3')).toBeLessThan(freq('G5') / 3);
  });

  it('conclusão: arpejo de dó maior subindo (C5, E5, G5, C6)', () => {
    const s = renderSound('complete');
    const candidates = notes(['C5', 'E5', 'G5', 'C6']);
    const heard = [0.03, 0.12, 0.21, 0.3].map((t) => loudest(s, candidates, t, t + 0.05));
    expect(heard).toEqual(['C5', 'E5', 'G5', 'C6']);
  });

  it('100%: sobe até o dó agudo e termina num acorde brilhante', () => {
    const s = renderSound('perfect');
    const arpeggio = notes(['C5', 'G5', 'C6', 'E6', 'G6', 'C7']);
    expect(loudest(s, arpeggio, 0.45, 0.5)).toBe('C7'); // topo do arpejo (começa em 0,42 s)
    const chord = notes(['C6', 'E6', 'G6']);
    const early = Object.keys(chord).map((n) => energyAt(s, chord[n] as number, 0.8, 1.1));
    expect(Math.min(...early)).toBeGreaterThan(0); // as três notas do acorde soam juntas
  });
});

describe('arquivo WAV', () => {
  const wav = (name: string) => soundWav(name);

  it.each(SOUND_NAMES.map((n) => [n]))('%s: cabeçalho PCM de 16 bits, mono, no tamanho certo', (name) => {
    const b = wav(name as string);
    expect(b.toString('ascii', 0, 4)).toBe('RIFF');
    expect(b.toString('ascii', 8, 12)).toBe('WAVE');
    expect(b.readUInt16LE(20)).toBe(1); // PCM
    expect(b.readUInt16LE(22)).toBe(1); // mono
    expect(b.readUInt32LE(24)).toBe(SAMPLE_RATE);
    expect(b.readUInt16LE(34)).toBe(16);
    expect(b.readUInt32LE(40)).toBe(b.length - 44);
    expect(b.readUInt32LE(4)).toBe(b.length - 8);
  });

  it('os cinco sons somam menos de 250 KB (não incham o app)', () => {
    const total = SOUND_NAMES.reduce((sum, n) => sum + wav(n).length, 0);
    expect(total).toBeLessThan(250 * 1024);
  });
});

describe('arquivos versionados em assets/sfx', () => {
  it.each(SOUND_NAMES.map((n) => [n]))('%s.wav é exatamente o que o gerador produz (rode npm run generate-sounds)', (name) => {
    const file = path.join(__dirname, '..', 'assets', 'sfx', `${name}.wav`);
    expect(fs.existsSync(file)).toBe(true);
    expect(fs.readFileSync(file).equals(soundWav(name as string))).toBe(true);
  });
});
