// pages/_app.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from './components/Loading';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        setLoading(true);
      }
    };
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Clean up event handlers on unmount
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <Loading />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
