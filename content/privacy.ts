// content/privacy.ts
// Copy for /privacy. Lifted out of app/privacy/PrivacyContent.tsx 2026-08-27,
// which held the entire policy hardcoded with zero siteConfig references. A
// frymanestates.com clone would have shipped a legal page naming the wrong firm
// and the wrong licensees.
//
// THE LEGAL TEXT IS VERBATIM. Nothing here was reworded in the lift. What
// changed is that the identity strings (firm name, licensees and their DRE
// numbers, the contact email) are now derived from lib/site-config.ts instead of
// being typed into the page, so they cannot go stale or travel to a sibling site
// unnoticed.
//
// Typographic quotes are U+201C / U+201D / U+2019 to match the &ldquo; / &rdquo;
// / &rsquo; entities the JSX used, so rendering is unchanged.
//
// NO em dashes.

import { siteConfig } from "@/lib/site-config";

/** A "Label. Rest of sentence" paragraph or bullet. */
export type Lead = { lead: string; rest: string };

export type Block =
  | { kind: "text"; text: string }
  | { kind: "lead"; lead: string; rest: string }
  | {
      kind: "link";
      pre: string;
      linkText: string;
      href: string;
      post: string;
      /** Renders with target=_blank + rel=noopener noreferrer. */
      external?: boolean;
    }
  | { kind: "bullets"; items: (string | Lead)[] }
  | { kind: "strong"; text: string };

export type PrivacySection = {
  heading?: string;
  blocks: Block[];
  /** Renders as the closing disclaimer: hairline rule above, small italic text. */
  disclaimer?: boolean;
};

/** "A and B", "A, B, and C". Used for the licensee lists below. */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

const firm = siteConfig.legalName;

// "Karen Misraje (California DRE License #00592639) and Jack Misraje (...)"
const licenseesLong = joinNames(
  siteConfig.agents.map(
    (a) => `${a.firstName} ${a.lastName} (California DRE License #${a.calRE})`
  )
);

// "Karen Misraje (DRE #00592639) and Jack Misraje (DRE #01015912)"
const licenseesShort = joinNames(
  siteConfig.agents.map((a) => `${a.firstName} ${a.lastName} (DRE #${a.calRE})`)
);

