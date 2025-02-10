'use client';

import styles from './ComicsList.module.css';
import Comic from '../Comic/Comic';
import HorizontalScrollbar from '../../../../../../../../components/ui/HorizontalScrollbar';

interface ComicsListProps {
  comics: any[];
}

const ComicsList = ({ comics }: ComicsListProps) => {
  return (
    <HorizontalScrollbar>
      <ul aria-label="Character comics list" className={styles.comicsList}>
        {comics.map((comic: any) => (
          <Comic key={comic.id} comic={comic} />
        ))}
      </ul>
    </HorizontalScrollbar>
  );
};

export default ComicsList;
