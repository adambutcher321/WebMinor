import { describe, it, expect, afterEach, vi } from 'vitest';
import { parsePlace, getGoogleProfileLinks, MIN_REVIEWS } from './google';

function review(overrides: Record<string, unknown> = {}) {
  return {
    rating: 5,
    text: { text: 'Adam rebuilt our site and the phone started ringing.' },
    relativePublishTimeDescription: '2 weeks ago',
    authorAttribution: { displayName: 'Jo Bloggs', uri: 'https://www.google.com/maps/contrib/1' },
    ...overrides,
  };
}

function place(reviews: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    rating: 4.9,
    userRatingCount: 12,
    googleMapsUri: 'https://maps.google.com/?cid=1',
    reviews,
    ...overrides,
  };
}

describe('parsePlace', () => {
  it('returns the rating, count and reviews for a healthy listing', () => {
    const result = parsePlace(place([review(), review(), review()]));
    expect(result).not.toBeNull();
    expect(result!.rating).toBe(4.9);
    expect(result!.count).toBe(12);
    expect(result!.url).toBe('https://maps.google.com/?cid=1');
    expect(result!.reviews).toHaveLength(3);
    expect(result!.reviews[0]).toEqual({
      author: 'Jo Bloggs',
      authorUrl: 'https://www.google.com/maps/contrib/1',
      rating: 5,
      text: 'Adam rebuilt our site and the phone started ringing.',
      when: '2 weeks ago',
    });
  });

  it(`returns null with fewer than ${MIN_REVIEWS} usable reviews`, () => {
    expect(parsePlace(place([review(), review()]))).toBeNull();
  });

  it('drops reviews with no text and reviews under four stars', () => {
    const result = parsePlace(
      place([review(), review(), review(), review({ text: undefined }), review({ rating: 3 })]),
    );
    expect(result!.reviews).toHaveLength(3);
  });

  it('returns null when dropping unusable reviews leaves too few', () => {
    expect(parsePlace(place([review(), review(), review({ text: { text: '  ' } })]))).toBeNull();
  });

  it('returns null for a malformed payload', () => {
    expect(parsePlace(null)).toBeNull();
    expect(parsePlace({})).toBeNull();
    expect(parsePlace({ error: { code: 403 } })).toBeNull();
    expect(parsePlace(place([review(), review(), review()], { rating: undefined }))).toBeNull();
  });
});

describe('getGoogleProfileLinks', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('is null until a Place ID is set', () => {
    vi.stubEnv('GOOGLE_PLACE_ID', '');
    vi.stubEnv('GOOGLE_REVIEWS_PREVIEW', '');
    expect(getGoogleProfileLinks()).toBeNull();
  });

  it('builds the Maps and write-review links from the Place ID', () => {
    vi.stubEnv('GOOGLE_PLACE_ID', 'ChIJabc123');
    expect(getGoogleProfileLinks()).toEqual({
      maps: 'https://www.google.com/maps/place/?q=place_id:ChIJabc123',
      writeReview: 'https://search.google.com/local/writereview?placeid=ChIJabc123',
    });
  });
});
