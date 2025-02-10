'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '../../../hooks';
import { LIKED_CHARACTERS_STORAGE_KEY } from '../../../utils/constants';
import { HeartIcon, HeartOutlinedIcon } from '../icons';

interface LikeButtonProps {
  name: string;
  likedIconClassName?: string;
}

const LikeButton = ({ name, likedIconClassName }: LikeButtonProps) => {
  const [isClient, setIsClient] = useState(false);
  const [likedCharacters, setLikedCharacters] = useLocalStorage<any>(
    LIKED_CHARACTERS_STORAGE_KEY,
    {},
  );

  const isLiked = useMemo(
    () => name in likedCharacters,
    [likedCharacters, name],
  );

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (name in likedCharacters) {
      const newLikedCharacters = { ...likedCharacters };
      delete newLikedCharacters[name];
      setLikedCharacters(newLikedCharacters);
    } else {
      setLikedCharacters({ ...likedCharacters, [name]: true });
    }
  };

  // This is a workaround to prevent a hydration error.
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <button
      aria-label={`${isClient && isLiked ? 'Unlike' : 'Like'} ${name}`}
      onClick={handleLikeClick}
    >
      {isClient && isLiked ? (
        <HeartIcon className={likedIconClassName} />
      ) : (
        <HeartOutlinedIcon />
      )}
    </button>
  );
};

export default LikeButton;
