/**
 * Creature State Calculation Utilities
 * Handles all creature state calculations and transformations
 * Requirements: 3.1, 3.2, 3.4, 3.5
 */

import { CreatureState, EmotionAction } from '@/types';

/**
 * Calculate new creature state based on current state and action
 * 
 * State calculation rules:
 * - Each "expressed" action: brightness +5, size +2 (max 100)
 * - Each "suppressed" action: brightness -3, size -1 (min 0)
 * - Animation triggered based on action type
 * 
 * Requirements: 3.1, 3.2, 3.4, 3.5
 * 
 * @param currentState - The current creature state
 * @param action - The emotion action (expressed or suppressed)
 * @returns New creature state with updated values
 */
export function calculateNewState(
  currentState: CreatureState,
  action: EmotionAction
): CreatureState {
  // Determine changes based on action type
  const brightnessChange = action === 'expressed' ? 5 : -3;
  const sizeChange = action === 'expressed' ? 2 : -1;
  
  // Calculate new values with bounds (0-100)
  const newBrightness = Math.max(0, Math.min(100, 
    currentState.brightness + brightnessChange
  ));
  
  const newSize = Math.max(0, Math.min(100, 
    currentState.size + sizeChange
  ));
  
  // Determine animation based on action and resulting state
  let animation: CreatureState['animation'];
  if (action === 'expressed') {
    // Requirement 3.4: Maximum brightness triggers celebrate animation
    animation = newBrightness === 100 ? 'celebrate' : 'grow';
  } else {
    // Requirement 3.2: Suppressed emotions trigger curl animation
    animation = 'curl';
  }
  
  return {
    brightness: newBrightness,
    size: newSize,
    animation
  };
}

/**
 * Get the initial creature state
 * 
 * Default state:
 * - brightness: 50 (middle value)
 * - size: 50 (middle value)
 * - animation: 'idle' (no action yet)
 * 
 * @returns Initial creature state
 */
export function getInitialState(): CreatureState {
  return {
    brightness: 50,
    size: 50,
    animation: 'idle'
  };
}
