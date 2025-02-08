import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  navigationStore,
  shouldTriggerStartPageLoad,
  startPageLoad,
  endPageLoad,
} from './index';

vi.mock('next/dist/client/add-base-path', () => ({
  addBasePath: (href: string) => href,
}));

describe('navigationStore', () => {
  beforeEach(() => {
    // Reset the navigation state to idle before each test
    endPageLoad();
  });

  it('should initialize with idle state', () => {
    expect(navigationStore.getSnapshot()).toBe('idle');
  });

  it('should update state and notify subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = navigationStore.subscribe(listener);

    startPageLoad();
    expect(navigationStore.getSnapshot()).toBe('loading');
    expect(listener).toHaveBeenCalled();

    endPageLoad();
    expect(navigationStore.getSnapshot()).toBe('idle');
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
  });

  it('should handle multiple subscribers', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    const unsubscribe1 = navigationStore.subscribe(listener1);
    const unsubscribe2 = navigationStore.subscribe(listener2);

    startPageLoad();

    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();

    unsubscribe1();
    unsubscribe2();
  });
});

describe('shouldTriggerStartPageLoad', () => {
  beforeEach(() => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:3000',
        pathname: '/current-path',
        search: '',
        href: 'http://localhost:3000/current-path',
      },
      writable: true,
    });
  });

  it('should return true for internal navigation', () => {
    expect(shouldTriggerStartPageLoad('/new-path')).toBe(true);
  });

  it('should return false for same path navigation', () => {
    expect(shouldTriggerStartPageLoad('/current-path')).toBe(false);
  });

  it('should return false for external links', () => {
    expect(shouldTriggerStartPageLoad('https://example.com/path')).toBe(false);
  });

  it('should return false for modified events', () => {
    const event = {
      metaKey: true,
      currentTarget: {
        getAttribute: () => '_self',
      },
    } as unknown as React.MouseEvent<HTMLAnchorElement>;

    expect(shouldTriggerStartPageLoad('/new-path', event)).toBe(false);
  });
});

describe('startPageLoad and endPageLoad', () => {
  it('should correctly update navigation state', () => {
    startPageLoad();
    expect(navigationStore.getSnapshot()).toBe('loading');

    endPageLoad();
    expect(navigationStore.getSnapshot()).toBe('idle');
  });
});
