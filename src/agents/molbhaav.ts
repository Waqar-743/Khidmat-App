// ═══════════════════════════════════════════════════════════════
// KHIDMAT — MOL-BHAAV Agent: Price Negotiation Intelligence
// Negotiates on behalf of the user to get fair pricing.
// Never goes below market_min (protects provider fairness).
// ═══════════════════════════════════════════════════════════════

import { Provider } from '../types';
import { MARKET_RATES } from '../data/systemPrompt';

export type NegotiationRound = {
  round: number;
  actor: 'provider' | 'agent';
  amount: number;
  action: string; // e.g. "quoted", "countered", "accepted"
  note?: string;
};

export type NegotiationResult = {
  provider: Provider;
  serviceType: string;
  marketRate: { min: number; max: number; avg: number };
  providerQuote: number;
  rounds: NegotiationRound[];
  finalPrice: number;
  savings: number;
  savingsPercent: number;
  outcome: 'ACCEPTED' | 'NEGOTIATED' | 'REJECTED';
  movedToNext: boolean;
  explanation: string;
};

// ═══════════════════════════════════════════════════════════════
// Negotiation Rules:
// 1. If provider quote ≤ market max → accept, no negotiation
// 2. If provider quote > market max → counter with (market_max + 10%)
// 3. Maximum 2 rounds of offers
// 4. If no agreement → move to next provider
// 5. Never go below market_min (protects provider fairness)
// ═══════════════════════════════════════════════════════════════

export function molbhaav_negotiate(
  provider: Provider,
  serviceType: string,
  userBudget: number | null
): NegotiationResult {
  const rates = MARKET_RATES[serviceType] || { min: 1000, max: 3000, avg: 2000 };

  // Simulate provider's initial quote
  // Providers typically quote 10-25% above market max
  const quoteVariance = 1.10 + Math.random() * 0.15; // 1.10 to 1.25x
  const providerQuote = Math.round(provider.priceMax * quoteVariance);

  const rounds: NegotiationRound[] = [];

  // Round 0: Provider's initial quote
  rounds.push({
    round: 0,
    actor: 'provider',
    amount: providerQuote,
    action: 'quoted',
    note: providerQuote > rates.max ? '⚠️ Above Market Rate' : '✅ Within Market Range',
  });

  // ── Rule 1: If quote ≤ market max → accept immediately ──
  if (providerQuote <= rates.max) {
    return {
      provider,
      serviceType,
      marketRate: rates,
      providerQuote,
      rounds,
      finalPrice: providerQuote,
      savings: 0,
      savingsPercent: 0,
      outcome: 'ACCEPTED',
      movedToNext: false,
      explanation: `Provider ka rate Rs. ${providerQuote.toLocaleString()} market range (Rs. ${rates.min.toLocaleString()}-${rates.max.toLocaleString()}) ke andar hai. Koi negotiation ki zaroorat nahi — fair price hai! ✅`,
    };
  }

  // ── Rule 2: Counter with market_max + 10% ──
  const counterOffer = Math.round(rates.max * 1.10);
  // Ensure counter never goes below market_min
  const safeCounter = Math.max(counterOffer, rates.min);

  rounds.push({
    round: 1,
    actor: 'agent',
    amount: safeCounter,
    action: 'countered',
    note: `Based on market rate Rs. ${rates.min.toLocaleString()}-${rates.max.toLocaleString()} + 10%`,
  });

  // Simulate provider's response to Round 1
  // Provider typically comes down 40-60% of the gap
  const gap1 = providerQuote - safeCounter;
  const providerConcession1 = Math.round(gap1 * (0.4 + Math.random() * 0.2));
  const providerCounter1 = providerQuote - providerConcession1;

  // Check if they meet or beat our counter
  if (providerCounter1 <= safeCounter) {
    // Provider accepted or went below our offer
    rounds.push({
      round: 1,
      actor: 'provider',
      amount: safeCounter,
      action: 'accepted',
      note: '✅ Provider agreed to our counter-offer',
    });

    const finalPrice = safeCounter;
    const savings = providerQuote - finalPrice;
    return {
      provider,
      serviceType,
      marketRate: rates,
      providerQuote,
      rounds,
      finalPrice,
      savings,
      savingsPercent: Math.round((savings / providerQuote) * 100),
      outcome: 'NEGOTIATED',
      movedToNext: false,
      explanation: `Provider ne Rs. ${providerQuote.toLocaleString()} maanga tha jo market rate se zyada tha. Humne Rs. ${safeCounter.toLocaleString()} counter kiya aur provider maan gaya. Aapne Rs. ${savings.toLocaleString()} bachaye! 🎉`,
    };
  }

  // Provider countered — Round 2
  rounds.push({
    round: 1,
    actor: 'provider',
    amount: providerCounter1,
    action: 'countered',
    note: `Provider came down from Rs. ${providerQuote.toLocaleString()}`,
  });

  // ── Rule 3: Maximum 2 rounds — try splitting the difference ──
  const midpoint = Math.round((safeCounter + providerCounter1) / 2);
  // Ensure we never go below market_min
  const finalOffer = Math.max(midpoint, rates.min);

  rounds.push({
    round: 2,
    actor: 'agent',
    amount: finalOffer,
    action: 'countered',
    note: `Splitting the difference — fair compromise`,
  });

  // Simulate: provider usually accepts the midpoint (80% chance)
  const providerAccepts = Math.random() < 0.80;

  if (providerAccepts || finalOffer >= providerCounter1) {
    rounds.push({
      round: 2,
      actor: 'provider',
      amount: finalOffer,
      action: 'accepted',
      note: '✅ Deal finalized',
    });

    const savings = providerQuote - finalOffer;
    return {
      provider,
      serviceType,
      marketRate: rates,
      providerQuote,
      rounds,
      finalPrice: finalOffer,
      savings,
      savingsPercent: Math.round((savings / providerQuote) * 100),
      outcome: 'NEGOTIATED',
      movedToNext: false,
      explanation: `2 rounds ki negotiation ke baad, provider ne Rs. ${finalOffer.toLocaleString()} par agree kiya. Original quote Rs. ${providerQuote.toLocaleString()} tha — aapne Rs. ${savings.toLocaleString()} (${Math.round((savings / providerQuote) * 100)}%) bachaye! 🎉`,
    };
  }

  // ── Rule 4: No agreement → move to next provider ──
  rounds.push({
    round: 2,
    actor: 'provider',
    amount: providerCounter1,
    action: 'rejected',
    note: '❌ Provider did not agree — moving to next provider',
  });

  return {
    provider,
    serviceType,
    marketRate: rates,
    providerQuote,
    rounds,
    finalPrice: 0,
    savings: 0,
    savingsPercent: 0,
    outcome: 'REJECTED',
    movedToNext: true,
    explanation: `Provider Rs. ${providerCounter1.toLocaleString()} se neeche nahi aaya. 2 rounds ke baad bhi deal nahi hui. Next best provider dekh rahe hain...`,
  };
}

