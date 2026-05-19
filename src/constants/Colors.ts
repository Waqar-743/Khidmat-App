// KHIDMAT Design System — Color Palette (Material Design 3 + Agent Identity)
// Extracted from Stitch design files + Futuristic Agent System

export const Colors = {
  // Primary
  primary: '#005440',
  primaryContainer: '#0F6E56',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#9AEDCF',
  primaryFixed: '#A0F3D4',
  primaryFixedDim: '#84D6B9',
  inversePrimary: '#84D6B9',
  onPrimaryFixed: '#002117',
  onPrimaryFixedVariant: '#00513E',

  // Secondary
  secondary: '#2A6959',
  secondaryContainer: '#ADEDD8',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#2F6D5D',
  secondaryFixed: '#B0EFDB',
  secondaryFixedDim: '#94D3BF',
  onSecondaryFixed: '#002019',
  onSecondaryFixedVariant: '#095041',

  // Tertiary (Amber / Warning)
  tertiary: '#6B3F00',
  tertiaryContainer: '#8C5400',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#FFD5AC',
  tertiaryFixed: '#FFDCBB',
  tertiaryFixedDim: '#FFB869',
  onTertiaryFixed: '#2B1700',
  onTertiaryFixedVariant: '#673D00',

  // Error
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#93000A',

  // Surface / Background
  background: '#FCF8FF',
  surface: '#FCF8FF',
  surfaceBright: '#FCF8FF',
  surfaceDim: '#DAD7F3',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F2FF',
  surfaceContainer: '#EFECFF',
  surfaceContainerHigh: '#E8E5FF',
  surfaceContainerHighest: '#E2E0FC',
  surfaceVariant: '#E2E0FC',
  surfaceTint: '#086B53',

  // On Surface / Text
  onSurface: '#1A1A2E',
  onSurfaceVariant: '#3F4944',
  onBackground: '#1A1A2E',
  inverseSurface: '#2F2E43',
  inverseOnSurface: '#F2EFFF',

  // Outline / Border
  outline: '#6F7A74',
  outlineVariant: '#BEC9C3',

  // Semantic helpers
  trustHigh: '#005440',
  trustMedium: '#8C5400',
  trustLow: '#BA1A1A',

  // Transparent helpers
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',

  // ══════════════════════════════════════════════
  //  AGENT IDENTITY COLORS
  // ══════════════════════════════════════════════
  agentFaham: '#3B82F6',       // Electric Blue — Understanding
  agentFahamBg: '#EFF6FF',
  agentFahamGlow: 'rgba(59, 130, 246, 0.3)',

  agentDhoond: '#F59E0B',      // Amber — Discovery
  agentDhoondBg: '#FFFBEB',
  agentDhoondGlow: 'rgba(245, 158, 11, 0.3)',

  agentBharosa: '#10B981',     // Emerald — Trust
  agentBharosaBg: '#ECFDF5',
  agentBharosaGlow: 'rgba(16, 185, 129, 0.3)',

  agentMolBhaav: '#8B5CF6',   // Purple — Negotiation
  agentMolBhaavBg: '#F5F3FF',
  agentMolBhaavGlow: 'rgba(139, 92, 246, 0.3)',

  agentBook: '#14B8A6',        // Teal — Booking
  agentBookBg: '#F0FDFA',
  agentBookGlow: 'rgba(20, 184, 166, 0.3)',

  agentYaadDahani: '#F97316',  // Orange — Reminders
  agentYaadDahaniBg: '#FFF7ED',
  agentYaadDahaniGlow: 'rgba(249, 115, 22, 0.3)',

  // ══════════════════════════════════════════════
  //  GLASSMORPHISM
  // ══════════════════════════════════════════════
  glassWhite: 'rgba(255, 255, 255, 0.75)',
  glassWhiteLight: 'rgba(255, 255, 255, 0.45)',
  glassDark: 'rgba(26, 26, 46, 0.85)',
  glassDarkLight: 'rgba(26, 26, 46, 0.60)',
  glassOverlay: 'rgba(0, 0, 0, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassBorderDark: 'rgba(255, 255, 255, 0.08)',
} as const;

