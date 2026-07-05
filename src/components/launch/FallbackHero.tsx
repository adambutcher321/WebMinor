import Image from 'next/image';
import CopyOverlay from './CopyOverlay';

interface FallbackHeroProps {
  imageSrc: string;
}

export default function FallbackHero({ imageSrc }: FallbackHeroProps) {
  return (
    <section
      data-testid="fallback-hero"
      className="relative h-[100svh] w-full overflow-hidden bg-[#0B0D10]"
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B0D10]" />
      <CopyOverlay className="absolute inset-0" />
    </section>
  );
}
