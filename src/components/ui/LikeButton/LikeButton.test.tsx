import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import LikeButton from './LikeButton';
import * as useLocalStorageHook from '../../../hooks/browser/useLocalStorage';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../utils/constants';

// Mock the useLocalStorage hook
vi.mock('../../../hooks/browser/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}));

type LikedCharactersType = Record<string, boolean>;

describe('LikeButton', () => {
  const mockSetLikedCharacters = vi.fn();
  const characterName = 'Spider-Man';

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock the useLocalStorage hook implementation
    (useLocalStorageHook.useLocalStorage as any).mockReturnValue([
      {} as LikedCharactersType,
      mockSetLikedCharacters,
      vi.fn(), // removeItem function
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render with initial unliked state', () => {
    const { getByRole } = render(<LikeButton name={characterName} />);
    const button = getByRole('button');

    expect(button).toBeDefined();
    expect(button.getAttribute('aria-label')).toBe(`Like ${characterName}`);
  });

  it('should render with liked state when character is in storage', () => {
    // Mock the character as already liked
    (useLocalStorageHook.useLocalStorage as any).mockReturnValue([
      { [characterName]: true } as LikedCharactersType,
      mockSetLikedCharacters,
      vi.fn(),
    ]);

    const { getByRole } = render(<LikeButton name={characterName} />);
    const button = getByRole('button');

    expect(button.getAttribute('aria-label')).toBe(`Unlike ${characterName}`);
  });

  it('should add character to liked characters when clicked in unliked state', () => {
    const { getByRole } = render(<LikeButton name={characterName} />);
    const button = getByRole('button');

    fireEvent.click(button);

    expect(mockSetLikedCharacters).toHaveBeenCalledWith({
      [characterName]: true,
    });
  });

  it('should remove character from liked characters when clicked in liked state', () => {
    // Mock the character as already liked
    (useLocalStorageHook.useLocalStorage as any).mockReturnValue([
      { [characterName]: true } as LikedCharactersType,
      mockSetLikedCharacters,
      vi.fn(),
    ]);

    const { getByRole } = render(<LikeButton name={characterName} />);
    const button = getByRole('button');

    fireEvent.click(button);

    expect(mockSetLikedCharacters).toHaveBeenCalledWith({});
  });

  it('should apply custom className to liked icon when provided', () => {
    // Mock the character as liked to show the liked icon
    (useLocalStorageHook.useLocalStorage as any).mockReturnValue([
      { [characterName]: true } as LikedCharactersType,
      mockSetLikedCharacters,
      vi.fn(),
    ]);

    const customClassName = 'custom-icon-class';
    const { container } = render(
      <LikeButton name={characterName} likedIconClassName={customClassName} />,
    );

    const likedIcon = container.querySelector(`.${customClassName}`);
    expect(likedIcon).toBeDefined();
  });

  it('should handle multiple characters in storage', () => {
    const existingCharacters: LikedCharactersType = {
      'Iron Man': true,
      Thor: true,
    };

    // Mock storage with existing characters
    (useLocalStorageHook.useLocalStorage as any).mockReturnValue([
      existingCharacters,
      mockSetLikedCharacters,
      vi.fn(),
    ]);

    const { getByRole } = render(<LikeButton name={characterName} />);
    const button = getByRole('button');

    fireEvent.click(button);

    expect(mockSetLikedCharacters).toHaveBeenCalledWith({
      ...existingCharacters,
      [characterName]: true,
    });
  });

  it('should use correct storage key', () => {
    render(<LikeButton name={characterName} />);

    expect(useLocalStorageHook.useLocalStorage).toHaveBeenCalledWith(
      LIKED_CHARACTERS_STORAGE_KEY,
      {},
    );
  });
});
