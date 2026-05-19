// KHIDMAT — TypeScript Type Definitions

export interface Provider {
  id: string;
  name: string;
  category: ServiceCategory;
  location: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  completionRate: number;
  responseTimeMinutes: number;
  communityVouches: number;
  cancellationsLast7d: number;
  priceMin: number;
  priceMax: number;
  availableSlots: string[];
  trustScore: number;
  phone: string;
  redFlags?: string[];
  avatar?: string;
}

export type ServiceCategory =
  | 'AC Technician'
  | 'Plumber'
  | 'Plumbing'
  | 'Plumbing Services'
  | 'Electrician'
  | 'General Electrician'
  | 'Tutor'
  | 'Beautician'
  | 'Carpenter'
  | 'Painter'
  | 'Deep Cleaning'
  | 'Cleaning'
  | 'Sofa Cleaning'
  | 'AC Repair'
  | 'AC Repair & Maintenance'
  | 'Mechanic'
  | 'Pest Control'
  | 'Home Chef';

export type UrgencyLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ParsedIntent {
  serviceType: ServiceCategory;
  location: string;
  time: string;
  urgency: UrgencyLevel;
  budget: number;
  specialNotes?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'intent-card' | 'receipt' | 'system';
  text?: string;
  timestamp: string;
  intent?: ParsedIntent;
  receipt?: BookingReceipt;
  isTyping?: boolean;
}

export interface BookingReceipt {
  bookingId: string;
  service: ServiceCategory;
  provider: Provider;
  location: string;
  date: string;
  time: string;
  originalPrice: number;
  finalPrice: number;
  savedAmount: number;
}

export interface NegotiationStep {
  id: number;
  type: 'market-analysis' | 'provider-quote' | 'counter-offer' | 'provider-response';
  title: string;
  description: string;
  value?: string;
  tag?: string;
  tagType?: 'info' | 'warning' | 'success' | 'error';
}

export interface AgentLogEntry {
  id: string;
  agent: AgentName;
  timestamp: string;
  duration: string;
  status: 'complete' | 'running' | 'error';
  lines: string[];
}

export type AgentName = 'FAHAM' | 'DHOOND' | 'BHAROSA' | 'MOL-BHAAV' | 'BOOK' | 'YAAD-DAHANI';

export interface ServiceHistoryItem {
  id: string;
  service: string;
  provider: string;
  date: string;
  amount: number | null;
  status: 'Completed' | 'Cancelled' | 'In Progress';
  icon: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'pending';
  hasAction?: boolean;
  actionLabel?: string;
}

export type TrustLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 80) return 'HIGH';
  if (score >= 50) return 'MEDIUM';
  if (score > 0) return 'LOW';
  return 'UNKNOWN';
}
