/**
 * Tests for Creature State Calculation Utilities
 * Requirements: 3.1, 3.2, 3.4, 3.5
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { calculateNewState, getInitialState } from './creatureState';
import { CreatureState, EmotionAction } from '@/types';

/**
 * Feature: emotionagotchi, Property 4: Creature brightness responds to actions
 * For any sequence of emotion logs, the creature brightness should increase by 5 
 * for each "expressed" action and decrease by 3 for each "suppressed" action, 
 * bounded between 0 and 100.
 * 
 * Validates: Requirements 3.1, 3.2
 */
describe('Property 4: Creature brightness responds to actions', () => {
  it('should increase brightness by 5 for expressed actions', () => {
    fc.assert(
      fc.property(
        // Generate random brightness values between 0 and 95 (so +5 doesn't exceed 100)
        fc.integer({ min: 0, max: 95 }),
        fc.integer({ min: 0, max: 100 }),
        (brightness, size) => {
          const currentState: CreatureState = {
            brightness,
            size,
            animation: 'idle'
          };
          
          const newState = calculateNewState(currentState, 'expressed');
          
          // Brightness should increase by exactly 5
          expect(newState.brightness).toBe(brightness + 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should decrease brightness by 3 for suppressed actions', () => {
    fc.assert(
      fc.property(
        // Generate random brightness values between 3 and 100 (so -3 doesn't go below 0)
        fc.integer({ min: 3, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (brightness, size) => {
          const currentState: CreatureState = {
            brightness,
            size,
            animation: 'idle'
          };
          
          const newState = calculateNewState(currentState, 'suppressed');
          
          // Brightness should decrease by exactly 3
          expect(newState.brightness).toBe(brightness - 3);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should bound brightness between 0 and 100 for any sequence of actions', () => {
    fc.assert(
      fc.property(
        // Generate random sequences of actions
        fc.array(fc.constantFrom<EmotionAction>('expressed', 'suppressed'), { minLength: 1, maxLength: 50 }),
        (actions) => {
          let state = getInitialState();
          
          // Apply all actions in sequence
          for (const action of actions) {
            state = calculateNewState(state, action);
            
            // Brightness must always be between 0 and 100
            expect(state.brightness).toBeGreaterThanOrEqual(0);
            expect(state.brightness).toBeLessThanOrEqual(100);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should increase size by 2 for expressed actions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        // Generate random size values between 0 and 98 (so +2 doesn't exceed 100)
        fc.integer({ min: 0, max: 98 }),
        (brightness, size) => {
          const currentState: CreatureState = {
            brightness,
            size,
            animation: 'idle'
          };
          
          const newState = calculateNewState(currentState, 'expressed');
          
          // Size should increase by exactly 2
          expect(newState.size).toBe(size + 2);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should decrease size by 1 for suppressed actions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        // Generate random size values between 1 and 100 (so -1 doesn't go below 0)
        fc.integer({ min: 1, max: 100 }),
        (brightness, size) => {
          const currentState: CreatureState = {
            brightness,
            size,
            animation: 'idle'
          };
          
          const newState = calculateNewState(currentState, 'suppressed');
          
          // Size should decrease by exactly 1
          expect(newState.size).toBe(size - 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should bound size between 0 and 100 for any sequence of actions', () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom<EmotionAction>('expressed', 'suppressed'), { minLength: 1, maxLength: 50 }),
        (actions) => {
          let state = getInitialState();
          
          // Apply all actions in sequence
          for (const action of actions) {
            state = calculateNewState(state, action);
            
            // Size must always be between 0 and 100
            expect(state.size).toBeGreaterThanOrEqual(0);
            expect(state.size).toBeLessThanOrEqual(100);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Unit tests for creature state edge cases
 * Requirements: 3.4, 3.5
 */
describe('Creature state edge cases', () => {
  it('should trigger celebrate animation when brightness reaches 100', () => {
    const currentState: CreatureState = {
      brightness: 95,
      size: 50,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'expressed');
    
    // Brightness should be 100
    expect(newState.brightness).toBe(100);
    // Animation should be celebrate
    expect(newState.animation).toBe('celebrate');
  });

  it('should trigger grow animation when expressing but not at max brightness', () => {
    const currentState: CreatureState = {
      brightness: 50,
      size: 50,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'expressed');
    
    // Brightness should be 55
    expect(newState.brightness).toBe(55);
    // Animation should be grow (not celebrate)
    expect(newState.animation).toBe('grow');
  });

  it('should handle minimum brightness (0) correctly', () => {
    const currentState: CreatureState = {
      brightness: 0,
      size: 0,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'suppressed');
    
    // Brightness should stay at 0 (not go negative)
    expect(newState.brightness).toBe(0);
    // Size should stay at 0 (not go negative)
    expect(newState.size).toBe(0);
    // Animation should be curl
    expect(newState.animation).toBe('curl');
  });

  it('should handle maximum brightness (100) correctly', () => {
    const currentState: CreatureState = {
      brightness: 100,
      size: 100,
      animation: 'celebrate'
    };
    
    const newState = calculateNewState(currentState, 'expressed');
    
    // Brightness should stay at 100 (not exceed)
    expect(newState.brightness).toBe(100);
    // Size should stay at 100 (not exceed)
    expect(newState.size).toBe(100);
    // Animation should still be celebrate
    expect(newState.animation).toBe('celebrate');
  });

  it('should handle boundary condition: brightness at 2 with suppressed action', () => {
    const currentState: CreatureState = {
      brightness: 2,
      size: 50,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'suppressed');
    
    // Brightness should be 0 (2 - 3 = -1, bounded to 0)
    expect(newState.brightness).toBe(0);
  });

  it('should handle boundary condition: size at 1 with suppressed action', () => {
    const currentState: CreatureState = {
      brightness: 50,
      size: 1,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'suppressed');
    
    // Size should be 0 (1 - 1 = 0)
    expect(newState.size).toBe(0);
  });

  it('should handle boundary condition: brightness at 99 with expressed action', () => {
    const currentState: CreatureState = {
      brightness: 99,
      size: 50,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'expressed');
    
    // Brightness should be 100 (99 + 5 = 104, bounded to 100)
    expect(newState.brightness).toBe(100);
    // Should trigger celebrate animation
    expect(newState.animation).toBe('celebrate');
  });

  it('should handle boundary condition: size at 99 with expressed action', () => {
    const currentState: CreatureState = {
      brightness: 50,
      size: 99,
      animation: 'idle'
    };
    
    const newState = calculateNewState(currentState, 'expressed');
    
    // Size should be 100 (99 + 2 = 101, bounded to 100)
    expect(newState.size).toBe(100);
  });

  it('should return correct initial state', () => {
    const initialState = getInitialState();
    
    expect(initialState.brightness).toBe(50);
    expect(initialState.size).toBe(50);
    expect(initialState.animation).toBe('idle');
  });
});
