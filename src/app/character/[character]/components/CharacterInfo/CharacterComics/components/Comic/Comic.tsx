import Image from 'next/image';
import styles from './Comic.module.css';

interface ComicProps {
  comic: any;
}

const Comic = ({ comic }: ComicProps) => {
  return (
    <li aria-label={`Comic ${comic.title}`} className={styles.comic}>
      <div className={styles.comicInsideContainer}>
        <Image
          src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
          alt={comic.title}
          width={164}
          height={318}
        />
        <section className={styles.comicInfo}>
          <h4>{comic.title}</h4>
          <h5>{comic.dates[0].date.split('-')[0]}</h5>
        </section>
      </div>
    </li>
  );
};

export default Comic;
