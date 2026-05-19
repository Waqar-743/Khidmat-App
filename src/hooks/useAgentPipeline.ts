import { useState, useCallback } from 'react';
import { AgentName, AgentLogEntry } from '../types';
import { mockAgentLogs } from '../data/mockAgentLogs';

export type PipelineState = 'IDLE' | 'PARSING' | 'SEARCHING' | 'SCORING' | 'NEGOTIATING' | 'BOOKING' | 'COMPLETE';

export function useAgentPipeline() {
  const [pipelineState, setPipelineState] = useState<PipelineState>('IDLE');
  const [currentAgent, setCurrentAgent] = useState<AgentName | null>(null);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);

  // Helper to add a log entry with delay
  const addLogWithDelay = async (logIndex: number, delayMs: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const log = mockAgentLogs[logIndex];
        if (log) {
          setLogs((prev) => [...prev, log]);
          setCurrentAgent(log.agent);
        }
        resolve();
      }, delayMs);
    });
  };

  const startPipeline = useCallback(async () => {
    setLogs([]);
    
    // 1. FAHAM (Parsing)
    setPipelineState('PARSING');
    await addLogWithDelay(0, 800);
    
    // 2. DHOOND (Searching)
    setPipelineState('SEARCHING');
    await addLogWithDelay(1, 1200);
    
    // 3. BHAROSA (Scoring)
    setPipelineState('SCORING');
    await addLogWithDelay(2, 1500);
    
    // Done with initial search phase
    setPipelineState('IDLE');
    setCurrentAgent(null);
  }, []);

  const startNegotiation = useCallback(async () => {
    // 4. MOL-BHAAV (Negotiating)
    setPipelineState('NEGOTIATING');
    await addLogWithDelay(3, 2000);
    
    // Done negotiating
    setPipelineState('IDLE');
    setCurrentAgent(null);
  }, []);

  const confirmBooking = useCallback(async () => {
    // 5. BOOK (Execution)
    setPipelineState('BOOKING');
    await addLogWithDelay(4, 1000);
    
    // 6. YAAD-DAHANI (Follow up scheduling)
    await addLogWithDelay(5, 500);
    
    setPipelineState('COMPLETE');
    setCurrentAgent(null);
  }, []);

  return {
    pipelineState,
    currentAgent,
    logs,
    startPipeline,
    startNegotiation,
    confirmBooking,
  };
}
