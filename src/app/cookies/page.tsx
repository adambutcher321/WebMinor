import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How WebMinor uses cookies on this website — what they do, why we use them, and how to control them.",
};

const cookieTable = [
  {
    category: "Strictly necessary",
    example: "cookie-consent",
    purpose: "Remembers that you've seen our cookie notice and your preference.",
    duration: "1 year",
  },
  {
    category: "Analytics (optional)",
    example: "e.g. Google Analytics",
    purpose: "Helps us understand how visitors find and use our website, anonymised where possible.",
    duration: "Up to 2 years",
  },
];

const sections: LegalSection[] = [
  {
    title: "What are cookies?",
    body: (
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They&apos;re widely used to make websites work, or work
        more efficiently, as well as to give the people who run the site
        useful information about how it&apos;s used.
      </p>
    ),
  },
  {
    title: "The cookies we use",
    body: (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-white text-xs uppercase tracking-wider font-[family-name:var(--font-mono)]">
              <th className="py-2 pr-4 font-semibold">Category</th>
              <th className="py-2 pr-4 font-semibold">Purpose</th>
              <th className="py-2 font-semibold">Duration</th>
            </tr>
          </thead>
          <tbody>
            {cookieTable.map((row) => (
              <tr key={row.category} className="border-b border-white/[0.05] align-top">
                <td className="py-3 pr-4 text-white font-medium whitespace-nowrap">
                  {row.category}
                  <div className="text-[#9AA3AF] font-normal text-xs mt-0.5">
                    {row.example}
                  </div>
                </td>
                <td className="py-3 pr-4">{row.purpose}</td>
                <td className="py-3 whitespace-nowrap">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    title: "Strictly necessary cookies",
    body: (
      <p>
        These cookies are essential for our website to function properly —
        for example, remembering your cookie preferences. The website may
        not work properly without them, and because they&apos;re essential,
        they don&apos;t require your consent under the UK rules on cookies
        (PECR).
      </p>
    ),
  },
  {
    title: "Analytics cookies",
    body: (
      <p>
        With your consent, we may use analytics cookies (such as Google
        Analytics) to understand how visitors find and use our website — for
        example, which pages are most popular and how people navigate the
        site. This information is aggregated and anonymised wherever
        possible, and we use it only to improve our website and services. We
        don&apos;t use analytics cookies to sell your data or track you
        across other websites.
      </p>
    ),
  },
  {
    title: "How to control cookies",
    body: (
      <p>
        Most browsers let you see what cookies you&apos;ve got and delete
        them individually, or block cookies from particular or all websites.
        Please note that if you block or delete cookies, some parts of our
        website may not work as intended. You can find out more about
        managing cookies in your browser&apos;s help pages, or generally at{" "}
        <a
          href="https://www.aboutcookies.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#40E0FF]"
        >
          www.aboutcookies.org
        </a>
        .
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Cookie Policy from time to time to reflect
        changes to the cookies we use or for operational, legal, or
        regulatory reasons. Please revisit this page periodically to stay
        informed.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        If you have any questions about our use of cookies, get in touch at{" "}
        <a href="mailto:hello@webminor.com" className="text-[#40E0FF]">
          hello@webminor.com
        </a>{" "}
        or call{" "}
        <a href="tel:01752845258" className="text-[#40E0FF]">
          01752 845258
        </a>
        . For how we handle personal data more generally, see our{" "}
        <a href="/privacy" className="text-[#40E0FF]">
          Privacy Policy
        </a>
        .
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Cookie"
      titleAccent="Policy"
      intro="A plain-English explanation of the cookies this website uses and how you can control them."
      lastUpdated="13 July 2026"
      sections={sections}
    />
  );
}
