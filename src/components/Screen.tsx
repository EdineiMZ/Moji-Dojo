import { useCallback, useRef, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeyboardHeight } from '@/hooks/useKeyboardHeight';
import { spacing, useTheme } from '@/theme';
import { ScrollIntoViewContext, type ScrollTarget } from './ScrollContext';

interface ScreenProps {
  children: ReactNode;
  /** Rolável (padrão). Use false para telas que cabem inteiras. */
  scroll?: boolean;
  /** Trava a rolagem (ex.: enquanto o dedo desenha). */
  scrollEnabled?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Fundo em degradê pastel + áreas seguras + margens padrão. */
export function Screen({ children, scroll = true, scrollEnabled = true, contentStyle }: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight();
  const scrollRef = useRef<ScrollView>(null);
  const contentRef = useRef<View>(null);

  // Rola até o campo focado, já que o teclado cobre o fim da tela. Se algo falhar, o campo fica onde está.
  const scrollIntoView = useCallback((target: ScrollTarget | null) => {
    if (!target) return;
    setTimeout(() => {
      const content = contentRef.current;
      if (!content) return;
      target.measureLayout(
        content,
        (_x, y) => scrollRef.current?.scrollTo({ y: Math.max(0, y - 140), animated: true }),
        () => undefined,
      );
    }, 150);
  }, []);

  const padding: ViewStyle = {
    // O topo seguro fica fora da área que rola (ver abaixo): o conteúdo para sob a barra de status em vez de passar por trás.
    paddingTop: scroll ? spacing.lg : insets.top + spacing.lg,
    // Com o teclado aberto, sobra espaço no fim para dar para rolar o campo para cima dele.
    paddingBottom: insets.bottom + spacing.xl + keyboardHeight,
    paddingHorizontal: spacing.lg,
  };

  return (
    <LinearGradient colors={colors.backgroundGradient} style={[styles.fill, scroll && { paddingTop: insets.top }]}>
      {scroll ? (
        <ScrollView
          ref={scrollRef}
          style={styles.fill}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* O conteúdo fica numa View própria: é em relação a ela que medimos onde está o campo focado. */}
          <View ref={contentRef} collapsable={false} style={[styles.content, padding, contentStyle]}>
            <ScrollIntoViewContext.Provider value={scrollIntoView}>{children}</ScrollIntoViewContext.Provider>
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content, padding, contentStyle]}>{children}</View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { gap: spacing.lg },
});
