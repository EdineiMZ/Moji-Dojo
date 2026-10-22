import { useLocalSearchParams } from 'expo-router';
import { ComingSoon } from '@/components/ComingSoon';

export default function LessonScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  return (
    <ComingSoon
      title="Lição"
      text={`A tela de lição chega em breve.\nAbriu: ${id} (${mode === 'skip' ? 'só o teste' : 'lição completa'})`}
    />
  );
}
