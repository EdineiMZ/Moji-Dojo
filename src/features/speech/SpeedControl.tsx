import { SegmentedControl } from '@/components';
import { useSettingsStore } from '@/store';
import type { SpeechSpeed } from '@/store/settingsStore';

const OPTIONS = [
  { value: 'normal' as const, label: 'Velocidade normal' },
  { value: 'slow' as const, label: 'Devagar' },
];

/** Escolha da velocidade da voz japonesa; fica salva. */
export function SpeedControl() {
  const speed = useSettingsStore((s) => s.speechSpeed);
  const setSpeed = useSettingsStore((s) => s.setSpeechSpeed);
  return <SegmentedControl<SpeechSpeed> options={OPTIONS} value={speed} onChange={setSpeed} />;
}
