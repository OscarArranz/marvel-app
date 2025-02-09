import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act, cleanup } from '@testing-library/react';
import SearchBox from './SearchBox';

// Mock the Image component from next/image
vi.mock('next/image', () => ({
  default: vi
    .fn()
    .mockImplementation(({ src, alt, ...props }) => (
      <img src={src} alt={alt} {...props} />
    )),
}));

describe('SearchBox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup();
  });

  it('should render with placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchBox placeholder="Test placeholder" onSearch={() => {}} />,
    );
    expect(getByPlaceholderText('TEST PLACEHOLDER')).toBeDefined();
  });

  it('should display results amount when provided', () => {
    const { getByText } = render(
      <SearchBox
        placeholder="Test placeholder"
        resultsAmount={5}
        onSearch={() => {}}
      />,
    );
    expect(getByText('5 RESULTS')).toBeDefined();
  });

  it('should not display results when resultsAmount is not provided', () => {
    const { queryByRole } = render(
      <SearchBox placeholder="Test placeholder" onSearch={() => {}} />,
    );
    expect(queryByRole('status')).toBeNull();
  });

  it('should call onSearch with debounce when typing', async () => {
    const mockOnSearch = vi.fn();
    const { getByRole } = render(
      <SearchBox placeholder="Test placeholder" onSearch={mockOnSearch} />,
    );

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    // Verify that onSearch hasn't been called immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now onSearch should have been called
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('should debounce multiple rapid inputs', () => {
    const mockOnSearch = vi.fn();
    const { getByRole } = render(
      <SearchBox placeholder="Test placeholder" onSearch={mockOnSearch} />,
    );

    const input = getByRole('textbox');

    // Type 'h', 'he', 'hel', 'hell', 'hello' rapidly
    fireEvent.change(input, { target: { value: 'h' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.change(input, { target: { value: 'he' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.change(input, { target: { value: 'hel' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.change(input, { target: { value: 'hell' } });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    fireEvent.change(input, { target: { value: 'hello' } });

    // Verify that onSearch hasn't been called yet
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward remaining time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Verify onSearch was only called once with final value
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('hello');
  });

  it('should convert input value to uppercase', () => {
    const { getByRole } = render(
      <SearchBox placeholder="Test placeholder" onSearch={() => {}} />,
    );

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(input.getAttribute('value')).toBe('TEST');
  });
});
