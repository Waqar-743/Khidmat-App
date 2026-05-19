// KHIDMAT — Mock Agent Trace Logs
import { AgentLogEntry } from '../types';

export const mockAgentLogs: AgentLogEntry[] = [
  {
    id: 'log-1',
    agent: 'FAHAM',
    timestamp: '14:32:01',
    duration: '0.3s',
    status: 'complete',
    lines: [
      'INPUT: "AC wala chahiye G-13 mein kal budget 2000"',
      'Detecting language: Roman Urdu (mixed)',
      'Extracting entities...',
      'OUTPUT: {service: "AC Technician", location: "G-13, Islamabad", time: "Kal subah", urgency: "HIGH", budget: 2000}',
    ],
  },
  {
    id: 'log-2',
    agent: 'DHOOND',
    timestamp: '14:32:01',
    duration: '0.8s',
    status: 'complete',
    lines: [
      '> Scanning 5km radius for AC Technicians in G-13...',
      '> Found 12, filtered 4 available.',
      '> Sorting by proximity and availability.',
      '> Results: P001 (2.1km), P002 (3.4km), P003 (5.8km)',
    ],
  },
  {
    id: 'log-3',
    agent: 'BHAROSA',
    timestamp: '14:32:02',
    duration: '1.2s',
    status: 'complete',
    lines: [
      '> Calculating trust scores...',
      '> Ali AC Services (87/100) prioritized',
      '  based on 98% completion rate.',
      '> Ahmed Electric flagged: 2 cancellations.',
      '> Trust formula: completion(0.4) + speed(0.3) + vouches(0.2) + rating(0.1)',
    ],
  },
  {
    id: 'log-4',
    agent: 'MOL-BHAAV',
    timestamp: '14:32:03',
    duration: '1.5s',
    status: 'complete',
    lines: [
      '> Initial quote Rs. 2,800.',
      '> Comparing with DHA Phase 5 market',
      '  rates (Rs. 1,500-2,500).',
      '> Counter-offering Rs. 2,100.',
      '> Provider accepted Rs. 2,200.',
      '> Savings: Rs. 600 (21% off quote)',
    ],
  },
  {
    id: 'log-5',
    agent: 'BOOK',
    timestamp: '14:32:05',
    duration: '0.7s',
    status: 'complete',
    lines: [
      '> Securing slot for 15 May 10:00 AM.',
      '> Generating secure transaction ID KHD-2026-0391.',
      '> Provider notified via SMS.',
      '> Confirmation receipt generated.',
    ],
  },
  {
    id: 'log-6',
    agent: 'YAAD-DAHANI',
    timestamp: '14:32:06',
    duration: '0.2s',
    status: 'complete',
    lines: [
      '> Scheduling reminder: 15 May, 9:00 AM.',
      '> Post-job check: 15 May, 12:00 PM.',
      '> Dispute monitoring: Active.',
    ],
  },
];

export const agentColors: Record<string, string> = {
  'FAHAM': '#005440',
  'DHOOND': '#086B53',
  'BHAROSA': '#FFB869',
  'MOL-BHAAV': '#84D6B9',
  'BOOK': '#2A6959',
  'YAAD-DAHANI': '#6B3F00',
};

export const agentIcons: Record<string, string> = {
  'FAHAM': 'search',
  'DHOOND': 'search',
  'BHAROSA': 'shield',
  'MOL-BHAAV': 'handshake',
  'BOOK': 'check-circle',
  'YAAD-DAHANI': 'schedule',
};
