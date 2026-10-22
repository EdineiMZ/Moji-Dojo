import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, useTheme } from '@/theme';

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
  const padding: ViewStyle = {
    paddingTop: insets.top + spacing.lg,
    paddingBottom: insets.bottom + spacing.xl,
    paddingHorizontal: spacing.lg,
  };

  return (
    <LinearGradient colors={colors.backgroundGradient} style={styles.fill}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, padding, contentStyle]}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
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
