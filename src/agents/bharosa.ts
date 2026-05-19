// ═══════════════════════════════════════════════════════════════
// KHIDMAT — BHAROSA Agent: Trust & Reputation Intelligence
// Never relies on star ratings alone.
// ═══════════════════════════════════════════════════════════════

import { Provider } from '../types';

export type BharosaRecommendation = 'STRONG YES' | 'YES' | 'CAUTION' | 'AVOID';

export type BharosaReport = {
  provider: Provider;
  trustScore: number;
  strengths: string[];
  redFlags: string[];
  recommendation: BharosaRecommendation;
  explanation: string; // plain Urdu/English why
};

// ── Trust Score Formula ──
// = (completion_rate × 0.40) + (response_speed_score × 0.30) +
//   (community_vouches × 0.20) + (normalized_rating × 0.10)
function computeTrustScore(provider: Provider): number {
  // completion_rate: already 0-1, scale to 0-100
  const completionScore = provider.completionRate * 100;

  // response_speed_score: inverse of minutes, normalized to 0-100
  // 5 min = 100, 60+ min = 0
  const responseSpeedScore = Math.max(0, Math.min(100, 100 - ((provider.responseTimeMinutes - 5) / 55) * 100));

  // community_vouches: normalized, 20+ vouches = 100
  const vouchScore = Math.min(100, (provider.communityVouches / 20) * 100);

  // normalized_rating: 5.0 = 100, 1.0 = 0
  const ratingScore = ((provider.rating - 1) / 4) * 100;

  const trust = Math.round(
    (completionScore * 0.40) +
    (responseSpeedScore * 0.30) +
    (vouchScore * 0.20) +
    (ratingScore * 0.10)
  );

  return Math.max(0, Math.min(100, trust));
}

// ── Red Flag Detection ──
function detectRedFlags(provider: Provider): string[] {
  const flags: string[] = [];

  // 2+ cancellations in last 7 days
  if (provider.cancellationsLast7d >= 2) {
    flags.push(`${provider.cancellationsLast7d} cancellations in last 7 days — reliability risk`);
  }

  // Response time > 2hrs (120 min)
  if (provider.responseTimeMinutes > 120) {
    flags.push(`Slow response time (${provider.responseTimeMinutes} min avg) — delay risk`);
  } else if (provider.responseTimeMinutes > 60) {
    flags.push(`Response time above average (${provider.responseTimeMinutes} min)`);
  }

  // Rating high but completion low — discrepancy
  if (provider.rating >= 4.0 && provider.completionRate < 0.80) {
    flags.push(`Rating/completion discrepancy: ${provider.rating}★ rating but only ${Math.round(provider.completionRate * 100)}% completion`);
  }

  // Very few reviews (new/unverified)
  if (provider.reviewCount < 15) {
    flags.push(`Limited review history (${provider.reviewCount} reviews) — new provider`);
  }

  // Low community vouches
  if (provider.communityVouches < 3) {
    flags.push(`Low community endorsement (${provider.communityVouches} vouches)`);
  }

  // Existing red flags from data
  if (provider.redFlags) {
    flags.push(...provider.redFlags);
  }

  return flags;
}

// ── Strengths Detection ──
function detectStrengths(provider: Provider): string[] {
  const strengths: string[] = [];

  if (provider.completionRate >= 0.95) {
    strengths.push(`Excellent completion rate: ${Math.round(provider.completionRate * 100)}%`);
  } else if (provider.completionRate >= 0.90) {
    strengths.push(`Good completion rate: ${Math.round(provider.completionRate * 100)}%`);
  }

  if (provider.responseTimeMinutes <= 15) {
    strengths.push(`Fast responder: replies in ~${provider.responseTimeMinutes} min`);
  }

  if (provider.communityVouches >= 10) {
    strengths.push(`Strong community trust: ${provider.communityVouches} vouches`);
  }

  if (provider.rating >= 4.5) {
    strengths.push(`Highly rated: ${provider.rating}★ (${provider.reviewCount} reviews)`);
  }

  if (provider.cancellationsLast7d === 0) {
    strengths.push('Zero cancellations this week');
  }

  if (provider.reviewCount >= 100) {
    strengths.push(`Well-established: ${provider.reviewCount}+ reviews`);
  }

  return strengths;
}