// ══════════════════════════════════════════════
//  AGENT CONFIG — Identity map for each agent
// ══════════════════════════════════════════════
export type AgentId = 'FAHAM' | 'DHOOND' | 'BHAROSA' | 'MOL-BHAAV' | 'BOOK' | 'YAAD-DAHANI';

export interface AgentConfig {
  id: AgentId;
  name: string;
  urduName: string;
  icon: string;       // MaterialIcons name
  color: string;
  bgColor: string;
  glowColor: string;
  description: string;
  statusMessages: string[];
}

export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  'FAHAM': {
    id: 'FAHAM',
    name: 'FAHAM Agent',
    urduName: 'فہم',
    icon: 'psychology',
    color: Colors.agentFaham,
    bgColor: Colors.agentFahamBg,
    glowColor: Colors.agentFahamGlow,
    description: 'Understanding & Analysis',
    statusMessages: [
      'Analyzing your request...',
      'Extracting service details...',
      'Understanding requirements...',
      'Processing language context...',
    ],
  },
  'DHOOND': {
    id: 'DHOOND',
    name: 'DHOOND Agent',
    urduName: 'ڈھونڈ',
    icon: 'radar',
    color: Colors.agentDhoond,
    bgColor: Colors.agentDhoondBg,
    glowColor: Colors.agentDhoondGlow,
    description: 'Discovery & Search',
    statusMessages: [
      'Scanning nearby technicians...',
      'Checking availability...',
      'Finding best matches...',
      'Analyzing proximity data...',
    ],
  },
  'BHAROSA': {
    id: 'BHAROSA',
    name: 'BHAROSA Agent',
    urduName: 'بھروسا',
    icon: 'verified-user',
    color: Colors.agentBharosa,
    bgColor: Colors.agentBharosaBg,
    glowColor: Colors.agentBharosaGlow,
    description: 'Trust & Verification',
    statusMessages: [
      'Calculating trust scores...',
      'Verifying credentials...',
      'Analyzing review history...',
      'Building trust profiles...',
    ],
  },
  'MOL-BHAAV': {
    id: 'MOL-BHAAV',
    name: 'MOL-BHAAV Agent',
    urduName: 'مول بھاؤ',
    icon: 'handshake',
    color: Colors.agentMolBhaav,
    bgColor: Colors.agentMolBhaavBg,
    glowColor: Colors.agentMolBhaavGlow,
    description: 'Price Negotiation',
    statusMessages: [
      'Analyzing market rates...',
      'Preparing counter offer...',
      'Negotiating best price...',
      'Finalizing deal...',
    ],
  },
  'BOOK': {
    id: 'BOOK',
    name: 'BOOK Agent',
    urduName: 'بُک',
    icon: 'event-available',
    color: Colors.agentBook,
    bgColor: Colors.agentBookBg,
    glowColor: Colors.agentBookGlow,
    description: 'Booking & Confirmation',
    statusMessages: [
      'Securing time slot...',
      'Confirming with provider...',
      'Generating booking ID...',
      'Finalizing booking...',
    ],
  },
  'YAAD-DAHANI': {
    id: 'YAAD-DAHANI',
    name: 'YAAD-DAHANI Agent',
    urduName: 'یاد دہانی',
    icon: 'notifications-active',
    color: Colors.agentYaadDahani,
    bgColor: Colors.agentYaadDahaniBg,
    glowColor: Colors.agentYaadDahaniGlow,
    description: 'Reminders & Follow-up',
    statusMessages: [
      'Scheduling reminders...',
      'Setting up notifications...',
      'Configuring follow-ups...',
      'Activating monitoring...',
    ],
  },
};

export type ColorToken = keyof typeof Colors;
