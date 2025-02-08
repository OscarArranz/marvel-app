import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import ProgressBar from './ProgressBar';
import { navigationStore } from '../../../../../utils/navigation';

describe('ProgressBar', () => {
  beforeEach(() => {
    // Use fake timers
    vi.useFakeTimers();

    // Reset navigation state
    navigationStore.setState('idle');
  });

  afterEach(() => {
    // Restore real timers
    vi.useRealTimers();
  });

  it('should render with initial state', () => {
    const { container } = render(<ProgressBar />);
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toBeDefined();
  });

  it('should start animation when navigation state changes to loading', () => {
    const { container } = render(<ProgressBar />);
    const progressBarContainer = container.querySelector(
      '[role="progressbar"]',
    );
    const progressBarElement = progressBarContainer?.children[0] as HTMLElement;

    expect(progressBarElement).toBeDefined();

    // Start loading
    act(() => {
      navigationStore.setState('loading');
      // Advance timers to simulate animation frames
      vi.advanceTimersByTime(100);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Initial progress should be set (around 25% based on INITIAL_PROGRESS)
    const width = parseFloat(progressBarElement.style.width || '0');
    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThan(90); // Should not reach completion
    expect(progressBarElement.style.opacity).toBe('1');
  });

  it('should complete animation when navigation state changes to idle', () => {
    const { container } = render(<ProgressBar />);
    const progressBarContainer = container.querySelector(
      '[role="progressbar"]',
    );
    const progressBarElement = progressBarContainer?.children[0] as HTMLElement;

    expect(progressBarElement).toBeDefined();

    // Start loading
    act(() => {
      navigationStore.setState('loading');
      vi.advanceTimersByTime(100);
    });

    // Complete loading
    act(() => {
      navigationStore.setState('idle');
      // Advance timers to allow completion animation to finish
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      vi.advanceTimersByTime(400); // We need to advance the timers to allow the animation to finish
    });

    // Progress should be complete
    expect(parseFloat(progressBarElement.style.width || '0')).toBe(100);
  });

  it('should have correct ARIA attributes', () => {
    const { container } = render(<ProgressBar />);
    const progressBar = container.querySelector('[role="progressbar"]');

    expect(progressBar?.getAttribute('aria-label')).toBe(
      'Page navigation progress',
    );
    expect(progressBar?.getAttribute('aria-valuemin')).toBe('0');
    expect(progressBar?.getAttribute('aria-valuemax')).toBe('100');
  });
});
