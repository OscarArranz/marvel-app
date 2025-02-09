'use client';

import Link from '../../../../navigation/Link';
import styles from './LikedCharactersButton.module.css';
import HeartIcon from '../../../../../../public/heart-icon.svg';
import Image from 'next/image';
import { useLocalStorage } from '../../../../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../../../utils/constants';

/**
 * A component that displays a button with a counter of liked characters.
 *
 * Clicking on the button will filter the characters by liked.
 *
 * @returns A React component that displays a button with a counter of liked characters.
 */
const LikedCharactersButton = () => {
  const [likedCharacters] = useLocalStorage<any>(
    LIKED_CHARACTERS_STORAGE_KEY,
    {},
  );
  const [isClient, setIsClient] = useState(false);

  // This is a workaround to prevent a hydration error.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const likedCharactersCount = useMemo(
    () => Object.keys(likedCharacters).length,
    [likedCharacters],
  );

  return (
    <Link
      href="/?filter=liked"
      className={styles.likedCharactersButton}
      aria-label="Liked characters button counter"
    >
      <Image
        src={HeartIcon}
        alt="Heart icon"
        width={24}
        height={24}
        unoptimized
      />
      <span aria-label="Liked characters counter">
        {isClient ? likedCharactersCount : 0}
      </span>
    </Link>
  );
};

export default LikedCharactersButton;
