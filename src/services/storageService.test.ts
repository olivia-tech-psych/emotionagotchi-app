/**
 * Unit tests for storageService
 * Requirements: 5.1, 5.2, 5.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { storageService } from './storageService';
import { EmotionLog, CreatureState } from '@/types';

describe('storageService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveLogs and loadLogs', () => {
    it('should save and load emotion logs', () => {
      const logs: EmotionLog[] = [
        {
          id: '123',
          text: 'Feeling happy',
          action: 'expressed',
          timestamp: Date.now(),
        },
      ];

      storageService.saveLogs(logs);
      const loaded = storageService.loadLogs();

      expect(loaded).toEqual(logs);
    });

    it('should return empty array when no logs exist', () => {
      const loaded = storageService.loadLogs();
      expect(loaded).toEqual([]);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('emotionagotchi_logs', 'invalid json');
      const loaded = storageService.loadLogs();
      expect(loaded).toEqual([]);
    });
  });

  describe('saveCreatureState and loadCreatureState', () => {
    it('should save and load creature state', () => {
      const state: CreatureState = {
        brightness: 75,
        size: 60,
        animation: 'grow',
      };

      storageService.saveCreatureState(state);
      const loaded = storageService.loadCreatureState();

      expect(loaded).toEqual(state);
    });

    it('should return null when no state exists', () => {
      const loaded = storageService.loadCreatureState();
      expect(loaded).toBeNull();
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('emotionagotchi_creature', 'invalid json');
      const loaded = storageService.loadCreatureState();
      expect(loaded).toBeNull();
    });
  });

  describe('saveSafetyScore and loadSafetyScore', () => {
    it('should save and load safety score', () => {
      storageService.saveSafetyScore(42);
      const loaded = storageService.loadSafetyScore();

      expect(loaded).toBe(42);
    });

    it('should return 0 when no score exists', () => {
      const loaded = storageService.loadSafetyScore();
      expect(loaded).toBe(0);
    });

    it('should handle corrupted data gracefully', () => {
      localStorage.setItem('emotionagotchi_safety', 'not a number');
      const loaded = storageService.loadSafetyScore();
      expect(loaded).toBe(0);
    });
  });

  describe('clearAll', () => {
    it('should clear all stored data', () => {
      const logs: EmotionLog[] = [
        {
          id: '123',
          text: 'Test',
          action: 'expressed',
          timestamp: Date.now(),
        },
      ];
      const state: CreatureState = {
        brightness: 50,
        size: 50,
        animation: 'idle',
      };

      storageService.saveLogs(logs);
      storageService.saveCreatureState(state);
      storageService.saveSafetyScore(10);

      storageService.clearAll();

      expect(storageService.loadLogs()).toEqual([]);
      expect(storageService.loadCreatureState()).toBeNull();
      expect(storageService.loadSafetyScore()).toBe(0);
    });
  });

  /**
   * Error condition tests
   * Requirement 5.4: Handle localStorage failures
   */
  describe('Error Handling', () => {
    describe('localStorage failure handling', () => {
      let originalSetItem: typeof Storage.prototype.setItem;
      let originalGetItem: typeof Storage.prototype.getItem;

      beforeEach(() => {
        originalSetItem = Storage.prototype.setItem;
        originalGetItem = Storage.prototype.getItem;
      });

      afterEach(() => {
        Storage.prototype.setItem = originalSetItem;
        Storage.prototype.getItem = originalGetItem;
      });

      it('should handle localStorage.setItem failure for logs', () => {
        // Mock setItem to throw an error
        Storage.prototype.setItem = vi.fn(() => {
          throw new Error('Storage unavailable');
        });

        const logs: EmotionLog[] = [
          {
            id: '123',
            text: 'Test',
            action: 'expressed',
            timestamp: Date.now(),
          },
        ];

        const result = storageService.saveLogs(logs);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
        expect(storageService.getLastError()).toBeTruthy();
      });

      it('should handle localStorage.setItem failure for creature state', () => {
        Storage.prototype.setItem = vi.fn(() => {
          throw new Error('Storage unavailable');
        });

        const state: CreatureState = {
          brightness: 50,
          size: 50,
          animation: 'idle',
        };

        const result = storageService.saveCreatureState(state);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should handle localStorage.setItem failure for safety score', () => {
        Storage.prototype.setItem = vi.fn(() => {
          throw new Error('Storage unavailable');
        });

        const result = storageService.saveSafetyScore(42);

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });

      it('should handle quota exceeded error', () => {
        // First, allow the availability check to pass, then throw on actual setItem
        let callCount = 0;
        Storage.prototype.setItem = vi.fn((key: string) => {
          callCount++;
          // First call is the availability check, let it pass
          if (callCount === 1) {
            return;
          }
          // Second call is the actual save, throw QuotaExceededError
          const error = new DOMException('Quota exceeded', 'QuotaExceededError');
          throw error;
        });
        
        Storage.prototype.removeItem = vi.fn(); // Allow removeItem for availability check

        const logs: EmotionLog[] = [
          {
            id: '123',
            text: 'Test',
            action: 'expressed',
            timestamp: Date.now(),
          },
        ];

        const result = storageService.saveLogs(logs);

        expect(result.success).toBe(false);
        expect(result.error).toContain('Storage full');
      });

      it('should handle localStorage unavailable', () => {
        // Mock localStorage to be unavailable
        Storage.prototype.setItem = vi.fn(() => {
          throw new Error('localStorage is not available');
        });
        Storage.prototype.getItem = vi.fn(() => {
          throw new Error('localStorage is not available');
        });

        const logs = storageService.loadLogs();
        expect(logs).toEqual([]);

        const state = storageService.loadCreatureState();
        expect(state).toBeNull();

        const score = storageService.loadSafetyScore();
        expect(score).toBe(0);
      });
    });

    describe('corrupted data recovery', () => {
      it('should handle non-array data in logs', () => {
        localStorage.setItem('emotionagotchi_logs', '{"not": "an array"}');
        const loaded = storageService.loadLogs();
        expect(loaded).toEqual([]);
      });

      it('should handle invalid JSON in logs', () => {
        localStorage.setItem('emotionagotchi_logs', 'not valid json {]');
        const loaded = storageService.loadLogs();
        expect(loaded).toEqual([]);
      });

      it('should handle invalid creature state structure', () => {
        localStorage.setItem('emotionagotchi_creature', '{"invalid": "structure"}');
        const loaded = storageService.loadCreatureState();
        expect(loaded).toBeNull();
      });

      it('should handle invalid JSON in creature state', () => {
        localStorage.setItem('emotionagotchi_creature', 'not valid json {]');
        const loaded = storageService.loadCreatureState();
        expect(loaded).toBeNull();
      });

      it('should handle non-numeric safety score', () => {
        localStorage.setItem('emotionagotchi_safety', 'not a number');
        const loaded = storageService.loadSafetyScore();
        expect(loaded).toBe(0);
      });

      it('should handle invalid safety score format', () => {
        localStorage.setItem('emotionagotchi_safety', '{"not": "a number"}');
        const loaded = storageService.loadSafetyScore();
        expect(loaded).toBe(0);
      });
    });
  });
});
