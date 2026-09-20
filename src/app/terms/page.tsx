import type { Metadata } from "next";
import LegalPageLayout, { type LegalSection } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the WebMinor website and your enquiries with us.",
};

const sections: LegalSection[] = [
  {
    title: "Who we are",
    body: (
      <p>
        References to &ldquo;WebMinor&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo; or &ldquo;our&rdquo; mean Able Print Limited,
        trading as WebMinor. Able Print Limited is registered in England and
        Wales under company number 05143261, with its registered office at
        Unit 3, Gwel Avon Business Park, Gilston Road, Saltash, Cornwall,
        PL12 6TW. VAT number 432542811. References to &ldquo;you&rdquo; or &ldquo;your&rdquo; mean
        the person or business using our website or getting in touch with
        us.
      </p>
    ),
  },
  {
    title: "Using this website",
    body: (
      <p>
        This website is provided to give you information about
        WebMinor&apos;s services, showcase our work, and let you get in
        touch with us. You may view, download, and print pages from the site
        for your own personal or business use, provided you don&apos;t
        modify any content and keep all copyright and other proprietary
        notices intact. You must not use this website in any way that
        causes, or may cause, damage to the website or impairment of its
        availability, or in any way that&apos;s unlawful, fraudulent, or
        harmful.
      </p>
    ),
  },
  {
    title: "Free website reviews and enquiries",
    body: (
      <p>
        Where we offer a free website review or similar service, this is
        provided as a goodwill introduction to our services and doesn&apos;t
        create any binding obligation on either side. We aim to respond to
        enquiries within 2 hours during business hours, but this is a target
        rather than a guarantee.
      </p>
    ),
  },
  {
    title: "Engaging us for paid services",
    body: (
      <p>
        Details of our website, SEO, and marketing packages are set out on
        our{" "}
        <a href="/pricing" className="text-[#40E0FF]">
          Pricing
        </a>{" "}
        page and are correct at the time of publishing but may be updated
        from time to time. Where you engage us for paid services, the
        specific scope, pricing, and terms of that engagement will be
        confirmed separately in writing (for example by email or a signed
        proposal), and those specific terms will take precedence over these
        general website Terms in the event of any conflict.
      </p>
    ),
  },
  {
    title: "Intellectual property",
    body: (
      <p>
        Unless otherwise stated, the content on this website — including
        text, graphics, logos, and images — is owned by or licensed to
        WebMinor and is protected by copyright and other intellectual
        property laws. You may not reproduce, republish, or redistribute any
        part of this website for commercial purposes without our prior
        written consent. Ownership of intellectual property in work we
        create for clients is addressed in the specific agreement for that
        engagement.
      </p>
    ),
  },
  {
    title: "Accuracy of information",
    body: (
      <p>
        We take reasonable care to keep the information on this website
        accurate and up to date, including pricing, service descriptions,
        and case study results. However, we make no warranty that the
        website will be error-free or that any information is complete, and
        results described for previous clients (such as search rankings or
        lead generation figures) are illustrative of past outcomes and are
        not a guarantee of similar results for your business.
      </p>
    ),
  },
  {
    title: "Links to other websites",
    body: (
      <p>
        Our website may contain links to third-party websites. We&apos;re
        not responsible for the content, accuracy, or practices of any
        linked websites, and including a link doesn&apos;t imply our
        endorsement of it.
      </p>
    ),
  },
  {
    title: "Limitation of liability",
    body: (
      <p>
        To the fullest extent permitted by law, WebMinor won&apos;t be
        liable for any indirect or consequential loss, or any loss of
        profits, revenue, business, or data, arising from your use of this
        website. Nothing in these Terms excludes or limits our liability for
        death or personal injury caused by negligence, fraud, or any other
        liability that cannot be excluded or limited under English law.
      </p>
    ),
  },
  {
    title: "Governing law",
    body: (
      <p>
        These Terms are governed by the laws of England and Wales, and any
        disputes relating to them will be subject to the exclusive
        jurisdiction of the courts of England and Wales.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        We may update these Terms from time to time. The date at the top of
        this page shows when they were last revised, and continuing to use
        our website after any changes means you accept the updated Terms.
      </p>
    ),
  },
  {
    title: "Contact us",
    body: (
      <p>
        If you have any questions about these Terms, please contact us:
        Email{" "}
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

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of"
      titleAccent="Service"
      intro="The terms that govern your use of this website and your enquiries with us."
      lastUpdated="13 July 2026"
      sections={sections}
    />
  );
}
