import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';
import { fonts, useTheme } from '@/theme';

/** Ícone da aba: um kanji, combinando com o tema do app. */
function TabGlyph({ char, color }: { char: string; color: ColorValue }) {
  return <Text style={{ fontFamily: fonts.bold, fontSize: 22, color }}>{char}</Text>;
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: ({ color }) => <TabGlyph char="今" color={color} /> }}
      />
      <Tabs.Screen
        name="trail"
        options={{ title: 'Trilha', tabBarIcon: ({ color }) => <TabGlyph char="道" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Ajustes', tabBarIcon: ({ color }) => <TabGlyph char="設" color={color} /> }}
      />
    </Tabs>
  );
}
