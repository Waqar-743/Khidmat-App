// ═══════════════════════════════════════════════════════════════
// KHIDMAT — FAHAM Agent: Intent Extraction
// Parses Urdu, Roman Urdu, English, and code-switched input
// Returns structured JSON intent
// ═══════════════════════════════════════════════════════════════

export type FahamOutput = {
  service_type: string;
  location: string;
  time: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  budget: number | null;
  special_notes: string;
};

// ── Market rates used by MOL-BHAAV ──
export const MARKET_RATES: Record<string, { min: number; max: number; avg: number }> = {
  'AC Technician':    { min: 1500, max: 2500, avg: 2000 },
  'AC Repair':        { min: 1500, max: 2500, avg: 2000 },
  'Plumber':          { min: 800,  max: 1500, avg: 1100 },
  'Electrician':      { min: 1000, max: 2000, avg: 1500 },
  'Tutor':            { min: 500,  max: 1500, avg: 1000 },
  'Beautician':       { min: 1200, max: 3000, avg: 2000 },
  'Carpenter':        { min: 1000, max: 2500, avg: 1700 },
  'Painter':          { min: 2000, max: 5000, avg: 3500 },
  'Deep Cleaning':    { min: 3000, max: 8500, avg: 5500 },
};

// ── BHAROSA Trust Score Formula ──
export function calculateTrustScore(
  completionRate: number,
  responseSpeedScore: number,
  vouches: number,
  rating: number
): number {
  const normalizedCompletion = completionRate * 100;
  const normalizedVouches = Math.min(vouches * 5, 100);
  const normalizedRating = (rating / 5) * 100;
  return Math.round(
    (normalizedCompletion * 0.4) +
    (responseSpeedScore * 0.3) +
    (normalizedVouches * 0.2) +
    (normalizedRating * 0.1)
  );
}

// ═══════════════════════════════════════════════════════════════
// FAHAM — Keyword Dictionaries
// ═══════════════════════════════════════════════════════════════

const SERVICE_MAP: { keywords: string[]; label: string }[] = [
  { keywords: ['ac', 'ac wala', 'ac repair', 'air conditioner', 'cooling', 'ac theek', 'ac service', 'split ac', 'window ac', 'ائر کنڈیشنر', 'aye si'], label: 'AC Technician' },
  { keywords: ['plumber', 'plumbing', 'nalkay', 'pipe', 'leak', 'pani', 'water', 'flush', 'tap', 'نلکے', 'پلمبر', 'nalkay wala'], label: 'Plumber' },
  { keywords: ['electrician', 'bijli', 'wiring', 'electric', 'bijli wala', 'switch', 'socket', 'بجلی', 'bijli ka masla', 'light'], label: 'Electrician' },
  { keywords: ['tutor', 'teacher', 'tuition', 'padhai', 'study', 'math', 'science', 'ٹیوٹر', 'padhao', 'parhao'], label: 'Tutor' },
  { keywords: ['beautician', 'parlor', 'parlour', 'makeup', 'beauty', 'facial', 'mehndi', 'بیوٹیشن', 'waxing', 'threading'], label: 'Beautician' },
  { keywords: ['carpenter', 'mistri', 'lakdi', 'wood', 'furniture', 'door', 'بڑھئی', 'almari', 'wardrobe', 'lakri'], label: 'Carpenter' },
  { keywords: ['painter', 'paint', 'rang', 'color', 'wall paint', 'پینٹر', 'rangai', 'distemper'], label: 'Painter' },
  { keywords: ['cleaning', 'safai', 'deep clean', 'house cleaning', 'صفائی', 'safai wala', 'safai wali', 'jharoo', 'ghar ki safai'], label: 'Deep Cleaning' },
];

