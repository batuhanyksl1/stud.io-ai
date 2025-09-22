import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ColorScheme = 'light' | 'dark' | 'system';

interface ThemeState {
  colorScheme: ColorScheme;
  isDark: boolean;
}

const initialState: ThemeState = {
  colorScheme: 'system',
  isDark: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
    },
    setIsDark: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
  },
});

export const { setColorScheme, setIsDark, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
