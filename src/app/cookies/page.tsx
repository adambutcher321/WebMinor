import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "This website sets no cookies. What it does store, why, how long for, and how to object.",
};

const cookieTable = [
  {
    category: "Where you came from",
    example: "wm-first-touch (session storage)",
    purpose: "Notes the website that sent you and the first page you saw, so an enquiry you send can tell us how you found us.",
    duration: "Until you close the tab",
  },
  {
    category: "Visitor counts",
    example: "Vercel Web Analytics",
    purpose: "Counts page views and which site sent you. Nothing is stored on your device.",
    duration: "Nothing stored",
  },
];

const sections: LegalSection[] = [
  {
    title: "What are cookies?",
    body: (
      <p>
        Cookies are small text files a website places on your device. The
        same rules (PECR) also cover similar technologies, such as the
        session storage built into your browser. This website sets no
        cookies at all. The table below lists everything it does store or
        count.
      </p>
    ),
  },
  {
    title: "What this website stores",
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
                <td className="py-3 pr-4 text-white font-medium w-[34%]">
                  {row.category}
                  <div className="text-[#9AA3AF] font-normal text-sm mt-0.5 break-words">
                    {row.example}
                  </div>
                </td>
                <td className="py-3 pr-4">{row.purpose}</td>
                <td className="py-3 w-[22%]">{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    title: "Where you came from",
    body: (
      <>
        <p>
          When you arrive, your browser keeps a short note in session
          storage called <code>wm-first-touch</code>. It holds the name of
          the website that sent you (for example a search engine), the first
          page you landed on here, and a campaign tag if the link had one.
          It doesn&apos;t hold your name, contact details or anything that
          identifies you.
        </p>
        <p className="mt-4">
          The note stays in your browser and is deleted when you close the
          tab. It only reaches us if you send one of our forms, when it is
          attached to your enquiry so we can see which ways of finding us
          are working. We use it for that alone, under the exception for
          statistical purposes in PECR, which doesn&apos;t need your consent.
        </p>
        <p className="mt-4">
          If you&apos;d rather we didn&apos;t have it, say so in your
          message or email hello@webminor.co.uk at any time and we&apos;ll
          delete it from your enquiry. Browsing in a private window also
          stops it being kept once the window closes.
        </p>
      </>
    ),
  },
  {
    title: "Analytics",
    body: (
      <p>
        We use Vercel Web Analytics to see which pages people visit and
        which website or search engine sent them. It sets no cookies and
        stores nothing on your device. Each visit is counted using a hash of
        the request that resets every day, so it can&apos;t recognise you
        on a later day or follow you to other websites, and we only ever see
        totals. We use it to improve our website and don&apos;t use it to
        sell your data.
      </p>
    ),
  },
  {
    title: "How to control what websites store",
    body: (
      <p>
        Most browsers let you see and delete what websites have stored, or
        block storage from particular sites or all of them. Blocking it
        won&apos;t stop this website working. You can find out more about
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
        changes to what this website stores or for operational, legal, or
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
        <a href="mailto:hello@webminor.co.uk" className="text-[#40E0FF]">
          hello@webminor.co.uk
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
      intro="This website sets no cookies. Here is what it does store, why, and how to object."
      lastUpdated="27 September 2026"
      sections={sections}
    />
  );
}
