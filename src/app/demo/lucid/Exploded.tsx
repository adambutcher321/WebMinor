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
const STAGES = [
  { at: 0.10, n: '01', k: 'Outer shell', v: 'Smoked polycarbonate, 1.1 mm' },
  { at: 0.22, n: '02', k: 'Optic barrels', v: 'Four elements, individually aligned' },
  { at: 0.34, n: '03', k: 'Display panels', v: 'Two micro-OLED, 4,000 nits' },
  { at: 0.46, n: '04', k: 'Sensor array', v: 'Twelve cameras, one depth unit' },
  { at: 0.58, n: '05', k: 'Logic boards', v: 'Three, stacked, passively cooled' },
  { at: 0.70, n: '06', k: 'Drivers', v: 'Two, ported, aimed at the ear' },
  { at: 0.82, n: '07', k: 'Fasteners', v: '61 screws, one driver bit' },
  { at: 0.92, n: '08', k: 'Exoframe', v: 'Machined titanium, 61 g' },
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

    const apply = () => {
      raf = 0;
      setProgress(target);
      if (video.readyState >= 1 && Number.isFinite(video.duration)) {
        const t = target * (video.duration - 0.05);
        // Seeking on every frame of a fast scroll queues work the decoder
        // cannot finish; only ask for a new frame once the last one landed.
        if (!video.seeking) video.currentTime = t;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={s.section} ref={sectionRef} id="teardown">
      <div className={s.sticky}>
        <div className={s.inner}>
          <div className={s.head}>
            <p className={s.eyebrow}>The teardown</p>
            <h2 className={s.title}>
              Nothing in here is hidden from you.
            </h2>
            <p className={s.lede}>
              Every part is serviceable, and every part is named. Keep scrolling
              and it comes apart.
            </p>
          </div>

          <div className={s.stage}>
            <video
              ref={videoRef}
              className={s.film}
              src="/demo/lucid/explode.mp4"
              poster="/demo/lucid/explode-poster.webp"
              muted
              playsInline
              preload="auto"
              aria-label="The Lucid One headset separating into its component parts"
            />
          </div>

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
        </div>
      </div>
    </section>
  );
}
