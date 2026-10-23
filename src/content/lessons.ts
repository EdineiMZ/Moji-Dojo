import { LESSONS as BASE_LESSONS } from '@/data/lessons';
import { KANJI_EXTRA_LESSONS } from './kanjiExtra';

/** As lições do protótipo mais as de kanji novas (as ids das antigas não mudam, então o progresso salvo continua valendo). */
export const LESSONS: typeof BASE_LESSONS = { ...BASE_LESSONS, kanji: [...BASE_LESSONS.kanji, ...KANJI_EXTRA_LESSONS] };
