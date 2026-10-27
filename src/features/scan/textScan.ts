import { requireOptionalNativeModule } from 'expo';

interface NativeTextScan {
  recognize(uri: string): Promise<{ text: string; lines: string[] }>;
}

/** O leitor de texto só existe no APK gerado com o módulo nativo; no Expo Go, na web e nos testes ele é null. */
const native = requireOptionalNativeModule<NativeTextScan>('TextScan');

export const scanAvailable: boolean = native !== null;

const JAPANESE = /[぀-ヿ一-鿿]/;

/** O texto tem alguma letra japonesa? */
export const hasJapanese = (text: string): boolean => JAPANESE.test(text);

/**
 * Limpa as linhas que o leitor devolveu: tira espaços sobrando, descarta ruído (linhas curtas sem nada de japonês, como
 * símbolos soltos) e linhas repetidas em sequência.
 */
export function cleanLines(lines: readonly string[]): string[] {
  const out: string[] = [];
  for (const raw of lines) {
    const line = raw.replace(/[\s　]+/g, ' ').trim();
    if (line.length === 0) continue;
    if (!hasJapanese(line) && line.length < 3) continue;
    if (out[out.length - 1] === line) continue;
    out.push(line);
  }
  return out;
}

export interface ScanResult {
  lines: string[];
}

/** Lê o texto japonês de uma foto, no próprio aparelho. Lança um erro com mensagem pronta se não der. */
export async function recognizeText(uri: string): Promise<ScanResult> {
  if (!native) throw new Error('Este app foi gerado sem o leitor de texto da câmera.');
  const result = await native.recognize(uri);
  return { lines: cleanLines(result.lines.length > 0 ? result.lines : result.text.split('\n')) };
}