// ── Recommendation Level ──
function getRecommendation(score: number, redFlags: string[]): BharosaRecommendation {
  if (redFlags.length >= 3) return 'AVOID';
  if (score >= 80 && redFlags.length === 0) return 'STRONG YES';
  if (score >= 65) return 'YES';
  if (score >= 45) return 'CAUTION';
  return 'AVOID';
}

// ── Plain Explanation Generator ──
function generateExplanation(provider: Provider, score: number, rec: BharosaRecommendation, strengths: string[], redFlags: string[]): string {
  if (rec === 'STRONG YES') {
    return `${provider.name} is highly reliable — ${Math.round(provider.completionRate * 100)}% kaam complete karte hain, ${provider.communityVouches} logon ne vouch kiya hai, aur sirf ${provider.responseTimeMinutes} min mein reply karte hain. Yeh KHIDMAT ki top recommendation hai.`;
  }
  if (rec === 'YES') {
    return `${provider.name} ek acha option hai. Score ${score}/100 dikhata hai ke reliable hain, lekin ${redFlags.length > 0 ? 'kuch choti concerns hain' : 'koi major issue nahi hai'}. Overall recommended.`;
  }
  if (rec === 'CAUTION') {
    return `${provider.name} se thoda ehtiyaat karein. ${redFlags[0] || 'Trust score average hai'}. Agar aur koi option na ho toh use kar sakte hain, warna better provider dekhein.`;
  }
  return `${provider.name} se avoid karein. ${redFlags.slice(0, 2).join('. ')}. KHIDMAT recommend nahi karta.`;
}

// ═══════════════════════════════════════════════════════════════
// BHAROSA — Public API
// ═══════════════════════════════════════════════════════════════

export function bharosa_evaluate(provider: Provider): BharosaReport {
  const trustScore = computeTrustScore(provider);
  const strengths = detectStrengths(provider);
  const redFlags = detectRedFlags(provider);
  const recommendation = getRecommendation(trustScore, redFlags);
  const explanation = generateExplanation(provider, trustScore, recommendation, strengths, redFlags);

  return {
    provider,
    trustScore,
    strengths,
    redFlags,
    recommendation,
    explanation,
  };
}

export function bharosa_rank(providerList: Provider[]): BharosaReport[] {
  return providerList
    .map(p => bharosa_evaluate(p))
    .sort((a, b) => {
      // Primary: trust score descending
      // Tiebreak: fewer red flags win
      if (b.trustScore !== a.trustScore) return b.trustScore - a.trustScore;
      return a.redFlags.length - b.redFlags.length;
    });
}

// Format a full BHAROSA report as chat text
export function bharosa_formatReport(reports: BharosaReport[]): string {
  const lines: string[] = [
    `🛡️ **BHAROSA Agent** — Trust Intelligence Report`,
    ``,
    `Trust Formula: completion(×0.4) + speed(×0.3) + vouches(×0.2) + rating(×0.1)`,
    `Evaluated ${reports.length} providers. Ranking by trustworthiness, NOT proximity or rating.`,
    ``,
  ];

  reports.forEach((r, i) => {
    const recEmoji = r.recommendation === 'STRONG YES' ? '🟢' :
                     r.recommendation === 'YES' ? '🔵' :
                     r.recommendation === 'CAUTION' ? '🟡' : '🔴';

    lines.push(`━━━ ${i + 1}. ${r.provider.name} ━━━`);
    lines.push(`Trust Score: ${r.trustScore}/100 ${recEmoji} ${r.recommendation}`);
    lines.push(``);

    if (r.strengths.length > 0) {
      lines.push(`✅ Strengths:`);
      r.strengths.forEach(s => lines.push(`   • ${s}`));
    }

    if (r.redFlags.length > 0) {
      lines.push(`🚩 Red Flags:`);
      r.redFlags.forEach(f => lines.push(`   ⚠️ ${f}`));
    }

    lines.push(``);
    lines.push(`💬 ${r.explanation}`);
    lines.push(``);
  });

  // Final recommendation
  const top = reports[0];
  if (top) {
    lines.push(`🏆 RECOMMENDATION: **${top.provider.name}** (${top.trustScore}/100)`);
    lines.push(`WHY: Most trustworthy option based on verified completion data + community vouches, not just star rating.`);
  }

  return lines.join('\n');
}
