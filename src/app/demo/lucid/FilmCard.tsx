'use client';

import { useRef, useState } from 'react';
import s from './lucid.module.css';

/**
 * The film card.
 *
 * The clip plays inside the card rather than opening a modal: the brief asked
 * for this homepage only, and a lightbox would be a second screen. The poster
 * is frame zero of this same clip, so there is nothing to jump between when
 * the video takes over.
 */
export default function FilmCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <button
      type="button"
      className={s.videoCard}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Pause the Lucid film' : 'Play the Lucid film'}
    >
      <span className={s.videoThumb}>
        <video
          ref={videoRef}
          src="/demo/lucid/film-one.mp4"
          poster="/demo/lucid/film-one-poster.webp"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        {!playing && (
          <span className={s.videoPlay} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        )}
      </span>
      <span className={s.videoLabel}>
        <b>{playing ? 'Playing' : 'Watch the film'}</b>
        Lucid One · 5 seconds
      </span>
    </button>
  );
}
