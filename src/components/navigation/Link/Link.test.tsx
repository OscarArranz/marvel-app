import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import Link from './Link';
import * as navigation from '../../../utils/navigation';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: vi.fn().mockImplementation(({ children, onClick, ...props }) => {
    return (
      <a
        onClick={e => {
          e.preventDefault(); // Prevent actual navigation
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }),
}));

// Mock the navigation utilities
vi.mock('../../../utils/navigation', () => ({
  shouldTriggerStartPageLoad: vi.fn(),
  startPageLoad: vi.fn(),
}));

describe('Link', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('should render correctly with basic props', () => {
    const { getByRole } = render(<Link href="/test">Test Link</Link>);
    expect(getByRole('link')).toBeDefined();
  });

  it('should call startPageLoad when shouldTriggerStartPageLoad returns true', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    const mockStartPageLoad = vi.mocked(navigation.startPageLoad);

    mockShouldTrigger.mockReturnValue(true);

    const { getByRole } = render(<Link href="/test">Test Link</Link>);

    fireEvent.click(getByRole('link'));

    expect(mockShouldTrigger).toHaveBeenCalled();
    expect(mockStartPageLoad).toHaveBeenCalled();
  });

  it('should not call startPageLoad when shouldTriggerStartPageLoad returns false', () => {
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    const mockStartPageLoad = vi.mocked(navigation.startPageLoad);

    mockShouldTrigger.mockReturnValue(false);

    const { getByRole } = render(<Link href="/test">Test Link</Link>);

    fireEvent.click(getByRole('link'));

    expect(mockShouldTrigger).toHaveBeenCalled();
    expect(mockStartPageLoad).not.toHaveBeenCalled();
  });

  it('should call custom onClick handler when provided', () => {
    const mockOnClick = vi.fn();
    const mockShouldTrigger = vi.mocked(navigation.shouldTriggerStartPageLoad);
    mockShouldTrigger.mockReturnValue(false);

    const { getByRole } = render(
      <Link href="/test" onClick={mockOnClick}>
        Test Link
      </Link>,
    );

    fireEvent.click(getByRole('link'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(
      <Link href="/test" ref={ref}>
        Test Link
      </Link>,
    );

    expect(ref).toHaveBeenCalled();
  });
});
