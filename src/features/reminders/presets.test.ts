import { DEFAULT_REMINDERS } from './plan';
import { exampleMessages, presetOf, PRESETS, timeChoiceOf } from './presets';

describe('lembretes prontos', () => {
  it('cada pronto aplica as regras certas e é reconhecido de volta', () => {
    for (const preset of PRESETS) {
      const settings = { ...DEFAULT_REMINDERS, ...preset.patch };
      expect(presetOf(settings)).toBe(preset.value);
    }
    expect(PRESETS.find((p) => p.value === 'light')?.patch.risk).toBe(false);
    expect(PRESETS.find((p) => p.value === 'normal')?.patch.risk).toBe(true);
  });

  it('reconhece os horários prontos e o personalizado', () => {
    expect(timeChoiceOf(8, 0)).toBe('Manhã (8h)');
    expect(timeChoiceOf(19, 0)).toBeNull();
    expect(timeChoiceOf(8, 30)).toBeNull();
  });

  it('os exemplos usam o nome e a meta, e os "normais" mostram o aviso da noite', () => {
    const normal = exampleMessages('normal', 'Ana', 20);
    expect(normal).toHaveLength(3);
    expect(normal.join(' ')).toContain('Ana');
    expect(normal.join(' ')).toContain('20');
    expect(exampleMessages('light', '', 20)).toHaveLength(2);
    expect(exampleMessages('off', 'Ana', 20)).toEqual([]);
  });
});
