import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import RouteChangeHandler from './RouteChangeHandler';
import * as navigation from '../../../utils/navigation';

// Mock the navigation utilities
vi.mock('../../../utils/navigation', () => ({
  endPageLoad: vi.fn(),
}));

// Mock Next.js navigation hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/test'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

describe('RouteChangeHandler', () => {
  it('should call endPageLoad when route changes', () => {
    const mockEndPageLoad = vi.mocked(navigation.endPageLoad);

    render(<RouteChangeHandler />);

    expect(mockEndPageLoad).toHaveBeenCalled();
  });

  it('should render nothing visibly', () => {
    const { container } = render(<RouteChangeHandler />);
    expect(container.firstChild).toBeNull();
  });
});
