/**
 * Design Token System
 *
 * This file contains all design tokens following the design system methodology.
 * Tokens are organized hierarchically: primitive -> semantic -> component-specific
 */

// Primitive Color Tokens (Base Colors)
export const PrimitiveColors = {
  // Blue Scale (LinkedIn Primary)
  blue50: "#EFF6FF",
  blue100: "#DBEAFE",
  blue200: "#BFDBFE",
  blue300: "#93C5FD",
  blue400: "#60A5FA",
  blue500: "#3B82F6",
  blue600: "#0077B5", // LinkedIn Primary
  blue700: "#004182",
  blue800: "#1E3A8A",
  blue900: "#1E1B4B",

  // Gray Scale (Neutral)
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",

  // Accent Colors
  amber50: "#FFFBEB",
  amber100: "#FEF3C7",
  amber500: "#F59E0B",
  amber600: "#D97706",
  amber900: "#92400E",

  green50: "#ECFDF5",
  green100: "#D1FAE5",
  green500: "#10B981",
  green600: "#059669",
  green900: "#065F46",

  red50: "#FEF2F2",
  red100: "#FEE2E2",
  red500: "#EF4444",
  red600: "#DC2626",
  red900: "#B91C1C",

  // Pure Colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

// Semantic Color Tokens (Purpose-based)
export const SemanticColors = {
  light: {
    // Primary Brand Colors
    primary: PrimitiveColors.blue600,
    primaryHover: PrimitiveColors.blue700,
    primaryActive: PrimitiveColors.blue800,
    primarySubtle: PrimitiveColors.blue50,

    // Secondary Colors
    secondary: PrimitiveColors.gray600,
    secondaryHover: PrimitiveColors.gray700,
    secondarySubtle: PrimitiveColors.gray100,

    // Background Colors
    background: PrimitiveColors.gray50,
    surface: PrimitiveColors.white,
    surfaceElevated: PrimitiveColors.white,
    overlay: "rgba(0, 0, 0, 0.5)",

    // Text Colors
    textPrimary: PrimitiveColors.gray900,
    textSecondary: PrimitiveColors.gray600,
    textTertiary: PrimitiveColors.gray400,
    textInverse: PrimitiveColors.white,
    textOnPrimary: PrimitiveColors.white,

    // Border Colors
    border: PrimitiveColors.gray200,
    borderSubtle: PrimitiveColors.gray100,
    borderFocus: PrimitiveColors.blue600,

    // Status Colors
    success: PrimitiveColors.green500,
    successSubtle: PrimitiveColors.green50,
    warning: PrimitiveColors.amber500,
    warningSubtle: PrimitiveColors.amber50,
    error: PrimitiveColors.red500,
    errorSubtle: PrimitiveColors.red50,

    // Interactive Colors
    interactive: PrimitiveColors.blue600,
    interactiveHover: PrimitiveColors.blue700,
    interactiveActive: PrimitiveColors.blue800,
    interactiveDisabled: PrimitiveColors.gray300,
  },
  dark: {
    // Primary Brand Colors
    primary: PrimitiveColors.blue500,
    primaryHover: PrimitiveColors.blue400,
    primaryActive: PrimitiveColors.blue300,
    primarySubtle: PrimitiveColors.blue900,

    // Secondary Colors
    secondary: PrimitiveColors.gray400,
    secondaryHover: PrimitiveColors.gray300,
    secondarySubtle: PrimitiveColors.gray800,

    // Background Colors
    background: PrimitiveColors.gray900,
    surface: PrimitiveColors.gray800,
    surfaceElevated: PrimitiveColors.gray700,
    overlay: "rgba(0, 0, 0, 0.7)",

    // Text Colors
    textPrimary: PrimitiveColors.gray100,
    textSecondary: PrimitiveColors.gray400,
    textTertiary: PrimitiveColors.gray500,
    textInverse: PrimitiveColors.gray900,
    textOnPrimary: PrimitiveColors.white,

    // Border Colors
    border: PrimitiveColors.gray700,
    borderSubtle: PrimitiveColors.gray800,
    borderFocus: PrimitiveColors.blue500,

    // Status Colors
    success: PrimitiveColors.green500,
    successSubtle: PrimitiveColors.green900,
    warning: PrimitiveColors.amber500,
    warningSubtle: PrimitiveColors.amber900,
    error: PrimitiveColors.red500,
    errorSubtle: PrimitiveColors.red900,

    // Interactive Colors
    interactive: PrimitiveColors.blue500,
    interactiveHover: PrimitiveColors.blue400,
    interactiveActive: PrimitiveColors.blue300,
    interactiveDisabled: PrimitiveColors.gray600,
  },
} as const;

// Spacing Tokens (8px base system)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  xxxxl: 96,
} as const;

// Typography Tokens
export const Typography = {
  fontFamily: {
    // Primary fonts
    primary: "Inter-Regular",
    medium: "Inter-Medium",
    semiBold: "Inter-SemiBold",
    bold: "Inter-Bold",

    // Alternative fonts
    poppins: "Poppins-Regular",
    poppinsMedium: "Poppins-Medium",
    poppinsSemiBold: "Poppins-SemiBold",
    poppinsBold: "Poppins-Bold",

    montserrat: "Montserrat-Regular",
    montserratMedium: "Montserrat-Medium",
    montserratSemiBold: "Montserrat-SemiBold",
    montserratBold: "Montserrat-Bold",

    // Logo fonts
    bebasNeue: "BebasNeue-Regular",
    oswald: "Oswald-Regular",
    oswaldMedium: "Oswald-Medium",
    oswaldBold: "Oswald-Bold",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
    xxxxxxl: 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
  },
} as const;

// Border Radius Tokens
export const BorderRadius = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// Shadow Tokens
export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 0,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
} as const;

// Animation Tokens
export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 800,
  },
  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
} as const;

// Component-specific Tokens
export const ComponentTokens = {
  button: {
    height: {
      sm: 36,
      md: 44,
      lg: 52,
    },
    padding: {
      sm: { horizontal: Spacing.md, vertical: Spacing.xs },
      md: { horizontal: Spacing.lg, vertical: Spacing.sm },
      lg: { horizontal: Spacing.xl, vertical: Spacing.md },
    },
  },
  input: {
    height: 44,
    padding: Spacing.md,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
} as const;

// Breakpoints for Responsive Design
export const Breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

// Z-Index Scale
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 1070,
} as const;

// Font Helper Functions
export const getFontFamily = {
  // Inter fonts
  inter: {
    regular: Typography.fontFamily.primary,
    medium: Typography.fontFamily.medium,
    semiBold: Typography.fontFamily.semiBold,
    bold: Typography.fontFamily.bold,
  },
  // Poppins fonts
  poppins: {
    regular: Typography.fontFamily.poppins,
    medium: Typography.fontFamily.poppinsMedium,
    semiBold: Typography.fontFamily.poppinsSemiBold,
    bold: Typography.fontFamily.poppinsBold,
  },
  // Montserrat fonts
  montserrat: {
    regular: Typography.fontFamily.montserrat,
    medium: Typography.fontFamily.montserratMedium,
    semiBold: Typography.fontFamily.montserratSemiBold,
    bold: Typography.fontFamily.montserratBold,
  },
  // Logo fonts
  logo: {
    bebasNeue: Typography.fontFamily.bebasNeue,
    oswald: Typography.fontFamily.oswald,
    oswaldMedium: Typography.fontFamily.oswaldMedium,
    oswaldBold: Typography.fontFamily.oswaldBold,
  },
} as const;
