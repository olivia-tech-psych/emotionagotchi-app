/**
 * LogHistory Component
 * Displays emotion logs in reverse chronological order
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React from 'react';
import { EmotionLog } from '@/types';
import styles from './LogHistory.module.css';

interface LogHistoryProps {
  logs: EmotionLog[];
}

/**
 * Format timestamp as human-readable date
 * Requirement 6.2: Display timestamp in readable format
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  if (isToday) {
    return `Today, ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeString}`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }) + `, ${timeString}`;
  }
}

/**
 * LogHistory component
 * 
 * Requirements:
 * - 6.1: Display logs in reverse chronological order
 * - 6.2: Show timestamp, text, and action type
 * - 6.3: Display empty state message
 * - 6.4: Implement scrolling for long lists
 * - 6.5: Use visual indicators for expressed vs suppressed
 */
export function LogHistory({ logs }: LogHistoryProps) {
  // Requirement 6.3: Empty state message
  if (logs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyMessage}>
          No emotions logged yet. Start by sharing how you're feeling! 🌱
        </p>
      </div>
    );
  }
  
  // Requirement 6.1: Sort logs in reverse chronological order (newest first)
  const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className={styles.container}>
      <ul className={styles.logList}>
        {sortedLogs.map((log) => (
          <li
            key={log.id}
            data-testid="log-item"
            className={`${styles.logItem} ${
              log.action === 'expressed' ? styles.expressed : styles.suppressed
            }`}
          >
            {/* Requirement 6.5: Visual indicator for action type */}
            <span className={styles.icon} aria-label={log.action}>
              {log.action === 'expressed' ? '🌱' : '🌑'}
            </span>
            
            <div className={styles.logContent}>
              {/* Requirement 6.2: Display timestamp */}
              <time className={styles.timestamp} dateTime={new Date(log.timestamp).toISOString()}>
                {formatTimestamp(log.timestamp)}
              </time>
              
              {/* Requirement 6.2: Display emotion text */}
              <p className={styles.text}>{log.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
