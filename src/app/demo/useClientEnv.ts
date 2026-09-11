'use client';

import { useCallback, useSyncExternalStore } from 'react';

/*
  Two things the demo sites need that only exist in the browser: "have we
  hydrated yet" and "does this media query match".

  Both are read through `useSyncExternalStore` rather than `useState` +
  `useEffect(setState)`. That pattern is what `react-hooks/set-state-in-effect`
  exists to prevent — it renders once with the wrong value, then again with the
  right one — and it is the same approach the WebMinor homepage already uses to
  wait for `document.body`.
*/

const noopSubscribe = () => () => {};

/** False during the server render and the hydration pass, true afterwards. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/** Live media-query result. False on the server, and updates on change. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
