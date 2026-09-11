import { permanentRedirect } from 'next/navigation';

/**
 * /launch was the preview for the scroll-scrubbed film hero. That direction was
 * superseded by the diorama scroll-world homepage, and this route was left
 * unlinked, noindex and out of the sitemap.
 *
 * It redirects rather than 404s so any shared link still lands. The film hero
 * components under src/components/launch/ are retained — LaunchHero is a
 * substantial piece of work and may be reused.
 */
export default function LaunchRedirect(): never {
  permanentRedirect('/');
}
