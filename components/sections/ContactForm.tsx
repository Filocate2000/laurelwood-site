"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { siteConfig } from "@/lib/site-config";
import { contactContent } from "@/content/contact";

// Shown whenever the challenge cannot be completed, from any cause. Points at
// the contact details this page already renders rather than dead-ending.
const CHALLENGE_UNAVAILABLE =
  "The verification challenge could not load, so the form cannot be sent. " +
  "Please reload the page, or call or email us using the details on this page.";

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [phone, setPhone] = useState("");
  const [challengeReady, setChallengeReady] = useState(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Loud, once, for whoever is operating the site. Without the site key there is
  // no way to submit at all: /api/contact rejects a tokenless body with a 400,
  // so the form is dead rather than merely unprotected.
  useEffect(() => {
    if (!turnstileSiteKey) {
      console.error(
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. The contact form cannot be " +
          "submitted (the API requires a Turnstile token), so the direct-contact " +
          "fallback is being shown in its place."
      );
    }
  }, [turnstileSiteKey]);

  // onError only fires once the Turnstile SCRIPT is running. If the script
  // itself never loads (blocked network, an ad blocker, a Cloudflare outage) no
  // callback fires at all, and the submit button sits disabled forever with no
  // explanation. This watchdog covers every such case uniformly: if the widget
  // has not rendered by the time it expires, say so. 12s is far beyond a normal
  // load, so a slow connection will not trip it, and onWidgetLoad cancels it.
  useEffect(() => {
    if (!turnstileSiteKey || challengeReady) return;
    const timer = setTimeout(() => {
      setStatus("error");
      setError(CHALLENGE_UNAVAILABLE);
    }, 12000);
    return () => clearTimeout(timer);
  }, [turnstileSiteKey, challengeReady]);

  // A challenge that recovers late (slow network, a retry) must retract the
  // watchdog's complaint, or the banner would sit above a button that now works.
  // Scoped to that one message so a real submit error is never swallowed.
  useEffect(() => {
    if (turnstileToken && error === CHALLENGE_UNAVAILABLE) {
      setError(null);
      setStatus("idle");
    }
  }, [turnstileToken, error]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!tcpaConsent) {
      setStatus("error");
      setError("Please agree to the contact disclosure to submit the form.");
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setError("Please wait for the verification challenge to complete.");
      return;
    }

    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: phone || null,
      message: formData.get("message"),
      tcpa_consent: tcpaConsent,
      turnstile_token: turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Submission failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setTcpaConsent(false);
      setPhone("");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  if (status === "success") {
    return (
      <div className="bg-navy-800 border border-gold-500/30 p-10 text-center">
        <span className="gold-rule mx-auto mb-6" />
        <h3 className="font-display font-light text-2xl text-white mb-3">Thank you.</h3>
        <p className="text-ink-200">
          Your message has been received. We will be in touch shortly.
        </p>
      </div>
    );
  }

  // No Turnstile site key means no submittable form: /api/contact requires a
  // token and returns 400 without one, so rendering the fields would invite a
  // visitor to type a message they can never send. Show the ways to reach us
  // instead. Contact details come from siteConfig, never hardcoded here.
  if (!turnstileSiteKey) {
    const o = siteConfig.office;
    return (
      <div className="bg-navy-800 border border-gold-500/30 p-10">
        <span className="gold-rule mb-6" />
        <h3 className="font-display font-light text-2xl text-white mb-3">
          Reach us directly.
        </h3>
        <p className="text-ink-200 mb-8">
          Our message form is temporarily unavailable. Call or email either of us
          and we will respond right away.
        </p>
        <div className="space-y-6">
          {siteConfig.agents.map((a) => (
            <div key={a.slug}>
              <p className="eyebrow text-gold-500 mb-2">
                {a.firstName} {a.lastName}
              </p>
              <p>
                <a
                  href={`mailto:${a.email}`}
                  className="text-ink-100 hover:text-gold-500 transition-colors"
                >
                  {a.email}
                </a>
              </p>
              <p>
                <a
                  href={a.phoneHref}
                  className="text-ink-100 hover:text-gold-500 transition-colors"
                >
                  {a.phone}
                </a>
              </p>
            </div>
          ))}
          <div>
            <p className="eyebrow text-gold-500 mb-2">Office</p>
            <p>
              <a
                href={o.phoneHref}
                className="text-ink-100 hover:text-gold-500 transition-colors"
              >
                {o.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-0 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <Field name="first_name" label="First Name" required />
        <Field name="last_name" label="Last Name" />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Field name="email" type="email" label="Email" required />
        <div>
          <label htmlFor="phone" className="eyebrow block mb-2">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="555-555-5555"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className={inputClass}
          />
        </div>
      </div>
      <Field name="message" label="Message" textarea />

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={tcpaConsent}
            onChange={(e) => setTcpaConsent(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-gold-500"
            required
          />
          <span className="text-xs text-ink-200 leading-relaxed">
            {contactContent.consent.pre}
            <Link
              href={contactContent.consent.href}
              className="text-gold-500 underline hover:text-gold-400"
            >
              {contactContent.consent.linkText}
            </Link>
            {contactContent.consent.post}
          </span>
        </label>
      </div>

      <div className="pt-2">
        <Turnstile
          ref={turnstileRef}
          siteKey={turnstileSiteKey}
          onWidgetLoad={() => setChallengeReady(true)}
          onSuccess={(token) => {
            setChallengeReady(true);
            setTurnstileToken(token);
          }}
          onError={() => {
            // Without this the button just greys out forever with no reason
            // given. Same dead end as a missing key, different cause.
            setTurnstileToken(null);
            setStatus("error");
            setError(CHALLENGE_UNAVAILABLE);
          }}
          onExpire={() => setTurnstileToken(null)}
          options={{ theme: "light" }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 border border-red-400/30 bg-red-400/10 px-4 py-3">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting" || !turnstileToken || !tcpaConsent}
        className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  textarea = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const className =
    "w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-0 transition-colors";
  return (
    <div>
      <label htmlFor={name} className="eyebrow block mb-2">
        {label}
        {required && <span className="text-gold-500 ml-1">*</span>}
      </label>
      {textarea ? (
        <textarea id={name} name={name} rows={4} required={required} className={className} />
      ) : (
        <input id={name} name={name} type={type} required={required} className={className} />
      )}
    </div>
  );
}
