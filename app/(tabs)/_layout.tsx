import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { hapticLight } from '@/lib/haptics';
import { fonts, useTheme } from '@/theme';

/** Ícone da aba: um caractere japonês, combinando com o tema do app. */
function TabGlyph({ char, color }: { char: string; color: ColorValue }) {
  // O leitor de tela já lê o título da aba; o caractere do ícone é só visual.
  return (
    <Text accessible={false} importantForAccessibility="no" style={{ fontFamily: fonts.bold, fontSize: 22, color }}>
      {char}
    </Text>
  );
}

const TABS = [
  { name: 'index', title: 'Início', glyph: '今' },
  { name: 'trail', title: 'Trilha', glyph: '道' },
  { name: 'listen', title: 'Ouvir', glyph: '聞' },
  { name: 'phrases', title: 'Frases', glyph: '話' },
  { name: 'keyboard', title: 'Teclado', glyph: 'あ' },
] as const;

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenListeners={{ tabPress: () => hapticLight() }}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title, tabBarIcon: ({ color }) => <TabGlyph char={tab.glyph} color={color} /> }}
        />
      ))}
    </Tabs>
  );
}
