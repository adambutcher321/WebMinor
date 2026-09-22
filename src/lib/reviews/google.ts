/*
  Live Google reviews for the WebMinor Business Profile, via Places API (New).

  The section this feeds renders nothing until the listing has enough real
  reviews, so every failure mode here — no env vars, API error, too few
  reviews — collapses to `null` rather than to placeholder content.
*/

export const MIN_REVIEWS = 3;

export interface GoogleReview {
  author: string;
  authorUrl: string | null;
  rating: number;
  text: string;
  when: string;
}

export interface GoogleReviewsData {
  rating: number;
  count: number;
  url: string;
  reviews: GoogleReview[];
}

type Json = Record<string, unknown>;

const isObject = (v: unknown): v is Json => typeof v === 'object' && v !== null;

function parseReview(raw: unknown): GoogleReview | null {
  if (!isObject(raw)) return null;
  const text = isObject(raw.text) && typeof raw.text.text === 'string' ? raw.text.text.trim() : '';
  const rating = typeof raw.rating === 'number' ? raw.rating : 0;
  const attribution = isObject(raw.authorAttribution) ? raw.authorAttribution : {};
  const author = typeof attribution.displayName === 'string' ? attribution.displayName : '';
  // Google's terms want reviews shown unedited, so a review is either shown
  // whole or not at all. Star-only reviews and anything under four stars stay
  // on Google, where they still count towards the average shown here.
  if (!text || !author || rating < 4) return null;
  return {
    author,
    authorUrl: typeof attribution.uri === 'string' ? attribution.uri : null,
    rating,
    text,
    when: typeof raw.relativePublishTimeDescription === 'string' ? raw.relativePublishTimeDescription : '',
  };
}

export function parsePlace(raw: unknown): GoogleReviewsData | null {
  if (!isObject(raw)) return null;
  const { rating, userRatingCount, googleMapsUri, reviews } = raw;
  if (typeof rating !== 'number' || typeof userRatingCount !== 'number') return null;
  if (typeof googleMapsUri !== 'string' || !Array.isArray(reviews)) return null;

  const usable = reviews.map(parseReview).filter((r): r is GoogleReview => r !== null);
  if (usable.length < MIN_REVIEWS) return null;

  return { rating, count: userRatingCount, url: googleMapsUri, reviews: usable };
}

// Layout preview for `next dev` only, switched on with GOOGLE_REVIEWS_PREVIEW=1.
// Never reachable in a production build: invented reviews must not ship.
const PREVIEW: GoogleReviewsData = {
  rating: 4.9,
  count: 14,
  url: 'https://www.google.com/maps',
  reviews: [
    { author: 'Sample Reviewer', authorUrl: null, rating: 5, when: '2 weeks ago', text: 'SAMPLE — layout preview only. A short review sits comfortably in the card and leaves room underneath.' },
    { author: 'Another Sample', authorUrl: null, rating: 5, when: 'a month ago', text: 'SAMPLE — layout preview only. A longer review runs to several sentences so the card has to cope with real length. People write a lot when they are pleased, and the card should clamp rather than stretch the whole row. This sentence is here to push it over the limit and prove the clamp holds on every width.' },
    { author: 'Third Sample', authorUrl: null, rating: 4, when: '2 months ago', text: 'SAMPLE — layout preview only. Medium length, four stars, to check partial star rows.' },
    { author: 'Fourth Sample', authorUrl: null, rating: 5, when: '3 months ago', text: 'SAMPLE — layout preview only. One more so the row scrolls.' },
    { author: 'Fifth Sample', authorUrl: null, rating: 5, when: '4 months ago', text: 'SAMPLE — layout preview only. Places API returns five at most.' },
  ],
};

export interface GoogleProfileLinks {
  maps: string;
  writeReview: string;
}

// Both links come from the Place ID alone, so they go live the moment
// GOOGLE_PLACE_ID is set, before the listing has a single review.
export function getGoogleProfileLinks(): GoogleProfileLinks | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) {
    return process.env.NODE_ENV !== 'production' && process.env.GOOGLE_REVIEWS_PREVIEW === '1'
      ? { maps: 'https://www.google.com/maps', writeReview: 'https://www.google.com/maps' }
      : null;
  }
  const id = encodeURIComponent(placeId);
  return {
    maps: `https://www.google.com/maps/place/?q=place_id:${id}`,
    writeReview: `https://search.google.com/local/writereview?placeid=${id}`,
  };
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  if (process.env.NODE_ENV !== 'production' && process.env.GOOGLE_REVIEWS_PREVIEW === '1') {
    return PREVIEW;
  }

  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
      },
      // Reviews change slowly and every call is billed; once a day is plenty.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return parsePlace(await res.json());
  } catch {
    return null;
  }
}
