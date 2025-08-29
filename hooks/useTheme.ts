import { SemanticColors } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setColorScheme,
  setIsDark,
  toggleTheme,
} from "@/store/slices/themeSlice";
import { useEffect } from "react";
import { Appearance } from "react-native";

export type ColorScheme = "light" | "dark" | "system";

export function useTheme() {
  const dispatch = useAppDispatch();
  const { colorScheme, isDark } = useAppSelector((state) => state.theme);

  // System color scheme değişikliklerini dinle
  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: systemColorScheme }) => {
        if (colorScheme === "system") {
          dispatch(setIsDark(systemColorScheme === "dark"));
        }
      },
    );

    return () => subscription?.remove();
  }, [colorScheme, dispatch]);

  // İlk yüklemede system color scheme'i ayarla
  useEffect(() => {
    if (colorScheme === "system") {
      const systemColorScheme = Appearance.getColorScheme();
      dispatch(setIsDark(systemColorScheme === "dark"));
    }
  }, [colorScheme, dispatch]);

  const currentColorScheme: "light" | "dark" =
    colorScheme === "system"
      ? isDark
        ? "dark"
        : "light"
      : (colorScheme as "light" | "dark");

  const colors = SemanticColors[currentColorScheme] || SemanticColors.light;

  const setTheme = (newColorScheme: ColorScheme) => {
    dispatch(setColorScheme(newColorScheme));
  };

  const toggleDarkMode = () => {
    dispatch(toggleTheme());
  };

  return {
    colorScheme,
    colors,
    setTheme,
    isDark,
    toggleDarkMode,
  };
}
