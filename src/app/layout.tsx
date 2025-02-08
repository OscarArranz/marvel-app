import type { Metadata } from 'next';
import Navbar from '../components/ui/Navbar';
import { Roboto_Condensed } from 'next/font/google';
import './globals.css';
import RouteChangeHandler from '../components/navigation/RouteChangeHandler';

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Marvel App',
  description: 'Marvel App to search for your favorite Marvel characters',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={robotoCondensed.className}>
        <Navbar />
        {children}
        <RouteChangeHandler />
      </body>
    </html>
  );
}