// Format a full MOL-BHAAV negotiation log as chat text
export function molbhaav_formatLog(result: NegotiationResult): string {
  const lines: string[] = [
    `💬 **MOL-BHAAV Agent** — Negotiation Log`,
    ``,
    `📊 Market Rate for ${result.serviceType}: Rs. ${result.marketRate.min.toLocaleString()} – ${result.marketRate.max.toLocaleString()}`,
    `🚫 Floor Price: Rs. ${result.marketRate.min.toLocaleString()} (provider fairness protected)`,
    ``,
  ];

  result.rounds.forEach((r) => {
    const emoji = r.actor === 'provider' ? '👤' : '🤖';
    const label = r.actor === 'provider' ? 'Provider' : 'KHIDMAT';

    if (r.action === 'quoted') {
      lines.push(`${emoji} ${label} asked: Rs. ${r.amount.toLocaleString()}`);
    } else if (r.action === 'countered') {
      lines.push(`${emoji} ${label} counter: Rs. ${r.amount.toLocaleString()}`);
    } else if (r.action === 'accepted') {
      lines.push(`${emoji} ${label} accepted: Rs. ${r.amount.toLocaleString()} ✅`);
    } else if (r.action === 'rejected') {
      lines.push(`${emoji} ${label} rejected ❌`);
    }

    if (r.note) {
      lines.push(`   ${r.note}`);
    }
    lines.push('');
  });

  if (result.outcome !== 'REJECTED') {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🎉 **Deal ho gaya!**`);
    lines.push(`   Final Price: Rs. ${result.finalPrice.toLocaleString()} ✅`);
    if (result.savings > 0) {
      lines.push(`   Aapne bachaye: Rs. ${result.savings.toLocaleString()} (${result.savingsPercent}% off)`);
    }
  } else {
    lines.push(`❌ No deal with ${result.provider.name}. Moving to next provider.`);
  }

  lines.push('');
  lines.push(`💬 ${result.explanation}`);

  return lines.join('\n');
}
