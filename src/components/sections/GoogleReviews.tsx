import { getGoogleReviews } from '@/lib/reviews/google';
import ReviewsRail from './ReviewsRail';
import s from './google-reviews.module.css';

function GoogleG({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <p className={s.stars} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true" className={n <= full ? s.starOn : s.starOff}>
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9L4.7 18l1.1-6L1.4 7.8l6-.8L10 1.5z" />
        </svg>
      ))}
    </p>
  );
}

/*
  Renders nothing until the WebMinor Business Profile has enough real reviews
  (see src/lib/reviews/google.ts), so it is safe to mount anywhere now.
*/
export default async function GoogleReviews() {
  const data = await getGoogleReviews();
  if (!data) return null;

  return (
    <div className={s.root} role="region" aria-labelledby="google-reviews-heading">
      <div className={s.summary}>
        <p className={s.eyebrow}>
          <GoogleG size={14} />
          Google reviews
        </p>
        <h2 id="google-reviews-heading" className={s.score}>
          {data.rating.toFixed(1)}
        </h2>
        <Stars rating={data.rating} />
        <p className={s.lede}>
          The average from {data.count} reviews left on Google.
        </p>
        <a className={s.all} href={data.url} target="_blank" rel="noopener noreferrer">
          Read them all on Google
        </a>
      </div>

      <ReviewsRail>
        {data.reviews.map((r) => (
          <li key={`${r.author}-${r.when}`} className={s.card}>
            <div className={s.cardHead}>
              <p className={s.cardScore}>{r.rating.toFixed(1)}</p>
              <Stars rating={r.rating} />
            </div>
            <blockquote className={s.text}>{r.text}</blockquote>
            <div className={s.author}>
              <p className={s.avatar} aria-hidden="true">{r.author.charAt(0).toUpperCase()}</p>
              <div>
                {r.authorUrl ? (
                  <a className={s.name} href={r.authorUrl} target="_blank" rel="noopener noreferrer">{r.author}</a>
                ) : (
                  <p className={s.name}>{r.author}</p>
                )}
                <p className={s.meta}>
                  <GoogleG size={11} />
                  Posted on Google{r.when ? ` · ${r.when}` : ''}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ReviewsRail>
    </div>
  );
}
