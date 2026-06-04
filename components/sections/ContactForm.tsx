"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

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
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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
            I agree to be contacted by Misraje Real Estate Partners via call, email,
            and text for real estate services. To opt out, you can reply &lsquo;stop&rsquo; at
            any time or reply &lsquo;help&rsquo; for assistance. You can also click the
            unsubscribe link in the emails. Message and data rates may apply. Message
            frequency may vary.{" "}
            <Link href="/privacy" className="text-gold-500 underline hover:text-gold-400">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      {siteKey ? (
        <div className="pt-2">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
            onExpire={() => setTurnstileToken(null)}
            options={{ theme: "light" }}
          />
        </div>
      ) : (
        <p className="text-xs text-amber-400">
          Turnstile site key missing. Contact form anti-spam is disabled.
        </p>
      )}

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
