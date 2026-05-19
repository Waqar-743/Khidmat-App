import { useState, useCallback } from 'react';
import { ChatMessage, ParsedIntent, BookingReceipt, Provider } from '../types';
import { faham_parse, faham_meta, FahamOutput } from '../data/systemPrompt';
import { getProvidersByCategory, providers } from '../data/providers';
import { bharosa_rank, bharosa_formatReport, BharosaReport } from '../agents/bharosa';
import { molbhaav_negotiate, molbhaav_formatLog, NegotiationResult } from '../agents/molbhaav';
import { AgentId } from '../constants/Colors';

type ParsedRequest = FahamOutput & { rawInput: string; language: string };

export type AgentStep = {
  agent: string;
  icon: string;
  status: 'running' | 'complete' | 'error';
  lines: string[];
};

// Extended message types for rich UI cards
export type RichChatMessage = ChatMessage & {
  agentId?: AgentId;
  providers?: Provider[];
  negotiation?: {
    providerQuote: number;
    counterOffer: number;
    finalPrice: number;
    saved: number;
    rounds: Array<{ actor: 'agent' | 'provider'; amount: number; note: string }>;
  };
};

const INITIAL_MESSAGES: RichChatMessage[] = [
  {
    id: 'msg-sys-0',
    type: 'system',
    text: 'Today, 10:42 AM',
    timestamp: '',
  },
  {
    id: 'msg-0',
    type: 'agent',
    text: 'Assalam o Alaikum! 👋 Mujhe batayein — aapko kaunsi service chahiye?',
    timestamp: '10:42',
  },
];

