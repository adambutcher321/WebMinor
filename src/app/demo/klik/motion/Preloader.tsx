'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styles from './preloader.module.css';

const WORDS = ['SEND', 'SPLIT', 'TAP', 'SPEND'];
/** Each word holds this long before the next replaces it. */
const WORD_MS = 260;
const SEEN_KEY = 'klik-intro-seen';

type Phase = 'idle' | 'words' | 'line1' | 'line2' | 'out' | 'done';

/**
 * The opening sequence: KLIK, then SEND / SPLIT / TAP / SPEND cutting fast, then
 * MONEY MOVES. and SO SHOULD YOU., then a wipe into the page.
 *
 * The word cuts are deliberately *faster* than the bar's 900ms floor. M5 governs moves
 * within the page; this is a title sequence, where fast cuts are the point — the whole
 * sequence, start to hand-off, is one move and it lasts about 2.6s.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [wordIndex, setWordIndex] = useState(0);
  const timers = useRef<number[]>([]);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    document.documentElement.style.overflow = '';
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable — the sequence simply plays again next navigation */
    }
    setPhase('done');
    onDone?.();
  }, [onDone]);

  /*
   * Decide and schedule in one effect that runs exactly once.
   *
   * Keying this on `phase` cancels the sequence: React runs the previous effect's
   * cleanup on every phase change, clearing the very timers that drive the rest of the
   * timeline, so the intro freezes on its second frame. A re-entry guard does not help
   * — the cleanup has already fired by then. Empty deps, cleanup only on unmount.
   */
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      seen = true;
    }
    if (reduced || seen) {
      setPhase('done');
      onDoneRef.current?.();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    setPhase('words');

    const at = (ms: number, fn: () => void) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    WORDS.forEach((_, i) => at(i * WORD_MS, () => setWordIndex(i)));
    const wordsEnd = WORDS.length * WORD_MS;
    at(wordsEnd, () => setPhase('line1'));
    at(wordsEnd + 620, () => setPhase('line2'));
    at(wordsEnd + 1500, () => setPhase('out'));
    at(wordsEnd + 2260, () => finishRef.current());

    const pending = timers.current;
    return () => {
      for (const t of pending) window.clearTimeout(t);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === 'done') return null;

  return (
    <div className={styles.overlay} data-phase={phase} aria-hidden="true">
      <noscript>
        <style>{`.${styles.overlay}{display:none!important}`}</style>
      </noscript>

      <div className={styles.stage}>
        <p className={styles.mark}>KLIK</p>

        <div className={styles.wordSlot}>
          {WORDS.map((w, i) => (
            <span key={w} className={styles.word} data-on={phase === 'words' && wordIndex === i}>
              {w}
            </span>
          ))}
        </div>

        <div className={styles.lines}>
          <span className={styles.line} data-on={phase === 'line1' || phase === 'line2' || phase === 'out'}>
            MONEY MOVES.
          </span>
          <span className={styles.line} data-on={phase === 'line2' || phase === 'out'}>
            SO SHOULD YOU.
          </span>
        </div>
      </div>

      {/* The hand-off: the ground splits and slides away rather than fading. */}
      <div className={`${styles.shutter} ${styles.shutterTop}`} />
      <div className={`${styles.shutter} ${styles.shutterBottom}`} />
    </div>
  );
}
