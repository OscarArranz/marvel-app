'use client';

import styles from './CharactersGrid.module.css';
import CharacterCard from './components/CharacterCard';
import { useSearch } from '../../../context/SearchContext';
import { useLocalStorage } from '../../../hooks';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../utils/constants';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
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
  const [isLoading, startLoading] = useTransition();
  const { searchTerm, setResultsAmount } = useSearch();
  const searchParams = useSearchParams();
  const [likedCharactersObj] = useLocalStorage(
    LIKED_CHARACTERS_STORAGE_KEY,
    {},
  );

  const [characters, setCharacters] = useState<any[]>([]);
  const [hasLoadedFilteredCharacters, setHasLoadedFilteredCharacters] =
    useState(false);

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

    startLoading(async () => {
      const likedCharacters = Object.keys(likedCharactersObj);

      try {
        let characters = await Promise.all(likedCharacters.map(fetchCharacter));

        startLoading(async () => {
          setCharacters(characters);
          setResultsAmount(characters.length);
        });
      } catch (error) {
        console.error('Error fetching liked characters:', error);
      }
    });
  }, [likedCharactersObj]);

  const fetchCharacters = useCallback(async () => {
    setHasLoadedFilteredCharacters(false);

    startLoading(async () => {
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

        startLoading(async () => {
          setCharacters(data);
          setResultsAmount(data.length);
        });
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    });
  }, [searchTerm]);

  useEffect(() => {
    if (searchParams.get('filter') === 'liked' && hasLoadedFilteredCharacters)
      return;

    if (searchParams.get('filter') === 'liked') fetchLikedCharacters();
    else fetchCharacters();
  }, [searchTerm, searchParams.get('filter')]);

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