const LOCATION_MAP: { keywords: string[]; label: string }[] = [
  { keywords: ['g-13', 'g13', 'g 13'], label: 'G-13, Islamabad' },
  { keywords: ['g-11', 'g11', 'g 11'], label: 'G-11, Islamabad' },
  { keywords: ['g-14', 'g14', 'g 14'], label: 'G-14, Islamabad' },
  { keywords: ['g-9', 'g9', 'g 9'], label: 'G-9, Islamabad' },
  { keywords: ['g-10', 'g10', 'g 10'], label: 'G-10, Islamabad' },
  { keywords: ['f-10', 'f10', 'f 10'], label: 'F-10, Islamabad' },
  { keywords: ['f-8', 'f8', 'f 8'], label: 'F-8, Islamabad' },
  { keywords: ['f-11', 'f11', 'f 11'], label: 'F-11, Islamabad' },
  { keywords: ['f-6', 'f6', 'f 6'], label: 'F-6, Islamabad' },
  { keywords: ['f-7', 'f7', 'f 7'], label: 'F-7, Islamabad' },
  { keywords: ['i-8', 'i8', 'i 8'], label: 'I-8, Islamabad' },
  { keywords: ['i-10', 'i10', 'i 10'], label: 'I-10, Islamabad' },
  { keywords: ['e-11', 'e11', 'e 11'], label: 'E-11, Islamabad' },
  { keywords: ['dha', 'dha phase'], label: 'DHA Phase 5, Lahore' },
  { keywords: ['gulberg', 'gulburg'], label: 'Gulberg III, Lahore' },
  { keywords: ['johar town', 'johar'], label: 'Johar Town, Lahore' },
  { keywords: ['model town'], label: 'Model Town, Lahore' },
  { keywords: ['bahria', 'bahria town'], label: 'Bahria Town, Islamabad' },
  { keywords: ['blue area'], label: 'Blue Area, Islamabad' },
  { keywords: ['islamabad'], label: 'Islamabad' },
  { keywords: ['lahore'], label: 'Lahore' },
  { keywords: ['karachi'], label: 'Karachi' },
  { keywords: ['rawalpindi', 'pindi'], label: 'Rawalpindi' },
];

// Urgency keywords — HIGH takes priority, then LOW, default MEDIUM
const URGENCY_HIGH = ['urgent', 'abhi', 'jaldi', 'emergency', 'foran', 'fori', 'asap', 'turant', 'now', 'immediately', 'فوری', 'ابھی', 'جلدی'];
const URGENCY_LOW = ['kisi din', 'whenever', 'flexible', 'jab free ho', 'koi jaldi nahi', 'aglay hafta', 'next week', 'آئندہ', 'کبھی بھی'];
// MEDIUM is the default — triggered by: kal, tomorrow, aaj, today, subah, sham, etc.

const TIME_MAP: { keywords: string[]; label: string }[] = [
  { keywords: ['abhi', 'now', 'turant', 'foran'], label: 'Abhi (Right Now)' },
  { keywords: ['aaj', 'today', 'aj'], label: 'Aaj (Today)' },
  { keywords: ['kal', 'tomorrow', 'kal subah', 'kal sham'], label: 'Kal (Tomorrow)' },
  { keywords: ['parson', 'day after'], label: 'Parson (Day After Tomorrow)' },
  { keywords: ['subah', 'morning'], label: 'Subah (Morning, 9-12)' },
  { keywords: ['dopahar', 'afternoon'], label: 'Dopahar (Afternoon, 12-3)' },
  { keywords: ['sham', 'evening', 'shaam'], label: 'Sham (Evening, 4-7)' },
  { keywords: ['raat', 'night'], label: 'Raat (Night, 7+)' },
  { keywords: ['next week', 'aglay hafta', 'agle hafte'], label: 'Aglay Hafta (Next Week)' },
  { keywords: ['weekend', 'saturday', 'sunday', 'chutti'], label: 'Weekend' },
];

// ═══════════════════════════════════════════════════════════════
// FAHAM — Core Parser
// ═══════════════════════════════════════════════════════════════

function matchFirst(input: string, map: { keywords: string[]; label: string }[]): string | null {
  const lower = input.toLowerCase();
  for (const entry of map) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry.label;
    }
  }
  return null;
}

