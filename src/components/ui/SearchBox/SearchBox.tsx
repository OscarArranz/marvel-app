import styles from './SearchBox.module.css';
import SearchIcon from '../../../../public/search-icon.svg';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../../../hooks';

interface SearchBoxProps {
  placeholder: string;
  resultsAmount?: number;
  onSearch: (value: string) => void;
}

const DEBOUNCE_DELAY = 300;

const SearchBox = ({
  placeholder,
  resultsAmount,
  onSearch,
}: SearchBoxProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isClient, setIsClient] = useState(false);

  const debouncedOnSearch = useDebounce(onSearch, DEBOUNCE_DELAY);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value.toUpperCase());
      debouncedOnSearch(value.toUpperCase());
    },
    [debouncedOnSearch],
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section role="search" className={styles.searchBoxContainer}>
      <div className={styles.inputContainer}>
        <Image
          src={SearchIcon}
          alt="Search icon"
          width={12}
          height={12}
          unoptimized
          className={styles.searchIcon}
        />
        <input
          className={styles.input}
          type="text"
          placeholder={placeholder.toUpperCase()}
          onChange={e => handleSearch(e.target.value)}
          value={searchValue.toUpperCase()}
        />
      </div>
      {isClient && resultsAmount && (
        <p
          aria-label="Search results amount"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          {resultsAmount}{' '}
          {resultsAmount < 1 || resultsAmount > 1 ? 'RESULTS' : 'RESULT'}
        </p>
      )}
    </section>
  );
};

export default SearchBox;
