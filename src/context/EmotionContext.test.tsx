/**
 * Tests for EmotionContext
 * Verifies global state management functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EmotionProvider, useEmotion } from './EmotionContext';
import { storageService } from '@/services/storageService';
import { EmotionAction } from '@/types';

// Mock uuid to have predictable IDs in tests
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

describe('EmotionContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    storageService.clearAll();
    vi.clearAllMocks();
  });

  it('should initialize with default state when localStorage is empty', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    expect(result.current.logs).toEqual([]);
    expect(result.current.creatureState).toEqual({
      brightness: 50,
      size: 50,
      animation: 'idle',
    });
    expect(result.current.safetyScore).toBe(0);
  });

  it('should add a log with expressed action', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Feeling happy', 'expressed');
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0]).toMatchObject({
      id: 'test-uuid-123',
      text: 'Feeling happy',
      action: 'expressed',
    });
    expect(result.current.logs[0].timestamp).toBeGreaterThan(0);
  });

  it('should update creature state when adding expressed log', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Feeling happy', 'expressed');
    });

    // Expressed action: brightness +5, size +2
    expect(result.current.creatureState.brightness).toBe(55);
    expect(result.current.creatureState.size).toBe(52);
    expect(result.current.creatureState.animation).toBe('grow');
  });

  it('should update creature state when adding suppressed log', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Feeling anxious', 'suppressed');
    });

    // Suppressed action: brightness -3, size -1
    expect(result.current.creatureState.brightness).toBe(47);
    expect(result.current.creatureState.size).toBe(49);
    expect(result.current.creatureState.animation).toBe('curl');
  });

  it('should increment safety score only for expressed actions', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Feeling happy', 'expressed');
    });

    expect(result.current.safetyScore).toBe(1);

    act(() => {
      result.current.addLog('Feeling sad', 'suppressed');
    });

    // Safety score should not change for suppressed
    expect(result.current.safetyScore).toBe(1);

    act(() => {
      result.current.addLog('Feeling excited', 'expressed');
    });

    expect(result.current.safetyScore).toBe(2);
  });

  it('should persist logs to localStorage', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Test emotion', 'expressed');
    });

    const savedLogs = storageService.loadLogs();
    expect(savedLogs).toHaveLength(1);
    expect(savedLogs[0].text).toBe('Test emotion');
  });

  it('should persist creature state to localStorage', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Test emotion', 'expressed');
    });

    const savedState = storageService.loadCreatureState();
    expect(savedState).toMatchObject({
      brightness: 55,
      size: 52,
      animation: 'grow',
    });
  });

  it('should persist safety score to localStorage', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Test emotion', 'expressed');
    });

    const savedScore = storageService.loadSafetyScore();
    expect(savedScore).toBe(1);
  });

  it('should load initial state from localStorage', () => {
    // Pre-populate localStorage
    const existingLogs = [
      {
        id: 'existing-1',
        text: 'Previous emotion',
        action: 'expressed' as EmotionAction,
        timestamp: Date.now() - 1000,
      },
    ];
    storageService.saveLogs(existingLogs);
    storageService.saveCreatureState({
      brightness: 60,
      size: 55,
      animation: 'idle',
    });
    storageService.saveSafetyScore(5);

    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs[0].text).toBe('Previous emotion');
    expect(result.current.creatureState.brightness).toBe(60);
    expect(result.current.creatureState.size).toBe(55);
    expect(result.current.safetyScore).toBe(5);
  });

  it('should clear all logs and reset state', () => {
    const { result } = renderHook(() => useEmotion(), {
      wrapper: EmotionProvider,
    });

    act(() => {
      result.current.addLog('Test emotion', 'expressed');
    });

    expect(result.current.logs).toHaveLength(1);

    act(() => {
      result.current.clearLogs();
    });

    expect(result.current.logs).toEqual([]);
    expect(result.current.creatureState).toEqual({
      brightness: 50,
      size: 50,
      animation: 'idle',
    });
    expect(result.current.safetyScore).toBe(0);
  });

  it('should throw error when useEmotion is used outside provider', () => {
    expect(() => {
      renderHook(() => useEmotion());
    }).toThrow('useEmotion must be used within an EmotionProvider');
  });
});
