// pages/_app.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from './components/Loading';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Define routes where loading should be disabled
  const isLoadingDisabledRoute = (url) => {
    // Dynamically disable loading for module/[id]
    return url.startsWith('/module/');
  };

  useEffect(() => {
    const handleStart = (url) => {
      if (!isLoadingDisabledRoute(url) && url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

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
