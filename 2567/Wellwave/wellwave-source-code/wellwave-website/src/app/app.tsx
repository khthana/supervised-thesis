import Navbar from './components/Navbar';
import '../styles/globals.css'; // สำหรับ CSS ทั่วไป (ถ้ามี)

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
