'use client';

import { useSearchParams } from 'next/navigation';
import SearchBox from '../../../components/ui/SearchBox';
import { useSearch } from '../../../context/SearchContext';
import styles from './CharactersSearchBox.module.css';

const CharactersSearchBox = () => {
  const { setSearchTerm, resultsAmount } = useSearch();
  const params = useSearchParams();

  return (
    <>
      <h2
        className={styles.favoritesTitle}
        style={{
          opacity: params.get('filter') === 'liked' ? 1 : 0,
        }}
      >
        FAVORITES
      </h2>
      <div
        className={styles.spacer}
        style={{
          height: params.get('filter') === 'liked' ? '24px' : '0px',
          marginTop: params.get('filter') === 'liked' ? '0px' : '-24px',
        }}
      />

      <SearchBox
        placeholder="Search a character..."
        resultsAmount={resultsAmount || 0}
        onSearch={setSearchTerm}
      />
    </>
  );
};

export default CharactersSearchBox;
