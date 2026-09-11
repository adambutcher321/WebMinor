'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { isIntroDone, onIntroDone } from './intro';
import styles from './motion.module.css';

/**
 * The hero's one entrance: copy arrives out of focus and resolves once (M7), timed to
 * the wipe rather than to page load.
 *
 * On a return visit or under reduced motion there is no wipe, so the signal has already
 * fired and this resolves immediately — the visitor gets the finished page.
 */
export default function IntroReveal({
  children,
  className = '',
  stagger = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (isIntroDone()) {
      setShown(true);
      return;
    }
    return onIntroDone(() => setShown(true));
  }, []);

  // The classes are applied unconditionally, including on the server. Gating them on a
  // reduced-motion value read after mount would paint the copy sharp and then hide it.
  // The stylesheet's reduced-motion rule resolves it instantly instead, before any JS.
  const cls = [
    className,
    styles.introReveal,
    styles.reveal,
    styles.blurred,
    stagger ? styles.staggered : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <noscript>
        <style>{`.${styles.reveal}{opacity:1!important;transform:none!important;filter:none!important}`}</style>
      </noscript>
      <div className={cls} data-shown={shown ? 'true' : 'false'}>
        {children}
      </div>
    </>
  );
}
