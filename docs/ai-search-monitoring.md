# AI search monitoring

How to tell whether webminor.co.uk is being found, shown and cited by Google
AI Overviews / AI Mode, ChatGPT search and Microsoft Copilot, and whether any
of it turns into enquiries. None of these tools promise inclusion; they only
show what happened.

## Baseline, 25 September 2026

| Check | Result |
| --- | --- |
| Sitemap | 27 URLs, all 200, all self-canonical, all `index, follow` |
| Crawler access | Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot all get 200 and the full server HTML |
| Google index | Some pages indexed (home, case studies, free website review, Tavistock seen 24 Sep via `site:`) |
| Bing index | **Nothing.** `site:webminor.co.uk` and `"webminor.co.uk"` return no WebMinor pages. Copilot answers from the Bing index, so it has nothing to cite yet |
| Google Business Profile | Submitted 21 Sep, still not on Maps |
| Analytics | None installed on webminor.co.uk |
| Lighthouse mobile (home) | Performance 88, Accessibility 90, Best practices 96, SEO 100 |

## Where each number comes from

**Google (AI Overviews, AI Mode).** Search Console → Performance. AI Mode is
counted in the normal Web totals; the "Generative AI" performance report shows
impressions by page (no clicks). Settings → Search generative AI is the opt-out
switch; leave it on the default (included).

**Bing / Copilot.** Bing Webmaster Tools → AI Performance: citations in
Copilot and Bing AI answers, by URL and by query (no clicks). The site first
has to be added (import from Search Console is the quickest route) and the
sitemap submitted. After each deploy run `node scripts/indexnow.mjs`.

**ChatGPT.** No publisher console. ChatGPT adds `utm_source=chatgpt.com` to
links it cites, and the site now records that (and the referring site and first
page) for each visitor tab and adds it to every enquiry email as
"Came from" / "First page". See `src/lib/firstTouch.ts`.

**Enquiries.** Every form enquiry email now names its source. Count them
monthly by "Came from". Phone calls are not attributed; ask "how did you find
us?" on the phone and note it alongside.

## 30-day routine

- Week 1: confirm Bing Webmaster Tools is verified and the sitemap is read.
  Run IndexNow after the deploy. Use URL Inspection in Search Console on
  `/`, `/services/web-design` and `/pricing` and request indexing.
- Weekly: Search Console Performance (queries, pages, Generative AI report);
  Bing AI Performance; enquiry emails by "Came from".
- Day 30: compare against the baseline above. Useful questions: is Bing
  indexing the site now; which pages get AI impressions or citations; have any
  enquiries come from chatgpt.com, bing.com or google.com; which first pages
  do enquiries start on.

Low numbers in the first month are expected for a new domain with no reviews
and a Business Profile still in verification.
