import { MPLUSRounded1c_400Regular } from '@expo-google-fonts/m-plus-rounded-1c/400Regular';
import { MPLUSRounded1c_700Bold } from '@expo-google-fonts/m-plus-rounded-1c/700Bold';

/**
 * Só os pesos Regular e Bold são carregados. Os imports vêm dos caminhos
 * por peso porque o índice do pacote carrega todos os pesos (~25 MB).
 */
export const fontAssets = {
  MPlusRounded1c_400Regular: MPLUSRounded1c_400Regular,
  MPlusRounded1c_700Bold: MPLUSRounded1c_700Bold,
};

export const fonts = {
  regular: 'MPlusRounded1c_400Regular',
  bold: 'MPlusRounded1c_700Bold',
} as const;
