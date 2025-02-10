'use client';

import styles from './CharactersGrid.module.css';
import CharacterCard from './components/CharacterCard';
import { useSearch } from '../../../context/SearchContext';
import { useLocalStorage } from '../../../hooks';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../utils/constants';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const fetchCharacter = async (name: string) => {
  const response = await fetch(`/api/characters/${name}`);

  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }

  return await response.json();
};

/**
 * CharacterGrid component
 *
 * @returns {JSX.Element} The CharacterGrid component
 */
const CharactersGrid = () => {
  const { searchTerm, setResultsAmount } = useSearch();
  const searchParams = useSearchParams();
  const [likedCharactersObj] = useLocalStorage(
    LIKED_CHARACTERS_STORAGE_KEY,
    {},
  );
  const lastRequestIdRef = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const [characters, setCharacters] = useState<any[]>([]);
  const [hasLoadedFilteredCharacters, setHasLoadedFilteredCharacters] =
    useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterCards = useMemo(
    () =>
      characters
        .filter(character => {
          if (searchParams.get('filter') === 'liked' && searchTerm) {
            return character.name
              .toLowerCase()
              .startsWith(searchTerm.toLowerCase());
          }

          return true;
        })
        .map((character, index) => (
          <CharacterCard
            key={index}
            name={character.name}
            image={
              character.thumbnail.path + '.' + character.thumbnail.extension
            }
          />
        )),
    [characters, searchParams, searchTerm],
  );

  const fetchLikedCharacters = useCallback(async () => {
    setHasLoadedFilteredCharacters(true);
    const requestId = ++lastRequestIdRef.current;
    setIsLoading(true);

    const likedCharacters = Object.keys(likedCharactersObj);

    try {
      const characters = await Promise.all(likedCharacters.map(fetchCharacter));

      // Only update state if this is still the most recent request
      if (requestId === lastRequestIdRef.current) {
        setCharacters(characters);
        setResultsAmount(characters.length);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      // Only remove loading state if this is still the most recent request
      if (requestId === lastRequestIdRef.current) {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setResultsAmount]);

  const fetchCharacters = useCallback(async () => {
    setHasLoadedFilteredCharacters(false);
    const requestId = ++lastRequestIdRef.current;
    setIsLoading(true);

    const baseUrl = '/api/characters';
    const params = new URLSearchParams();

    if (searchTerm) {
      params.set('name', searchTerm);
    }

    try {
      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let data = await response.json();

      if (searchTerm === '') {
        data = data.slice(0, 50);
      }

      // Only update state if this is still the most recent request
      if (requestId === lastRequestIdRef.current) {
        setCharacters(data);
        setResultsAmount(data.length);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      // Only remove loading state if this is still the most recent request
      if (requestId === lastRequestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [searchTerm, setResultsAmount]);

  useEffect(() => {
    if (searchParams.get('filter') === 'liked' && hasLoadedFilteredCharacters)
      return;

    if (searchParams.get('filter') === 'liked') fetchLikedCharacters();
    else fetchCharacters();
  }, [
    fetchCharacters,
    fetchLikedCharacters,
    hasLoadedFilteredCharacters,
    searchParams,
    searchTerm,
    setResultsAmount,
  ]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        {`ERROR: ${error.toUpperCase()}`}
      </div>
    );
  }

  return (
    <section
      aria-label="Character grid"
      className={styles.charactersGridContainer}
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      ) : (
        characterCards
      )}
    </section>
  );
};

export default CharactersGrid;
