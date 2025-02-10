import { Suspense } from 'react';
import { SearchProvider } from '../context/SearchContext';
import CharactersGrid from './components/CharactersGrid';
import CharactersSearchBox from './components/CharactersSearchBox';
import styles from './page.module.css';

const Home = () => {
  return (
    <main className={styles.pageContainer}>
      <SearchProvider>
        <Suspense fallback={null}>
          <CharactersSearchBox />
          <CharactersGrid />
        </Suspense>
      </SearchProvider>
    </main>
  );
};

export default Home;
