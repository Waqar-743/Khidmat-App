// KHIDMAT Design System — Typography
// Uses system fonts for reliability. Plus Jakarta Sans / JetBrains Mono
// can be loaded via expo-font when available.

import { Platform } from 'react-native';

// System font stacks per platform
const systemSans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif',
  default: 'System',
}) as string;

const systemMono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: '"JetBrains Mono", "SF Mono", "Fira Code", Consolas, monospace',
  default: 'monospace',
}) as string;

const systemSerif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  web: 'Georgia, "Times New Roman", Times, serif',
  default: 'serif',
}) as string;

export const Fonts = {
  heading: systemSans,
  headingSemiBold: systemSans,
  headingSerif: systemSerif,
  body: systemSans,
  bodyMedium: systemSans,
  code: systemMono,
  codeMedium: systemMono,
} as const;

export const Typography = {
  headlineLg: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.64,
  },
  headlineLgMobile: {
    fontFamily: Fonts.heading,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
  },
  headlineSerifLg: {
    fontFamily: Fonts.headingSerif,
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  headlineSerifMd: {
    fontFamily: Fonts.headingSerif,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headlineMd: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySerif: {
    fontFamily: Fonts.headingSerif,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodySerifBold: {
    fontFamily: Fonts.headingSerif,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
  bodyMdBold: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700' as const,
  },
  urduDisplay: {
    fontSize: 20,
    lineHeight: 36,
    fontWeight: '500' as const,
  },
  codeSm: {
    fontFamily: Fonts.code,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  codeSmBold: {
    fontFamily: Fonts.codeMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
} as const;
