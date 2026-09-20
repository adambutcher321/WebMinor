import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How WebMinor collects, uses, and protects your personal information, and your rights under UK GDPR.",
};

const sections: LegalSection[] = [
  {
    title: "Who we are",
    body: (
      <p>
        WebMinor is a trading name of Able Print Limited, a company
        registered in England and Wales under company number 05143261. Our
        registered office is Unit 3, Gwel Avon Business Park, Gilston Road,
        Saltash, Cornwall, PL12 6TW, and our VAT number is 432542811. For
        the purposes of data protection law, Able Print Limited is the
        &ldquo;data controller&rdquo; of the personal information described
        in this policy. Any questions about
        this policy or how we handle your data can be directed to{" "}
        <a href="mailto:hello@webminor.co.uk" className="text-[#40E0FF]">
          hello@webminor.co.uk
        </a>
        .
      </p>
    ),
  },
  {
    title: "Information we collect",
    body: (
      <p>
        We collect information you give us directly — for example your name,
        email address, phone number, business name, and website address when
        you submit a contact form, request a free website review, or get in
        touch by phone, email or WhatsApp. We also collect limited technical
        information automatically when you visit our website, such as your
        IP address, browser and device type, pages viewed, and how you
        arrived at the site, via cookies and similar technologies — see our{" "}
        <a href="/cookies" className="text-[#40E0FF]">
          Cookie Policy
        </a>{" "}
        for details.
      </p>
    ),
  },
  {
    title: "How we use your information",
    body: (
      <p>
        We use your information to respond to enquiries and provide the free
        website reviews you request; discuss and deliver the services you
        engage us for; send you information you&apos;ve asked for about our
        services; understand how visitors use our website so we can improve
        it; and meet our legal and accounting obligations. We do not sell
        your personal information to third parties, and we will only use
        your details for marketing if you&apos;ve given us permission to do
        so — you can opt out at any time.
      </p>
    ),
  },
  {
    title: "Our legal basis for processing your data",
    body: (
      <p>
        We process your personal data on one or more of the following legal
        bases: <em>consent</em>{" "}
        (for example, when you submit a contact form or opt in to
        marketing); <em>legitimate interests</em>{" "}
        (for example, responding to enquiries and improving our website,
        provided this doesn&apos;t override your rights); and{" "}
        <em>contract</em>{" "}
        (where processing is necessary to deliver a service you&apos;ve
        engaged us for).
      </p>
    ),
  },
  {
    title: "Sharing your information",
    body: (
      <p>
        We work with a small number of trusted third-party providers to run
        our business and deliver our services — for example, website hosting
        providers, email and form-handling services, and accounting
        software. These providers only access the information they need to
        perform their function and are contractually required to keep it
        secure. We do not share your information with third parties for
        their own marketing purposes.
      </p>
    ),
  },
  {
    title: "How long we keep your information",
    body: (
      <p>
        We keep enquiry and contact information for as long as needed to
        respond to your enquiry and for a reasonable period afterwards in
        case you get back in touch, and client data for the duration of our
        engagement plus a period afterwards to meet our legal, accounting,
        and tax obligations (typically up to 7 years). We periodically
        review the data we hold and delete or anonymise information we no
        longer need.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <>
        <p>Under UK GDPR you have the right to:</p>
        <ul className="list-disc list-inside space-y-1 marker:text-[#40E0FF]">
          <li>access the personal data we hold about you;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data deleted in certain circumstances;</li>
          <li>restrict or object to our processing of your data;</li>
          <li>receive a copy of your data in a portable format; and</li>
          <li>
            withdraw consent at any time where we rely on consent to process
            your data.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:hello@webminor.co.uk" className="text-[#40E0FF]">
            hello@webminor.co.uk
          </a>
          . If you&apos;re unhappy with how we&apos;ve handled your data, you
          also have the right to complain to the Information
          Commissioner&apos;s Office (ICO) at{" "}
          <a
            href="https://ico.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#40E0FF]"
          >
            ico.org.uk
          </a>
          .
        </p>
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <p>
        Our website uses cookies to function properly and, with your
        consent, to help us understand how visitors use the site. Full
        details are in our{" "}
        <a href="/cookies" className="text-[#40E0FF]">
          Cookie Policy
        </a>
        .
      </p>
    ),
  },
  {
    title: "Keeping your information secure",
    body: (
      <p>
        We use appropriate technical and organisational measures to protect
        your personal information against unauthorised access, loss, or
        misuse, including secure hosting, encrypted connections (HTTPS), and
        access controls. No method of transmission over the internet is
        completely secure, but we work to protect your information to a high
        standard.
      </p>
    ),
  },
  {
    title: "Where your data is stored",
    body: (
      <p>
        Your data is primarily stored and processed within the UK and
        European Economic Area. Where we use a service provider based
        outside the UK/EEA, we make sure appropriate safeguards are in
        place, such as Standard Contractual Clauses, to protect your
        information.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time to reflect
        changes in our practices or legal requirements. The date at the top
        of this page shows when it was last revised. We encourage you to
        review it periodically.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        If you have any questions about this Privacy Policy or how we handle
        your personal data, please contact us: Email{" "}
        <a href="mailto:hello@webminor.co.uk" className="text-[#40E0FF]">
          hello@webminor.co.uk
        </a>
        , Phone{" "}
        <a href="tel:01752845258" className="text-[#40E0FF]">
          01752 845258
        </a>
        , Post Unit 3, Gwel Avon Business Park, Gilston Road, Saltash,
        Cornwall, PL12 6TW.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy"
      titleAccent="Policy"
      intro="How we collect, use, and protect your personal information when you visit our website or get in touch with us."
      lastUpdated="13 July 2026"
      sections={sections}
    />
  );
}
