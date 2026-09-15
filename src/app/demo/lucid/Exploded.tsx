'use client';

import { useEffect, useRef, useState } from 'react';
import s from './exploded.module.css';

/**
 * The teardown.
 *
 * A pinned section whose video time is a pure function of scroll position, so
 * the headset comes apart as you scroll and goes back together as you scroll
 * up. The clip is encoded with every frame as a keyframe — without that,
 * seeking snaps to the nearest I-frame and the sequence stutters instead of
 * scrubbing.
 *
 * Under reduced motion the video is never scrubbed: the section shows the last
 * frame, fully exploded, which is the informative state.
 */
/*
 * Twelve parts, in the order they leave the assembly. The `at` values are
 * read off the clip itself — the moment each part visibly clears its
 * neighbour — so the index lights in step with what is on screen rather than
 * on an even grid.
 */
const STAGES = [
  { at: 0.12, n: '01', k: 'Front glass', v: 'One laminated sheet, curved, edge to edge' },
  { at: 0.28, n: '02', k: 'Frame ring', v: 'Machined aluminium, one piece, 61 g' },
  { at: 0.36, n: '03', k: 'Sensor bar', v: 'Six cameras, one depth unit, one bar' },
  { at: 0.44, n: '04', k: 'Optic modules', v: 'Two pancake stacks, individually aligned' },
  { at: 0.50, n: '05', k: 'Display panels', v: 'Two micro-OLED, 4,000 nits' },
  { at: 0.55, n: '06', k: 'Logic board', v: 'One board, passively cooled' },
  { at: 0.60, n: '07', k: 'Cell', v: 'Flat pack, 22 Wh, swappable' },
  { at: 0.65, n: '08', k: 'Drivers', v: 'Two, ported, aimed at the ear' },
  { at: 0.70, n: '09', k: 'Fan', v: 'One blower, 19 dB, rarely needed' },
  { at: 0.76, n: '10', k: 'Light seal', v: 'Knitted, magnetic, four sizes' },
  { at: 0.84, n: '11', k: 'Fasteners', v: '38 screws, one driver bit' },
  { at: 0.92, n: '12', k: 'Halo band', v: 'Knitted, breathable, swappable' },
];

export default function Exploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const show = () => {
        video.currentTime = Math.max(0, video.duration - 0.05);
        setProgress(1);
      };
      if (video.readyState >= 1) show();
      else video.addEventListener('loadedmetadata', show, { once: true });
      return;
    }

    let raf = 0;
    let target = 0;

    const onScroll = () => {
      const r = section.getBoundingClientRect();
      // The section is taller than the viewport; the sticky stage is pinned for
      // the overflow, and that overflow is the scrub track.
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return;
      target = Math.max(0, Math.min(1, -r.top / travel));
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const seekTo = () => {
      if (video.readyState < 1 || !Number.isFinite(video.duration)) return;
      const t = target * (video.duration - 0.05);
      // Seeking on every frame of a fast scroll queues work the decoder
      // cannot finish; only ask for a new frame once the last one landed.
      if (!video.seeking && Math.abs(video.currentTime - t) > 1 / 60) {
        video.currentTime = t;
      }
    };

    const apply = () => {
      raf = 0;
      setProgress(target);
      seekTo();
    };

    // A target that arrived while the decoder was busy was dropped, and if
    // it was the last scroll event the film sat one frame short of where the
    // page was. Once the seek lands, ask again for wherever the page is now.
    const onSeeked = () => seekTo();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={s.section} ref={sectionRef} id="teardown">
      <div className={s.sticky}>
        <div className={s.inner}>
          {/* The film owns the whole pinned height. The heading floats over
              its empty top-left corner and the index sits beside it, so
              nothing above or below the stage takes height from the product. */}
          <div className={s.stage}>
            <video
              ref={videoRef}
              className={s.film}
              src="/demo/lucid/teardown.mp4"
              poster="/demo/lucid/teardown-poster.webp"
              muted
              playsInline
              preload="auto"
              aria-label="The Lucid One headset separating into its component parts"
            />

            <div className={s.head}>
              <p className={s.eyebrow}>The teardown</p>
              <h2 className={s.title}>
                Nothing in here is hidden from you.
              </h2>
              <p className={s.lede}>
                Twelve parts, every one serviceable, every one named. Keep
                scrolling and it comes apart.
              </p>
            </div>
          </div>

          <aside className={s.index}>
            <ol className={s.parts}>
              {STAGES.map((stage) => {
                const on = progress >= stage.at;
                return (
                  <li key={stage.n} className={`${s.part} ${on ? s.partOn : ''}`}>
                    <span className={s.partNo}>{stage.n}</span>
                    <span className={s.partKey}>{stage.k}</span>
                    <span className={s.partVal}>{stage.v}</span>
                  </li>
                );
              })}
            </ol>

            <div className={s.track} aria-hidden="true">
              <span className={s.trackFill} style={{ transform: `scaleX(${progress})` }} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
