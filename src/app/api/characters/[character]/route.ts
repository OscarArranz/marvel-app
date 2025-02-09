import { NextResponse } from 'next/server';
import {
  MARVEL_API_BASE_URL,
  MARVEL_PUBLIC_KEY,
} from '../../../../utils/constants';
import getMarvelApiMd5Hash from '../../../../utils/server';

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ character: string }> },
) => {
  const name = (await params).character;
  const ts = Date.now();
  const hash = getMarvelApiMd5Hash(ts);

  const response = await fetch(
    `${MARVEL_API_BASE_URL}/characters?ts=${ts}&apikey=${MARVEL_PUBLIC_KEY}&hash=${hash}${`&name=${name}`}`,
  );

  const { data } = await response.json();

  if (data.results.length === 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return NextResponse.json(data.results[0]);
};
