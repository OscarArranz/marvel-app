import Image from 'next/image';
import styles from './CharacterCard.module.css';
import Link from '../../../../../components/navigation/Link';
import LikeButton from '../../../../../components/ui/LikeButton';

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
  return (
    <Link href={`/character/${name}`} className={styles.characterCard}>
      <article aria-label={`${name} character card`}>
        <div className={styles.characterImageContainer}>
          <Image
            alt={`${name} image`}
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className={styles.characterImage}
          />
        </div>
        <section className={styles.characterInfoContainer}>
          <h3 className={styles.characterName}>{name.toUpperCase()}</h3>
          <LikeButton name={name} likedIconClassName={styles.likedIcon} />
        </section>
      </article>
    </Link>
  );
};

export default CharacterCard;