export const privacyContent = {
  eyebrow: "LEGAL",
  title: "Privacy Policy",
  effectiveDate: "June 4, 2026",
  backLabel: "Back",

  metaDescription: `How ${firm} collects, uses, and protects information for visitors to the ${siteConfig.name} website.`,

  contactEmail: siteConfig.legal.privacyContactEmail,
  firmName: firm,

  sections: [
    {
      blocks: [
        {
          kind: "text",
          text: `This Privacy Policy describes how ${firm} (“Misraje,” “we,” “us,” or “our”), a real estate partnership composed of ${licenseesLong}, collects, uses, and protects information about visitors to this website.`,
        },
      ],
    },
    {
      heading: "Information We Collect",
      blocks: [
        {
          kind: "text",
          text: "We collect information in two ways: information you provide directly through our contact form, and information collected automatically through standard web analytics.",
        },
        {
          kind: "lead",
          lead: "Information you provide.",
          rest: " When you submit our contact form, we collect your first and last name, email address, phone number (if provided), and the contents of your message. We also record whether you affirmatively consented to be contacted by phone, text, or email, along with the timestamp of that consent.",
        },
        {
          kind: "lead",
          lead: "Information collected automatically.",
          rest: " We use Google Analytics 4 to understand how visitors find and use our site. This service collects anonymized information such as pages viewed, time on site, approximate geographic location (city or region, not precise location), device and browser type, and referring source. Google Analytics anonymizes IP addresses by default. We do not combine this analytics data with personally identifiable information you provide through our contact form.",
        },
      ],
    },
    {
      heading: "How We Use Information",
      blocks: [
        {
          kind: "text",
          text: "We use the information you provide to respond to your inquiry, schedule consultations, and provide real estate services. We may contact you by phone, text message, or email only if you have explicitly consented at the time of form submission. We use analytics information to improve our website and understand which marketing efforts are effective.",
        },
        {
          kind: "text",
          text: "We do not sell your personal information. We do not share your contact information with third parties for their own marketing purposes.",
        },
      ],
    },
    {
      heading: "How We Share Information",
      blocks: [
        { kind: "text", text: "We share your information only in the following circumstances:" },
        {
          kind: "bullets",
          items: [
            {
              lead: "Service providers.",
              rest: " We use Supabase to store contact form submissions, Vercel to host this website, Cloudflare Turnstile to prevent spam submissions, and Google Analytics to measure site traffic. These providers process information solely on our behalf.",
            },
            {
              lead: "Real estate transactions.",
              rest: " If you become a client, we may share necessary information with escrow companies, title companies, lenders, inspectors, and other parties required to complete a real estate transaction on your behalf.",
            },
            {
              lead: "Legal requirements.",
              rest: " We may disclose information if required by law, subpoena, or other legal process, or to protect our rights or the safety of others.",
            },
          ],
        },
      ],
    },
    {
      heading: "Cookies and Tracking",
      blocks: [
        {
          kind: "link",
          pre: "Google Analytics uses first-party cookies to distinguish unique visitors and measure site usage. These cookies do not contain personally identifiable information. You can opt out of Google Analytics tracking by installing the ",
          linkText: "Google Analytics Opt-Out Browser Add-on",
          href: "https://tools.google.com/dlpage/gaoptout",
          post: " or by adjusting your browser’s cookie settings.",
          external: true,
        },
      ],
    },
    {
      heading: "Communication Consent and Opt-Out",
      blocks: [
        {
          kind: "text",
          text: `By checking the consent box on our contact form, you agree to be contacted by ${firm} via phone, text message, and email regarding real estate services. Message and data rates may apply. Message frequency varies.`,
        },
        {
          kind: "text",
          text: "You may opt out of text messages at any time by replying STOP to any message you receive from us. Reply HELP for assistance. You may opt out of email by replying to any email with “unsubscribe” in the subject line, or by clicking the unsubscribe link in any marketing email. You may opt out of phone calls by telling us during a call.",
        },
      ],
    },
    {
      heading: "Your California Privacy Rights",
      blocks: [
        {
          kind: "text",
          text: "If you are a California resident, the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) grant you the following rights regarding personal information we hold about you:",
        },
        {
          kind: "bullets",
          items: [
            "The right to know what personal information we collect and how we use it",
            "The right to request a copy of the personal information we have collected",
            "The right to request deletion of your personal information",
            "The right to correct inaccurate personal information",
            "The right to opt out of the sale or sharing of personal information (we do not sell or share for cross-context behavioral advertising)",
            "The right to limit the use of sensitive personal information",
            "The right not to be discriminated against for exercising these rights",
          ],
        },
        {
          kind: "text",
          text: "To exercise any of these rights, please contact us at the email below. We will respond within 45 days as required by law. We may need to verify your identity before fulfilling your request.",
        },
      ],
    },
    {
      heading: "Data Retention",
      blocks: [
        {
          kind: "text",
          text: "We retain contact form submissions and related correspondence for as long as necessary to provide real estate services to you and to comply with our legal obligations, including record-keeping requirements under California real estate law. After our business relationship ends, we may retain certain records for the period required by applicable law.",
        },
      ],
    },
    {
      heading: "Security",
      blocks: [
        {
          kind: "text",
          text: "We use industry-standard security practices to protect your information, including encryption in transit (HTTPS), anti-spam verification on form submissions, and access controls on our contact database. However, no system is completely secure, and we cannot guarantee the absolute security of information transmitted over the internet.",
        },
      ],
    },
    {
      heading: "Children’s Privacy",
      blocks: [
        {
          kind: "text",
          text: "This website is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us so we can delete it.",
        },
      ],
    },
    {
      heading: "Changes to This Policy",
      blocks: [
        {
          kind: "text",
          text: "We may update this Privacy Policy from time to time. The effective date at the top of this page indicates when it was last revised. We encourage you to review this policy periodically.",
        },
      ],
    },
    {
      heading: "Contact Us",
      blocks: [
        {
          kind: "text",
          text: "If you have questions about this Privacy Policy, our data practices, or wish to exercise any of your privacy rights, please contact us:",
        },
        { kind: "strong", text: firm },
        {
          kind: "link",
          pre: "Email: ",
          linkText: siteConfig.legal.privacyContactEmail,
          href: `mailto:${siteConfig.legal.privacyContactEmail}`,
          post: "",
        },
      ],
    },
    {
      disclaimer: true,
      blocks: [
        {
          kind: "text",
          text: `This Privacy Policy is a good-faith effort to disclose our data practices and should be reviewed by qualified legal counsel before relying on it for compliance purposes. ${licenseesShort} are licensed by the California Department of Real Estate.`,
        },
      ],
    },
  ] as PrivacySection[],
};
