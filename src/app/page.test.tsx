/**
 * Tests for main page component
 * Includes property-based tests for input clearing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import Home from './page';
import { EmotionProvider } from '@/context/EmotionContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Helper to render with context
function renderWithContext(component: React.ReactElement) {
  return render(<EmotionProvider>{component}</EmotionProvider>);
}

describe('Home Page', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should render all main components', async () => {
    renderWithContext(<Home />);
    
    // Wait for context to initialize
    await waitFor(() => {
      expect(screen.getByLabelText(/emotion log input/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/express/i)).toBeInTheDocument();
    expect(screen.getByText(/suppress/i)).toBeInTheDocument();
    expect(screen.getByText(/inner safety bar/i)).toBeInTheDocument();
  });

  /**
   * Feature: emotionagotchi, Property 3: Input clearing after submission
   * For any emotion log submission (expressed or suppressed), 
   * the input field should be empty immediately after the action completes.
   * 
   * Validates: Requirements 2.4
   */
  describe('Property 3: Input clearing after submission', () => {
    it('should clear input after any submission action', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.constantFrom('expressed', 'suppressed'),
          async (inputText, actionType) => {
            // Clear localStorage before each property test iteration
            localStorageMock.clear();
            
            // Render the component
            const { unmount } = renderWithContext(<Home />);
            
            // Wait for context to initialize
            await waitFor(() => {
              expect(screen.getByLabelText(/emotion log input/i)).toBeInTheDocument();
            });
            
            // Get the input element
            const input = screen.getByLabelText(/emotion log input/i) as HTMLTextAreaElement;
            
            // Type the text into the input
            fireEvent.change(input, { target: { value: inputText } });
            
            // Verify text is in the input
            expect(input.value).toBe(inputText);
            
            // Click the appropriate action button
            const button = actionType === 'expressed' 
              ? screen.getByLabelText(/express emotion/i)
              : screen.getByLabelText(/suppress emotion/i);
            
            fireEvent.click(button);
            
            // Wait for the input to be cleared
            await waitFor(() => {
              expect(input.value).toBe('');
            });
            
            // Cleanup
            unmount();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Feature: emotionagotchi, Property 12: No external network requests
   * For any user interaction with the application, 
   * the browser should not make HTTP requests to external servers for user data operations.
   * 
   * Validates: Requirements 9.2
   */
  describe('Property 12: No external network requests', () => {
    it('should not make external network requests during user interactions', async () => {
      // Track network requests
      const networkRequests: string[] = [];
      const originalFetch = global.fetch;
      const originalXHR = global.XMLHttpRequest;
      
      // Mock fetch to track requests
      global.fetch = vi.fn((url: string | URL | Request) => {
        const urlString = typeof url === 'string' ? url : url.toString();
        networkRequests.push(urlString);
        return Promise.reject(new Error('Network request blocked in test'));
      }) as any;
      
      // Mock XMLHttpRequest to track requests
      class MockXHR {
        open(method: string, url: string) {
          networkRequests.push(url);
        }
        send() {}
        setRequestHeader() {}
      }
      global.XMLHttpRequest = MockXHR as any;
      
      try {
        await fc.assert(
          fc.asyncProperty(
            fc.string({ minLength: 1, maxLength: 100 }),
            fc.constantFrom('expressed', 'suppressed'),
            async (inputText, actionType) => {
              // Clear localStorage before each property test iteration
              localStorageMock.clear();
              
              // Clear network requests tracking
              networkRequests.length = 0;
              
              // Render the component
              const { unmount } = renderWithContext(<Home />);
              
              // Wait for context to initialize
              await waitFor(() => {
                expect(screen.getByLabelText(/emotion log input/i)).toBeInTheDocument();
              }, { timeout: 1000 });
              
              // Get the input element
              const input = screen.getByLabelText(/emotion log input/i) as HTMLTextAreaElement;
              
              // Type the text into the input
              fireEvent.change(input, { target: { value: inputText } });
              
              // Click the appropriate action button
              const button = actionType === 'expressed' 
                ? screen.getByLabelText(/express emotion/i)
                : screen.getByLabelText(/suppress emotion/i);
              
              fireEvent.click(button);
              
              // Verify no external network requests were made
              // Filter out any localhost/relative URLs as those are internal
              const externalRequests = networkRequests.filter(url => {
                return !url.startsWith('/') && 
                       !url.includes('localhost') && 
                       !url.includes('127.0.0.1');
              });
              
              expect(externalRequests).toHaveLength(0);
              
              // Cleanup
              unmount();
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        // Restore original implementations
        global.fetch = originalFetch;
        global.XMLHttpRequest = originalXHR;
      }
    }, 30000); // 30 second timeout for this test
  });
});