function extractBudget(input: string): number | null {
  // Match patterns: "2000", "budget 2000", "Rs 2000", "Rs. 2,000", "2k"
  const patterns = [
    /(?:budget|bajat|rs\.?|rupees?)\s*(\d[\d,]*)/i,
    /(\d[\d,]*)\s*(?:rs|rupees?|rupaiye)/i,
    /(\d+)k\b/i,
    /\b(\d{3,5})\b/,  // standalone 3-5 digit numbers
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      let val = match[1].replace(/,/g, '');
      let num = parseInt(val);
      if (input.match(/(\d+)k\b/i) && num < 100) num *= 1000;
      if (num >= 100 && num <= 99999) return num; // Reasonable service budget range
    }
  }
  return null;
}

function extractSpecialNotes(input: string): string {
  const notes: string[] = [];
  const lower = input.toLowerCase();

  // Detect special requirements
  if (/female|aurat|lady|khatoon|خاتون/i.test(lower)) notes.push('Female provider requested');
  if (/experienced|tajurbakar|tajurba/i.test(lower)) notes.push('Experienced provider preferred');
  if (/cheap|sasta|kam rate/i.test(lower)) notes.push('Budget-conscious');
  if (/warranty|guarantee/i.test(lower)) notes.push('Warranty/guarantee needed');
  if (/inverter|split|window/i.test(lower)) notes.push(lower.includes('inverter') ? 'Inverter AC' : lower.includes('split') ? 'Split AC' : 'Window AC');
  if (/2\s*(?:bed|room|kamra|kamre)/i.test(lower)) notes.push('2-bedroom service');
  if (/3\s*(?:bed|room|kamra|kamre)/i.test(lower)) notes.push('3-bedroom service');
  if (/whole house|poora ghar|sara ghar/i.test(lower)) notes.push('Full house service');

  return notes.join(', ');
}

function detectLanguage(input: string): string {
  if (/[\u0600-\u06FF]/.test(input)) return 'Urdu';
  const romanUrduMarkers = /\b(chahiye|wala|wali|hai|mein|ka|ke|ki|bhai|yaar|karna|karwana|theek|masla|nahi|koi|abhi|kal|subah|sham|bajat)\b/i;
  const englishMarkers = /\b(need|want|require|looking|find|book|get|my|the|please|help|fix)\b/i;
  const hasRomanUrdu = romanUrduMarkers.test(input);
  const hasEnglish = englishMarkers.test(input);
  if (hasRomanUrdu && hasEnglish) return 'Code-Switched';
  if (hasRomanUrdu) return 'Roman Urdu';
  return 'English';
}

// ═══════════════════════════════════════════════════════════════
// FAHAM — Public API
// ═══════════════════════════════════════════════════════════════

export function faham_parse(input: string): FahamOutput {
  const lower = input.toLowerCase();

  // 1. Extract service_type
  const service_type = matchFirst(input, SERVICE_MAP) || 'General Service';

  // 2. Extract location
  const location = matchFirst(input, LOCATION_MAP) || 'Not specified';

  // 3. Extract time
  const time = matchFirst(input, TIME_MAP) || 'Not specified';

  // 4. Detect urgency (HIGH > LOW > default MEDIUM)
  let urgency: FahamOutput['urgency'] = 'MEDIUM';
  if (URGENCY_HIGH.some(kw => lower.includes(kw))) {
    urgency = 'HIGH';
  } else if (URGENCY_LOW.some(kw => lower.includes(kw))) {
    urgency = 'LOW';
  }

  // 5. Extract budget
  const budget = extractBudget(input);

  // 6. Extract special notes
  const special_notes = extractSpecialNotes(input);

  return {
    service_type,
    location,
    time,
    urgency,
    budget,
    special_notes,
  };
}

// Metadata about the parse (for display)
export function faham_meta(input: string) {
  return {
    language: detectLanguage(input),
    raw_input: input,
    timestamp: new Date().toISOString(),
  };
}
