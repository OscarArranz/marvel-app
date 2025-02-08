import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRouter } from './useRouter';
import * as navigation from '../../utils/navigation';

// Mock the navigation utilities
vi.mock('../../utils/navigation', () => ({
  shouldTriggerStartPageLoad: vi.fn(),
  startPageLoad: vi.fn(),
}));

// Mock Next.js router
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    // Add other router methods that might be needed
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('useRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call startPageLoad and router.push when shouldTriggerStartPageLoad returns true', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    const mockStartPageLoad = vi.mocked(navigation.startPageLoad);
    mockShouldTrigger.mockReturnValue(true);

    const { result } = renderHook(() => useRouter());

    result.current.push('/test-route');

    expect(mockShouldTrigger).toHaveBeenCalledWith('/test-route');
    expect(mockStartPageLoad).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/test-route', undefined);
  });

  it('should not call startPageLoad when shouldTriggerStartPageLoad returns false', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    const mockStartPageLoad = vi.mocked(navigation.startPageLoad);
    mockShouldTrigger.mockReturnValue(false);

    const { result } = renderHook(() => useRouter());

    result.current.push('/test-route');

    expect(mockShouldTrigger).toHaveBeenCalledWith('/test-route');
    expect(mockStartPageLoad).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/test-route', undefined);
  });

  it('should call startPageLoad and router.replace when shouldTriggerStartPageLoad returns true', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    const mockStartPageLoad = vi.mocked(navigation.startPageLoad);
    mockShouldTrigger.mockReturnValue(true);

    const { result } = renderHook(() => useRouter());

    result.current.replace('/test-route');

    expect(mockShouldTrigger).toHaveBeenCalledWith('/test-route');
    expect(mockStartPageLoad).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/test-route', undefined);
  });

  it('should handle navigation options', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    mockShouldTrigger.mockReturnValue(true);

    const { result } = renderHook(() => useRouter());
    const options = { scroll: false };

    result.current.push('/test-route', options);

    expect(mockPush).toHaveBeenCalledWith('/test-route', options);
  });
});
