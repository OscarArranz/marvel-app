import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should debounce function calls', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // Call the debounced function multiple times
    debouncedFn('test1');
    debouncedFn('test2');
    debouncedFn('test3');

    // Verify callback hasn't been called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast forward time by delay
    vi.advanceTimersByTime(delay);

    // Verify callback was called once with the last value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });

  it('should cancel previous timeout when called again', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // First call
    debouncedFn('test1');

    // Advance time partially
    vi.advanceTimersByTime(200);

    // Second call should cancel first timeout
    debouncedFn('test2');

    // Advance time to just before second timeout
    vi.advanceTimersByTime(499);

    // Callback shouldn't have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Advance time to complete second timeout
    vi.advanceTimersByTime(1);

    // Verify callback was called once with second value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test2');
  });

  it('should handle multiple arguments', () => {
    const callback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // Call with multiple arguments
    debouncedFn('test', 123, { foo: 'bar' });

    vi.advanceTimersByTime(delay);

    // Verify all arguments were passed through
    expect(callback).toHaveBeenCalledWith('test', 123, { foo: 'bar' });
  });

  it('should handle rapid successive calls', () => {
    const callback = vi.fn();
    const delay = 100;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // Simulate rapid typing
    debouncedFn('t');
    vi.advanceTimersByTime(50);

    debouncedFn('te');
    vi.advanceTimersByTime(50);

    debouncedFn('tes');
    vi.advanceTimersByTime(50);

    debouncedFn('test');
    vi.advanceTimersByTime(50);

    // No calls yet
    expect(callback).not.toHaveBeenCalled();

    // Complete the last delay
    vi.advanceTimersByTime(50);

    // Only the final value should be used
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });
});
