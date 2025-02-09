import { SearchProvider } from '../context/SearchContext';
import CharactersGrid from './components/CharactersGrid';
import CharactersSearchBox from './components/CharactersSearchBox';
import styles from './page.module.css';

const Home = () => {
  return (
    <main className={styles.pageContainer}>
      <SearchProvider>
        <CharactersSearchBox />
        <CharactersGrid />
      </SearchProvider>
    </main>
  );
};

export default Home;
