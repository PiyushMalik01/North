/**
 * GLOBAL THEME CONFIGURATION
 * Edit this file to change colors, fonts, and other design tokens globally
 */

export const theme = {
  // FONTS
  fonts: {
    primary: 'var(--font-roboto-condensed)', // Main font for all text (body, headings, UI)
    logo: 'var(--font-oswald)',              // Font ONLY for logo "NORTH"
  },

  // COLORS
  colors: {
    // Primary Background - Dark theme
    background: {
      primary: '#0D1117',
      secondary: '#161B22',
    },

    // Gradient for hero section
    gradient: {
      hero: 'linear-gradient(180deg, rgba(13, 17, 23, 1) 20%, rgba(8, 57, 140, 1) 63%, rgba(154, 109, 227, 1) 100%)',
      primary: 'linear-gradient(to right, #08398C, #9A6DE3)',
    },

    // Brand colors
    brand: {
      blue: '#08398C',
      purple: '#9A6DE3',
      blueLight: '#1E4D9F',
      purpleLight: '#B088E8',
    },

    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#C9D1D9',
      muted: '#8B949E',
      dark: '#0D1117',
    },

    // UI colors
    ui: {
      border: '#30363D',
      borderLight: '#484F58',
      card: '#161B22',
      cardHover: '#1C2128',
      button: '#040642',
      buttonHover: '#0D1117',
    },

    // Status colors
    status: {
      success: '#3FB950',
      warning: '#D29922',
      error: '#F85149',
      info: '#58A6FF',
    },
  },

  // SPACING
  spacing: {
    section: 'py-20',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },

  // TYPOGRAPHY
  typography: {
    hero: 'text-5xl md:text-7xl font-bold',
    heading1: 'text-4xl md:text-5xl font-bold',
    heading2: 'text-3xl md:text-4xl font-bold',
    heading3: 'text-2xl md:text-3xl font-semibold',
    body: 'text-base md:text-lg',
    bodyLarge: 'text-xl md:text-2xl',
  },

  // BORDER RADIUS
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  },

  // SHADOWS
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
} as const;

// TAILWIND COLOR CLASSES (for use in className)
export const twColors = {
  bgPrimary: 'bg-[#0D1117]',
  bgSecondary: 'bg-[#161B22]',
  bgCard: 'bg-[#161B22]',
  
  textPrimary: 'text-white',
  textSecondary: 'text-[#C9D1D9]',
  textMuted: 'text-[#8B949E]',
  
  brandBlue: 'bg-[#08398C]',
  brandPurple: 'bg-[#9A6DE3]',
  
  border: 'border-[#30363D]',
  borderLight: 'border-[#484F58]',
} as const;

export default theme;
