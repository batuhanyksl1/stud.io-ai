import { useState, useEffect, createContext, useContext } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { SemanticColors } from '@/constants/DesignTokens';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  colors: typeof SemanticColors.light;
  setTheme: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeState() {
  const [mode, setMode] = useState<ThemeMode>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorScheme>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription?.remove();
  }, []);

  const colorScheme: ColorScheme = mode === 'system' ? systemColorScheme : mode;
  const colors = SemanticColors[colorScheme];
  const isDark = colorScheme === 'dark';

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return {
    mode,
    colorScheme,
    colors,
    setTheme,
    isDark,
  };
}

export { ThemeContext };
export type { ThemeMode, ColorScheme, ThemeContextType };
