import Image from 'next/image';
import styles from './Navbar.module.css';
import MarvelLogo from '../../../../public/marvel-logo.svg';
import LikedCharactersButton from './components/LikedCharactersButton';
import Link from '../../navigation/Link';
import ProgressBar from './components/ProgressBar';

/**
 * A component that displays a navbar with a logo and a liked characters button.
 *
 * The navbar also displays a progress bar that animates when the page is loading.
 *
 * @returns A React component that displays a navbar.
 */
const Navbar = () => {
  return (
    <>
      <nav className={styles.navbar}>
        <Link href="/" aria-label="Home link">
          <Image
            src={MarvelLogo}
            alt="Logo"
            width={130}
            height={52}
            priority
            placeholder="empty"
            unoptimized
          />
        </Link>
        <LikedCharactersButton />
      </nav>
      <ProgressBar />
    </>
  );
};

export default Navbar;