export function useChatMessages() {
  const [messages, setMessages] = useState<RichChatMessage[]>(INITIAL_MESSAGES);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null);
  const [activeAgentLogs, setActiveAgentLogs] = useState<string[]>([]);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [lastParsedRequest, setLastParsedRequest] = useState<ParsedRequest | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [discoveredProviders, setDiscoveredProviders] = useState<Provider[]>([]);
  const [negotiationResult, setNegotiationResult] = useState<{
    originalPrice: number; finalPrice: number; saved: number;
  } | null>(null);

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const addMessage = useCallback((msg: Omit<RichChatMessage, 'id'>) => {
    const newMsg = { ...msg, id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    setMessages(prev => [...prev, newMsg as RichChatMessage]);
  }, []);

  const addUserMessage = useCallback((text: string) => {
    addMessage({ type: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  }, [addMessage]);

  const addAgentMessage = useCallback((text: string, agentId?: AgentId) => {
    addMessage({ type: 'agent', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), agentId });
  }, [addMessage]);

  const addIntentCard = useCallback((intent: ParsedIntent) => {
    addMessage({ type: 'intent-card', intent, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), agentId: 'FAHAM' });
  }, [addMessage]);

  const addReceipt = useCallback((receipt: BookingReceipt) => {
    addMessage({ type: 'receipt', receipt, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), agentId: 'BOOK' });
  }, [addMessage]);

  // Show an agent overlay, wait, then hide it
  const runAgentPhase = useCallback(async (
    agentId: AgentId,
    logs: string[],
    durationMs: number,
  ) => {
    setActiveAgentId(agentId);
    setActiveAgentLogs(logs);
    setIsAgentTyping(true);
    await delay(durationMs);
    setIsAgentTyping(false);
    setActiveAgentId(null);
    setActiveAgentLogs([]);
    await delay(300); // brief pause after overlay closes
  }, []);

  // ── Step 1: FAHAM ──
  const orchestrate = useCallback(async (userInput: string) => {
    addUserMessage(userInput);

    await runAgentPhase('FAHAM', [
      '> Parsing natural language input...',
      '> Detecting service type...',
      '> Extracting location & time...',
      '> Estimating market budget...',
    ], 2800);

    const intent = faham_parse(userInput);
    const meta = faham_meta(userInput);
    const parsed: ParsedRequest = { ...intent, rawInput: userInput, language: meta.language };
    setLastParsedRequest(parsed);

    const intentData: ParsedIntent = {
      serviceType: intent.service_type as any,
      location: intent.location,
      time: intent.time,
      urgency: intent.urgency,
      budget: intent.budget || 0,
    };
    addIntentCard(intentData);
    return parsed;
  }, [addUserMessage, addIntentCard, runAgentPhase]);

  // ── Steps 2+3: DHOOND + BHAROSA ──
  const runDiscoveryAndTrust = useCallback(async (parsed: ParsedRequest) => {
    // DHOOND
    await runAgentPhase('DHOOND', [
      `> Scanning 5km radius for ${parsed.service_type}...`,
      `> Filtering by availability & location...`,
      `> Checking response times & ratings...`,
      `> Building candidate shortlist...`,
    ], 3000);

    const serviceKey = parsed.service_type.toLowerCase().split(' ')[0];
    let matched = providers.filter(p =>
      p.category.toLowerCase().includes(serviceKey) ||
      p.category.toLowerCase().includes(parsed.service_type.toLowerCase())
    );
    if (matched.length === 0) matched = providers.slice(0, 4);
    const topProviders = matched.slice(0, 4);
    setDiscoveredProviders(topProviders);

    addAgentMessage(
      `🔎 **DHOOND** found ${topProviders.length} technicians in ${parsed.location}`,
      'DHOOND',
    );
    await delay(400);

    // BHAROSA
    await runAgentPhase('BHAROSA', [
      '> Calculating BHAROSA trust scores...',
      '> Cross-referencing review data...',
      '> Verifying credentials & badges...',
      '> Ranking by trust + proximity...',
    ], 2800);

    const reports = bharosa_rank(topProviders);
    const best = reports[0];
    setSelectedProvider(best.provider);

    // Inject a provider-cards message type
    addMessage({
      type: 'agent',
      text: `✅ **BHAROSA** ranked ${topProviders.length} providers. Top pick: **${best.provider.name}** (Score: ${best.provider.trustScore}/100)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentId: 'BHAROSA',
      providers: topProviders,
    });

    return { topProviders, top: best.provider, reports };
  }, [addMessage, addAgentMessage, runAgentPhase]);

  // ── Step 4: MOL-BHAAV ──
  const runNegotiation = useCallback(async (parsed: ParsedRequest, provider: Provider) => {
    await runAgentPhase('MOL-BHAAV', [
      `> Market rate: Rs. ${provider.priceMin.toLocaleString()} – ${provider.priceMax.toLocaleString()}`,
      `> Provider quote incoming...`,
      `> Calculating counter-offer...`,
      `> Finalizing best deal...`,
    ], 3500);

    const result = molbhaav_negotiate(provider, parsed.service_type, parsed.budget);
    setNegotiationResult({ originalPrice: result.providerQuote, finalPrice: result.finalPrice, saved: result.savings });

    // Inject negotiation message with rich data
    addMessage({
      type: 'agent',
      text: `💜 **MOL-BHAAV** negotiated Rs. ${result.savings.toLocaleString()} in savings!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agentId: 'MOL-BHAAV',
      negotiation: {
        providerQuote: result.providerQuote,
        counterOffer: result.rounds.find(r => r.actor === 'agent')?.amount || result.finalPrice,
        finalPrice: result.finalPrice,
        saved: result.savings,
        rounds: result.rounds.map(r => ({ actor: r.actor, amount: r.amount, note: r.note ?? '' })),
      },
    });

    return {
      providerQuote: result.providerQuote,
      counterOffer: result.rounds.find(r => r.actor === 'agent')?.amount || result.finalPrice,
      finalPrice: result.finalPrice,
      saved: result.savings,
    };
  }, [addMessage, runAgentPhase]);

  // ── Step 5: BOOK ──
  const runBooking = useCallback(async (parsed: ParsedRequest, provider: Provider, pricing: { finalPrice: number; providerQuote: number; saved: number }) => {
    await runAgentPhase('BOOK', [
      '> Securing preferred time slot...',
      '> Sending confirmation to provider...',
      '> Generating transaction ID...',
      '> Creating digital receipt...',
    ], 2500);

    const bookingId = `KHD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const dateStr = parsed.time.includes('Tomorrow') || parsed.time.includes('Kal')
      ? 'Kal, ' + new Date(Date.now() + 86400000).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
      : '15 May 2026';
    const timeSlot = provider.availableSlots[0] || '10:00';

    const receipt: BookingReceipt = {
      bookingId,
      service: parsed.service_type as any,
      provider,
      location: parsed.location,
      date: dateStr,
      time: `${timeSlot} - ${parseInt(timeSlot) + 2}:00`,
      originalPrice: pricing.providerQuote,
      finalPrice: pricing.finalPrice,
      savedAmount: pricing.saved,
    };
    addReceipt(receipt);
    return { bookingId, receipt };
  }, [addReceipt, runAgentPhase]);

  // ── Step 6: YAAD-DAHANI ──
  const runFollowUp = useCallback(async (bookingId: string) => {
    await runAgentPhase('YAAD-DAHANI', [
      '> Scheduling pre-arrival reminder...',
      '> Setting up completion check...',
      '> Activating dispute monitoring...',
      '> Feedback request queued...',
    ], 2000);

    addAgentMessage(
      `📱 Reminders set! Main aapke booking **${bookingId}** ki nigrani karoonga. Koi masla ho toh batayein! 🤝`,
      'YAAD-DAHANI',
    );
  }, [addAgentMessage, runAgentPhase]);

  // Full pipeline after confirmation
  const confirmAndExecute = useCallback(async () => {
    if (!lastParsedRequest) return;
    const parsed = lastParsedRequest;

    const { top } = await runDiscoveryAndTrust(parsed);
    const pricing = await runNegotiation(parsed, top);
    const { bookingId } = await runBooking(parsed, top, pricing);
    await runFollowUp(bookingId);
  }, [lastParsedRequest, runDiscoveryAndTrust, runNegotiation, runBooking, runFollowUp]);

  // Restart from DHOOND with same parsed request
  const restartFromDhoond = useCallback(async () => {
    if (!lastParsedRequest) return;
    setSelectedProvider(null);
    setNegotiationResult(null);
    addAgentMessage('Koi baat nahi! Phir se dhundta hoon... 🔍');
    await delay(500);
    const { top } = await runDiscoveryAndTrust(lastParsedRequest);
    const pricing = await runNegotiation(lastParsedRequest, top);
    const { bookingId } = await runBooking(lastParsedRequest, top, pricing);
    await runFollowUp(bookingId);
  }, [lastParsedRequest, runDiscoveryAndTrust, runNegotiation, runBooking, runFollowUp, addAgentMessage]);

  return {
    messages,
    isAgentTyping,
    activeAgentId,
    activeAgentLogs,
    agentSteps,
    lastParsedRequest,
    selectedProvider,
    discoveredProviders,
    negotiationResult,
    orchestrate,
    confirmAndExecute,
    restartFromDhoond,
    addUserMessage,
    addAgentMessage,
    addIntentCard,
    addReceipt,
  };
}
