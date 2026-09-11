'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

/*
  voltiva-bar.md §3 — this frame straddles the dark/light seam, which is what
  stops the section boundary reading as a plain horizontal line.

  The play button loads and plays a real clip. In the reference template the
  same button sits on a static thumbnail and does nothing, which is precisely
  the "control that leads nowhere" fault; the clip is only fetched on press
  (`preload="none"`), so nobody pays for it who does not want it.
*/
export default function VideoBand() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <Image
        src="/demo/voltiva/video-still.webp"
        alt="A Voltiva engineer working at height on a transmission tower at dusk"
        fill
        sizes="(max-width: 1024px) 100vw, 1000px"
        className={`object-cover transition-opacity duration-500 ${
          playing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <video
        ref={ref}
        src="/demo/voltiva/tower.mp4"
        playsInline
        muted
        loop
        preload="none"
        aria-label="Voltiva engineers working on a transmission tower"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {!playing && (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            ref.current?.play().catch(() => setPlaying(false));
          }}
          aria-label="Play the film"
          className="absolute inset-0 flex items-center justify-center bg-[#0B1D33]/25 transition-colors hover:bg-[#0B1D33]/15 focus-visible:[outline:3px_solid_#1677FF] focus-visible:outline-offset-4"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgba(11,29,51,0.10)] transition-transform duration-500 hover:scale-105">
            <Play
              className="ml-1 h-7 w-7 text-[#1677FF]"
              fill="currentColor"
              aria-hidden="true"
            />
          </span>
        </button>
      )}
    </div>
  );
}
