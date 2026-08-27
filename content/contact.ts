// content/contact.ts
// Copy for /contact and the contact form.
//
// Lifted 2026-08-27. The TCPA consent sentence named the firm in a string
// literal inside a component, which is both a template-rule violation and a
// compliance hazard: a sibling site would have collected consent naming the
// wrong entity.
//
// Typographic quotes are U+2018 / U+2019 to match the &lsquo; / &rsquo; entities
// the JSX used, so rendering is unchanged.
//
// NO em dashes.

import { siteConfig } from "@/lib/site-config";

export const contactContent = {
  eyebrow: "Ways to Reach Us",
  officeLabel: "Office",
  emailLabel: "Email",
  telephoneLabel: "Telephone",
  serviceAreaLabel: "Service Area",
  serviceArea: "Laurelwood · Studio City · Los Angeles · Ventura · South Bay",

  metaDescription: `Get in touch with ${siteConfig.legalName} about buying or selling in Laurelwood, the Doña streets, and Studio City.`,

  /** TCPA consent shown beside the checkbox. The named entity is the one that
   *  will actually be contacting the visitor, so it must follow siteConfig. */
  consent: {
    pre: `I agree to be contacted by ${siteConfig.legalName} via call, email, and text for real estate services. To opt out, you can reply ‘stop’ at any time or reply ‘help’ for assistance. You can also click the unsubscribe link in the emails. Message and data rates may apply. Message frequency may vary. `,
    linkText: "Privacy Policy",
    href: "/privacy",
    post: ".",
  },
};
