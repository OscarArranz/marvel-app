'use client';

import Link from '../../../../navigation/Link';
import styles from './LikedCharactersButton.module.css';
import HeartIcon from '../../../../../../public/heart-icon.svg';
import Image from 'next/image';

/**
 * A component that displays a button with a counter of liked characters.
 *
 * Clicking on the button will filter the characters by liked.
 *
 * @returns A React component that displays a button with a counter of liked characters.
 */
const LikedCharactersButton = () => {
  // TODO: Get the number of liked characters from the database
  const likedCharactersCount = 0;

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
      <span aria-label="Liked characters counter">{likedCharactersCount}</span>
    </Link>
  );
};

export default LikedCharactersButton;
