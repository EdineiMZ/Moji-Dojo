// Sintetiza os efeitos sonoros do app do zero (ondas senoidais com harmônicos e decaimento).
// Como são gerados por código, são originais: não há sons de terceiros nem licença a conferir.
// É CommonJS de propósito: o script de geração (.mjs) e os testes (Jest) usam o mesmo código.

const SAMPLE_RATE = 22050;
const TWO_PI = Math.PI * 2;
/** Pico máximo da mistura (de 0 a 1): deixa folga para nunca estourar nem distorcer. */
const MAX_PEAK = 0.85;
/** Os últimos milissegundos de cada nota descem a zero, para não haver "estalo" no fim. */
const RELEASE_SECONDS = 0.012;

/** Frequência de uma nota ("C5", "F#3"...) em Hz, afinação de concerto (A4 = 440). */
function freq(name) {
  const m = /^([A-G])(#?)(\d)$/.exec(name);
  if (!m) throw new Error(`Nota inválida: ${name}`);
  const semitones = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1]] + (m[2] ? 1 : 0) + (Number(m[3]) - 4) * 12;
  return 440 * Math.pow(2, semitones / 12);
}

/**
 * Soma uma nota ao buffer: harmônicos [múltiplo, amplitude], ataque curto e queda exponencial.
 * `decay` é a fração da duração em que o som cai a ~37% (menor = mais seco).
 */
function addNote(buffer, { note, start, duration, gain, partials = [[1, 1], [2, 0.28], [3, 0.1]], decay = 0.3 }) {
  const f0 = freq(note);
  const attack = 0.006;
  const total = partials.reduce((sum, [, amp]) => sum + amp, 0);
  const first = Math.floor(start * SAMPLE_RATE);
  const last = Math.min(buffer.length, Math.ceil((start + duration) * SAMPLE_RATE));
  for (let i = first; i < last; i++) {
    const t = i / SAMPLE_RATE - start;
    const envelope = t < attack ? t / attack : Math.exp(-(t - attack) / (duration * decay));
    const fade = Math.min(1, (duration - t) / RELEASE_SECONDS);
    let wave = 0;
    for (const [multiple, amp] of partials) {
      const f = f0 * multiple;
      if (f < SAMPLE_RATE / 2) wave += amp * Math.sin(TWO_PI * f * t);
    }
    buffer[i] += (wave / total) * gain * envelope * Math.max(0, fade);
  }
}

const arpeggio = (names, step, duration, gain) =>
  names.map((note, i) => ({ note, start: i * step, duration, gain }));

/** Cada som: duração total (s) e as notas que o formam. */
const SOUND_SPECS = {
  /** Toque curto e macio (botões e teclas): um "pop" grave, sem brilho. */
  tap: { length: 0.1, notes: [{ note: 'A5', start: 0, duration: 0.08, gain: 0.5, partials: [[1, 1], [2, 0.08]], decay: 0.35 }] },
  /** Abertura do app: três notas suaves subindo, como um sininho. */
  open: {
    length: 1.1,
    notes: [
      { note: 'G5', start: 0, duration: 0.55, gain: 0.4, decay: 0.4 },
      { note: 'D6', start: 0.16, duration: 0.6, gain: 0.4, decay: 0.4 },
      { note: 'G6', start: 0.32, duration: 0.7, gain: 0.35, partials: [[1, 1], [2, 0.12]], decay: 0.45 },
    ],
  },
  /** Acerto: duas notas subindo, claras. */
  correct: {
    length: 0.55,
    notes: [
      { note: 'G5', start: 0, duration: 0.3, gain: 0.55 },
      { note: 'C6', start: 0.09, duration: 0.42, gain: 0.55 },
    ],
  },
  /** Erro: duas notas graves descendo, suaves (nada de buzina). */
  wrong: {
    length: 0.5,
    notes: [
      { note: 'A3', start: 0, duration: 0.24, gain: 0.6, partials: [[1, 1], [2, 0.35]], decay: 0.5 },
      { note: 'F3', start: 0.11, duration: 0.34, gain: 0.6, partials: [[1, 1], [2, 0.35]], decay: 0.5 },
    ],
  },
  /** Lição ou revisão concluída: arpejo de dó maior. */
  complete: { length: 0.95, notes: arpeggio(['C5', 'E5', 'G5', 'C6'], 0.09, 0.55, 0.5) },
  /** 100%: arpejo longo e um acorde brilhante no fim. */
  perfect: {
    length: 1.5,
    notes: [
      ...arpeggio(['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C7'], 0.07, 0.5, 0.42),
      { note: 'C6', start: 0.55, duration: 0.85, gain: 0.3 },
      { note: 'E6', start: 0.55, duration: 0.85, gain: 0.3 },
      { note: 'G6', start: 0.55, duration: 0.85, gain: 0.3 },
    ],
  },
};

const SOUND_NAMES = Object.keys(SOUND_SPECS);

/** As amostras do som, de -1 a 1. Determinístico: o mesmo nome sempre dá exatamente as mesmas amostras. */
function renderSound(name) {
  const spec = SOUND_SPECS[name];
  if (!spec) throw new Error(`Som desconhecido: ${name}`);
  const samples = new Float32Array(Math.ceil(spec.length * SAMPLE_RATE));
  for (const n of spec.notes) addNote(samples, n);
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  if (peak > MAX_PEAK) {
    const scale = MAX_PEAK / peak;
    for (let i = 0; i < samples.length; i++) samples[i] *= scale;
  }
  return samples;
}

/** Arquivo WAV (PCM de 16 bits, mono) a partir das amostras. */
function toWav(samples) {
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // tamanho do bloco fmt
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28); // bytes por segundo
  buffer.writeUInt16LE(2, 32); // bytes por amostra
  buffer.writeUInt16LE(16, 34); // bits por amostra
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  }
  return buffer;
}

const soundWav = (name) => toWav(renderSound(name));

module.exports = { SAMPLE_RATE, SOUND_SPECS, SOUND_NAMES, freq, renderSound, toWav, soundWav };
