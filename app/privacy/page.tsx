"use client";

import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();
  const effectiveDate = "June 4, 2026";

  return (
    <div className="pt-32 pb-24 bg-white text-navy-950">
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        <button
          onClick={() => router.back()}
          className="text-xs text-stone-500 hover:text-gold-500 transition-colors mb-8 inline-flex items-center gap-2 cursor-pointer"
          style={{ letterSpacing: "0.05em" }}
        >
          <span aria-hidden="true">&larr;</span>
          Back
        </button>
        <p className="text-[11px] font-medium text-gold-500 mb-4" style={{ letterSpacing: "0.18em" }}>
          LEGAL
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal mb-3" style={{ letterSpacing: "-0.01em" }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-stone-500 mb-12">
          Effective {effectiveDate}
        </p>

        <div className="space-y-10 text-base text-stone-700 leading-relaxed">

          <section>
            <p>
              This Privacy Policy describes how Misraje Real Estate Partners (&ldquo;Misraje,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a real estate partnership composed of Karen Misraje (California DRE License #00592639) and Jack Misraje (California DRE License #01015912), collects, uses, and protects information about visitors to this website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Information We Collect</h2>
            <p className="mb-4">
              We collect information in two ways: information you provide directly through our contact form, and information collected automatically through standard web analytics.
            </p>
            <p className="mb-4">
              <strong className="font-medium text-navy-950">Information you provide.</strong> When you submit our contact form, we collect your first and last name, email address, phone number (if provided), and the contents of your message. We also record whether you affirmatively consented to be contacted by phone, text, or email, along with the timestamp of that consent.
            </p>
            <p>
              <strong className="font-medium text-navy-950">Information collected automatically.</strong> We use Google Analytics 4 to understand how visitors find and use our site. This service collects anonymized information such as pages viewed, time on site, approximate geographic location (city or region, not precise location), device and browser type, and referring source. Google Analytics anonymizes IP addresses by default. We do not combine this analytics data with personally identifiable information you provide through our contact form.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">How We Use Information</h2>
            <p className="mb-4">
              We use the information you provide to respond to your inquiry, schedule consultations, and provide real estate services. We may contact you by phone, text message, or email only if you have explicitly consented at the time of form submission. We use analytics information to improve our website and understand which marketing efforts are effective.
            </p>
            <p>
              We do not sell your personal information. We do not share your contact information with third parties for their own marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">How We Share Information</h2>
            <p className="mb-4">
              We share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="font-medium text-navy-950">Service providers.</strong> We use Supabase to store contact form submissions, Vercel to host this website, Cloudflare Turnstile to prevent spam submissions, and Google Analytics to measure site traffic. These providers process information solely on our behalf.</li>
              <li><strong className="font-medium text-navy-950">Real estate transactions.</strong> If you become a client, we may share necessary information with escrow companies, title companies, lenders, inspectors, and other parties required to complete a real estate transaction on your behalf.</li>
              <li><strong className="font-medium text-navy-950">Legal requirements.</strong> We may disclose information if required by law, subpoena, or other legal process, or to protect our rights or the safety of others.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Cookies and Tracking</h2>
            <p>
              Google Analytics uses first-party cookies to distinguish unique visitors and measure site usage. These cookies do not contain personally identifiable information. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold-500 underline hover:text-gold-400">Google Analytics Opt-Out Browser Add-on</a> or by adjusting your browser&rsquo;s cookie settings.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Communication Consent and Opt-Out</h2>
            <p className="mb-4">
              By checking the consent box on our contact form, you agree to be contacted by Misraje Real Estate Partners via phone, text message, and email regarding real estate services. Message and data rates may apply. Message frequency varies.
            </p>
            <p>
              You may opt out of text messages at any time by replying STOP to any message you receive from us. Reply HELP for assistance. You may opt out of email by replying to any email with &ldquo;unsubscribe&rdquo; in the subject line, or by clicking the unsubscribe link in any marketing email. You may opt out of phone calls by telling us during a call.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Your California Privacy Rights</h2>
            <p className="mb-4">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) grant you the following rights regarding personal information we hold about you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The right to know what personal information we collect and how we use it</li>
              <li>The right to request a copy of the personal information we have collected</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to correct inaccurate personal information</li>
              <li>The right to opt out of the sale or sharing of personal information (we do not sell or share for cross-context behavioral advertising)</li>
              <li>The right to limit the use of sensitive personal information</li>
              <li>The right not to be discriminated against for exercising these rights</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at the email below. We will respond within 45 days as required by law. We may need to verify your identity before fulfilling your request.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Data Retention</h2>
            <p>
              We retain contact form submissions and related correspondence for as long as necessary to provide real estate services to you and to comply with our legal obligations, including record-keeping requirements under California real estate law. After our business relationship ends, we may retain certain records for the period required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Security</h2>
            <p>
              We use industry-standard security practices to protect your information, including encryption in transit (HTTPS), anti-spam verification on form submissions, and access controls on our contact database. However, no system is completely secure, and we cannot guarantee the absolute security of information transmitted over the internet.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Children&rsquo;s Privacy</h2>
            <p>
              This website is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us so we can delete it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The effective date at the top of this page indicates when it was last revised. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-normal text-navy-950 mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, our data practices, or wish to exercise any of your privacy rights, please contact us:
            </p>
            <p className="mb-2">
              <strong className="font-medium text-navy-950">Misraje Real Estate Partners</strong>
            </p>
            <p>
              Email: <a href="mailto:jack@misraje.com" className="text-gold-500 underline hover:text-gold-400">jack@misraje.com</a>
            </p>
          </section>

          <section className="pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-500 italic leading-relaxed">
              This Privacy Policy is a good-faith effort to disclose our data practices and should be reviewed by qualified legal counsel before relying on it for compliance purposes. Karen Misraje (DRE #00592639) and Jack Misraje (DRE #01015912) are licensed by the California Department of Real Estate.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

