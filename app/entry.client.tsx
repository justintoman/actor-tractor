// entry.client.tsx
import type {ReactNode} from 'react';
import {StrictMode} from 'react';
import {useState} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {CacheProvider} from '@emotion/react';
import {RemixBrowser} from '@remix-run/react';

import {ClientStyleContext} from './theme/context';
import createEmotionCache from './theme/createEmotionCache';

interface ClientCacheProviderProps {
  children: ReactNode;
}

function ClientCacheProvider({children}: ClientCacheProviderProps) {
  const [cache, setCache] = useState(createEmotionCache());

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{reset}}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

hydrateRoot(
  document,
  <ClientCacheProvider>
    <RemixBrowser />
  </ClientCacheProvider>
);
