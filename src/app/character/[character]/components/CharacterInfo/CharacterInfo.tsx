import Image from 'next/image';
import { getCharacter } from '../../../../../utils/server/characters';
import styles from './CharacterInfo.module.css';
import LikeButton from '../../../../../components/ui/LikeButton';
import CharacterComics from './CharacterComics';

interface CharacterInfoProps {
  character: string;
}

/**
 * A component that displays the information of a character
 *
 * @param {CharacterInfoProps} props - The component props
 * @param {string} props.character - The character name
 * @returns {JSX.Element} The CharacterInfo component
 */
const CharacterInfo = async ({ character }: CharacterInfoProps) => {
  const characterData = await getCharacter(character);

  return (
    <>
      <article
        aria-label="Character info"
        className={styles.characterInfoContainer}
      >
        <div className={styles.characterImageContainer}>
          <Image
            src={
              characterData.thumbnail.path +
              '.' +
              characterData.thumbnail.extension
            }
            alt={`${characterData.name} image`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 278px, 320px"
            priority
          />
        </div>
        <section
          className={styles.characterTextInfoContainer}
          aria-label="Character text info"
        >
          <div className={styles.nameAndLikeButtonContainer}>
            <h1 aria-label="Character name">
              {characterData.name.toUpperCase()}
            </h1>
            <LikeButton
              name={characterData.name}
              likedIconClassName={styles.likedIcon}
            />
          </div>
          <p aria-label="Character description">
            {characterData.description || 'No description available'}
          </p>
        </section>
      </article>
      <CharacterComics characterId={characterData.id} />
    </>
  );
};

export default CharacterInfo;
