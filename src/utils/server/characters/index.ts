import getMarvelApiMd5Hash from '..';
import { MARVEL_API_BASE_URL, MARVEL_PUBLIC_KEY } from '../../constants';

export const getCharacter = async (character: string) => {
  const ts = Date.now();
  const hash = getMarvelApiMd5Hash(ts);

  const response = await fetch(
    `${MARVEL_API_BASE_URL}/characters?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}${`&name=${character}`}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }

  const { data } = await response.json();

  if (data.results.length === 0) {
    throw new Error('Character not found');
  }

  return data.results[0];
};

export const getCharacterComics = async (characterId: string) => {
  const ts = Date.now();
  const hash = getMarvelApiMd5Hash(ts);

  const response = await fetch(
    `${MARVEL_API_BASE_URL}/comics?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}&characters=${characterId}`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch character comics');
  }

  const { data } = await response.json();

  return data.results;
};
