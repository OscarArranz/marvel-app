import { NextResponse } from 'next/server';
import {
  MARVEL_API_BASE_URL,
  MARVEL_PUBLIC_KEY,
} from '../../../utils/constants';
import getMarvelApiMd5Hash from '../../../utils/server';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const ts = Date.now();
  const hash = getMarvelApiMd5Hash(ts);

  const response = await fetch(
    `${MARVEL_API_BASE_URL}/characters?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}&limit=50${
      name ? `&nameStartsWith=${name}` : ''
    }`,
  );

  const { data } = await response.json();
  return NextResponse.json(data.results);
};
