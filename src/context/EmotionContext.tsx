/**
 * EmotionContext - Global state management for Emotionagotchi
 * Manages emotion logs, creature state, and safety score
 * Requirements: 2.2, 2.3, 4.1, 5.1, 5.2
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmotionLog, EmotionAction, CreatureState } from '@/types';
import { storageService } from '@/services/storageService';
import { calculateNewState, getInitialState } from '@/utils/creatureState';
import { v4 as uuidv4 } from 'uuid';

/**
 * Context type definition
 */
interface EmotionContextType {
  logs: EmotionLog[];
  creatureState: CreatureState;
  safetyScore: number;
  addLog: (text: string, action: EmotionAction) => void;
  clearLogs: () => void;
}

/**
 * Create the context with undefined default
 */
const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

/**
 * Props for the EmotionProvider component
 */
interface EmotionProviderProps {
  children: React.ReactNode;
}

/**
 * EmotionProvider component
 * Provides global state for emotion logs, creature state, and safety score
 * 
 * Requirements:
 * - 2.2: Record emotion logs with timestamps
 * - 2.3: Record action type (expressed/suppressed)
 * - 4.1: Track safety score (count of expressed emotions)
 * - 5.1: Persist data to localStorage immediately
 * - 5.2: Load initial state from localStorage on mount
 */
export function EmotionProvider({ children }: EmotionProviderProps) {
  const [logs, setLogs] = useState<EmotionLog[]>([]);
  const [creatureState, setCreatureState] = useState<CreatureState>(getInitialState());
  const [safetyScore, setSafetyScore] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial state from localStorage on mount
  // Requirement 5.2: Load previous state on return
  useEffect(() => {
    const loadedLogs = storageService.loadLogs();
    const loadedCreatureState = storageService.loadCreatureState();
    const loadedSafetyScore = storageService.loadSafetyScore();

    setLogs(loadedLogs);
    setCreatureState(loadedCreatureState || getInitialState());
    setSafetyScore(loadedSafetyScore);
    setIsInitialized(true);
  }, []);

  /**
   * Add a new emotion log
   * 
   * This method:
   * 1. Creates a new log with UUID and timestamp
   * 2. Updates creature state based on action
   * 3. Updates safety score if action is "expressed"
   * 4. Persists all changes to localStorage
   * 
   * Requirements:
   * - 2.2: Create log with timestamp
   * - 2.3: Record action type
   * - 4.1: Increment safety score for expressed emotions
   * - 5.1: Persist to storage immediately
   */
  const addLog = useCallback((text: string, action: EmotionAction) => {
    // Create new log entry
    // Requirement 2.2, 2.3: Record with timestamp and action type
    const newLog: EmotionLog = {
      id: uuidv4(),
      text,
      action,
      timestamp: Date.now(),
    };

    // Update logs
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);

    // Calculate new creature state
    // Requirement 3.1, 3.2: Update creature based on action
    const newCreatureState = calculateNewState(creatureState, action);
    setCreatureState(newCreatureState);

    // Update safety score if action is "expressed"
    // Requirement 4.1: Increment safety score for expressed emotions
    let newSafetyScore = safetyScore;
    if (action === 'expressed') {
      newSafetyScore = safetyScore + 1;
      setSafetyScore(newSafetyScore);
    }

    // Persist all changes to localStorage
    // Requirement 5.1: Persist immediately
    storageService.saveLogs(updatedLogs);
    storageService.saveCreatureState(newCreatureState);
    storageService.saveSafetyScore(newSafetyScore);
  }, [logs, creatureState, safetyScore]);

  /**
   * Clear all logs and reset state
   */
  const clearLogs = useCallback(() => {
    setLogs([]);
    setCreatureState(getInitialState());
    setSafetyScore(0);
    storageService.clearAll();
  }, []);

  const value: EmotionContextType = {
    logs,
    creatureState,
    safetyScore,
    addLog,
    clearLogs,
  };

  // Don't render children until initial state is loaded
  if (!isInitialized) {
    return null;
  }

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
}

/**
 * Hook to use the EmotionContext
 * Throws an error if used outside of EmotionProvider
 */
export function useEmotion(): EmotionContextType {
  const context = useContext(EmotionContext);
  
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  
  return context;
}
