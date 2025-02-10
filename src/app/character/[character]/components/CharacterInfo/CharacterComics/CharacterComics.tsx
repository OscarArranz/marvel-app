import { getCharacterComics } from '../../../../../../utils/server/characters';
import styles from './CharacterComics.module.css';
import ComicsList from './components/ComicsList';

interface CharacterComicsProps {
  characterId: string;
}

const CharacterComics = async ({ characterId }: CharacterComicsProps) => {
  const comics = await getCharacterComics(characterId);

  return (
    <section
      aria-label="Character comics"
      className={styles.characterComicsContainer}
    >
      <h2>COMICS</h2>
      <ComicsList comics={comics} />
    </section>
  );
};

export default CharacterComics;
