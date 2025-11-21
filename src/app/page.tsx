/**
 * Main page - Emotion Log Screen
 * Integrates all components for the primary interface
 * Requirements: 1.1, 2.1, 2.4, 10.1, 10.4
 */

'use client';

import React, { useState } from 'react';
import { useEmotion } from '@/context/EmotionContext';
import { EmotionInput } from '@/components/EmotionInput';
import { ActionButtons } from '@/components/ActionButtons';
import { Creature } from '@/components/Creature';
import { SafetyBar } from '@/components/SafetyBar';
import type { EmotionAction } from '@/types';
import styles from './page.module.css';

/**
 * Home page component
 * 
 * Requirements:
 * - 1.1: Display emotion log input as primary interface element
 * - 2.1: Display action buttons for expressed/suppressed
 * - 2.4: Clear input field after submission
 * - 10.1: Emotion log input is immediately accessible
 * - 10.4: Auto-focus cursor for immediate typing
 */
export default function Home() {
  const { creatureState, safetyScore, addLog } = useEmotion();
  const [inputValue, setInputValue] = useState('');
  const maxLength = 100;

  // Handle action button clicks
  // Requirement 2.4: Clear input after submission
  const handleAction = (action: EmotionAction) => {
    if (inputValue.trim().length === 0) {
      return; // Prevent empty submissions
    }

    // Add log to context
    addLog(inputValue, action);

    // Requirement 2.4: Clear input field after submission
    setInputValue('');
  };

  const handleExpress = () => handleAction('expressed');
  const handleSuppress = () => handleAction('suppressed');

  // Disable buttons when input is empty
  const isButtonDisabled = inputValue.trim().length === 0;

  return (
    <main className={styles.main}>
      {/* Creature at top - Requirement 10.1 */}
      <div className={styles.creatureSection}>
        <Creature state={creatureState} />
      </div>

      {/* Safety bar below creature */}
      <div className={styles.safetySection}>
        <SafetyBar score={safetyScore} />
      </div>

      {/* Input in middle - Requirement 1.1, 10.1, 10.4 */}
      <div className={styles.inputSection}>
        <EmotionInput
          value={inputValue}
          onChange={setInputValue}
          maxLength={maxLength}
        />
      </div>

      {/* Action buttons - Requirement 2.1 */}
      <div className={styles.actionsSection}>
        <ActionButtons
          onExpress={handleExpress}
          onSuppress={handleSuppress}
          disabled={isButtonDisabled}
        />
      </div>
    </main>
  );
}
