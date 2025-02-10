import { NextResponse } from 'next/server';
import {
  MARVEL_API_BASE_URL,
  MARVEL_PUBLIC_KEY,
} from '../../../utils/constants';
import getMarvelApiMd5Hash from '../../../utils/server';

type CharacterCache = {
  data: any;
  time: Date | null;
};

const CHARACTER_LIMIT = 50;

const characterCache: CharacterCache = {
  data: null,
  time: null,
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (
    !name &&
    characterCache.data &&
    characterCache.time &&
    new Date().getTime() - characterCache.time.getTime() < 5 * 60 * 1000
  ) {
    return NextResponse.json(characterCache.data);
  }

  const ts = Date.now();
  const hash = getMarvelApiMd5Hash(ts);

  const response = await fetch(
    `${MARVEL_API_BASE_URL}/characters?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}&limit=${CHARACTER_LIMIT}${
      name ? `&nameStartsWith=${name}` : ''
    }`,
  );

  const { data } = await response.json();

  if (name) {
    return NextResponse.json(data.results);
  }

  characterCache.data = data.results;
  characterCache.time = new Date();

  return NextResponse.json(data.results);
};
