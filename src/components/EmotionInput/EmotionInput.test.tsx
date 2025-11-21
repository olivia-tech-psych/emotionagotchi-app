/**
 * Unit tests for EmotionInput component
 * Tests edge cases for input validation and behavior
 * Requirements: 1.4, 1.5
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmotionInput } from './EmotionInput';

describe('EmotionInput', () => {
  /**
   * Test: Empty input prevents submission
   * Requirement 1.4: Prevent empty submission
   */
  it('should allow empty input value', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).toHaveValue('');
  });

  /**
   * Test: Auto-focus behavior
   * Requirement 1.5: Auto-focus input on mount
   */
  it('should auto-focus the textarea on mount', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).toHaveFocus();
  });

  /**
   * Test: Auto-focus should not occur when disabled
   */
  it('should not auto-focus when disabled', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100}
        disabled={true}
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).not.toHaveFocus();
  });

  /**
   * Test: Character counter display
   * Requirement 1.2: Show real-time character counter
   */
  it('should display correct character counter for empty input', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    expect(screen.getByText('100/100')).toBeInTheDocument();
  });

  /**
   * Test: Character counter updates with input
   * Requirement 1.2: Show real-time character counter
   */
  it('should display correct character counter with text', () => {
    const onChange = vi.fn();
    const text = 'Feeling happy today';
    
    render(
      <EmotionInput 
        value={text} 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const remaining = 100 - text.length;
    expect(screen.getByText(`${remaining}/100`)).toBeInTheDocument();
  });

  /**
   * Test: Character counter at maximum length
   * Requirement 1.3: Prevent exceeding max length
   */
  it('should display 0 remaining when at max length', () => {
    const onChange = vi.fn();
    const text = 'a'.repeat(100);
    
    render(
      <EmotionInput 
        value={text} 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    expect(screen.getByText('0/100')).toBeInTheDocument();
  });

  /**
   * Test: Textarea displays current value
   */
  it('should display the current value in textarea', () => {
    const onChange = vi.fn();
    const text = 'Test emotion';
    
    render(
      <EmotionInput 
        value={text} 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).toHaveValue(text);
  });

  /**
   * Test: Disabled state
   */
  it('should be disabled when disabled prop is true', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100}
        disabled={true}
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).toBeDisabled();
  });

  /**
   * Test: Accessibility - ARIA labels
   */
  it('should have proper ARIA labels', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const textarea = screen.getByRole('textbox', { name: /emotion log input/i });
    expect(textarea).toHaveAttribute('aria-label', 'Emotion log input');
    expect(textarea).toHaveAttribute('aria-describedby', 'char-counter');
  });

  /**
   * Test: Character counter has live region for screen readers
   */
  it('should have aria-live on character counter', () => {
    const onChange = vi.fn();
    
    render(
      <EmotionInput 
        value="" 
        onChange={onChange} 
        maxLength={100} 
      />
    );

    const counter = screen.getByText('100/100');
    expect(counter).toHaveAttribute('aria-live', 'polite');
  });
});
