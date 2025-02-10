import CharacterInfo from './components/CharacterInfo';
import styles from './page.module.css';
const CharacterPage = async ({
  params,
}: {
  params: Promise<{ character: string }>;
}) => {
  const { character } = await params;

  return (
    <>
      <section className={styles.characterPageContainer}>
        <CharacterInfo character={character} />
      </section>
    </>
  );
};

export default CharacterPage;
