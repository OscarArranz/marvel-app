import { createHash } from 'crypto';
import { MARVEL_API_KEY, MARVEL_PUBLIC_KEY } from '../constants';

const getMarvelApiMd5Hash = (ts: number) => {
  const stringToHash = `${ts}${MARVEL_API_KEY}${MARVEL_PUBLIC_KEY}`;
  const hash = createHash('md5').update(stringToHash).digest('hex');

  return hash;
};

export default getMarvelApiMd5Hash;
