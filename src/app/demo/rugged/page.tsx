import { permanentRedirect } from 'next/navigation';

/**
 * The Rugged concept demo has been superseded by ALTRIX, which covers the same
 * territory — a premium titanium watch product page — with full brand identity,
 * generated product photography and a documented design system.
 *
 * This redirects rather than 404s so any shared link still lands somewhere.
 * The old implementation and its artwork are in git history; only the redirect
 * and its layout remain.
 */
export default function RuggedRedirect(): never {
  permanentRedirect('/demo/altrix');
}
