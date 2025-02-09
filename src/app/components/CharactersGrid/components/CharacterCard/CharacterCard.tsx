'use client';

import Image from 'next/image';
import styles from './CharacterCard.module.css';
import {
  HeartIcon,
  HeartOutlinedIcon,
} from '../../../../../components/ui/icons';
import { useLocalStorage } from '../../../../../hooks';
import { useEffect, useMemo, useState } from 'react';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../../../utils/constants';

interface CharacterCardProps {
  name: string;
  image: string;
}

/**
 * CharacterCard component
 *
 * @param {string} name - The name of the character
 * @param {string} image - The image URL of the character
 * @param {boolean} isLiked - Whether the character is liked
 * @returns {JSX.Element} The CharacterCard component
 */
const CharacterCard = ({ name, image }: CharacterCardProps) => {
  const [isClient, setIsClient] = useState(false);

  const [likedCharacters, setLikedCharacters] = useLocalStorage<any>(
    LIKED_CHARACTERS_STORAGE_KEY,
    {},
  );

  const isLiked = useMemo(
    () => name in likedCharacters,
    [likedCharacters, name],
  );

  // This is a workaround to prevent a hydration error.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLikeClick = () => {
    if (name in likedCharacters) {
      const newLikedCharacters = { ...likedCharacters };
      delete newLikedCharacters[name];
      setLikedCharacters(newLikedCharacters);
    } else {
      setLikedCharacters({ ...likedCharacters, [name]: true });
    }
  };

  return (
    <article
      aria-label={`${name} character card`}
      className={styles.characterCard}
    >
      <div className={styles.characterImageContainer}>
        <Image
          alt={name}
          src={image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={styles.characterImage}
        />
      </div>
      <section className={styles.characterInfoContainer}>
        <h3 className={styles.characterName}>{name.toUpperCase()}</h3>
        <button
          aria-label={`${isClient && isLiked ? 'Unlike' : 'Like'} ${name}`}
          className={styles.likeIconContainer}
          onClick={handleLikeClick}
        >
          {isClient && isLiked ? (
            <HeartIcon className={styles.likedIcon} />
          ) : (
            <HeartOutlinedIcon />
          )}
        </button>
      </section>
    </article>
  );
};

export default CharacterCard;
