import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildLeadEmail } from "@/lib/leadEmail";
import { siteConfig } from "@/lib/site-config";
import { resolveBrokerageId } from "@/lib/brokerage";

// Lead source is keyed off this site's domain (siteConfig.domain), NOT the
// shared NEXT_PUBLIC_SITE_KEY env (which the cloned .env.local still sets to
// "misraje"). This keeps Laurelwood leads attributed to laurelwoodestates.com
// in the shared backend. Sibling sites attribute correctly by changing only
// siteConfig.domain.
const SITE_KEY = siteConfig.domain;

const ALLOWED_LEAD_SOURCES = new Set([
  "misraje.com",
  "laurelwoodestates.com",
  "westlaurelwood.com",
  "eastlaurelwood.com",
  "thedonastreets.com",
  "frymanestates.com",
]);

function leadSourceFromSiteKey(siteKey: string): string {
  const candidate = siteKey.includes(".") ? siteKey : siteKey + ".com";
  return ALLOWED_LEAD_SOURCES.has(candidate) ? candidate : "misraje.com";
}

function buildDisplayName(
  firstName: string,
  lastName: string | null,
  email: string
): string {
  const parts = [firstName, lastName].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0
  );
  if (parts.length > 0) return parts.join(" ").trim();
  return email;
}

function annotatedNotes(
  message: string | null,
  ip: string | null,
  userAgent: string | null
): string {
  const stamp = new Date().toISOString();
  const meta = [
    "captured_at=" + stamp,
    "source=" + SITE_KEY,
    ip ? "ip=" + ip : null,
    userAgent ? "user_agent=" + userAgent.slice(0, 200) : null,
  ]
    .filter(Boolean)
    .join(" ");
  const body = (message ?? "").trim();
  if (body.length === 0) return "[" + meta + "]";
  return body + "\n\n[" + meta + "]";
}

// Best-effort hostname of the site the lead came from, so a laurelwoodestates.com
// submission is distinguishable from a misraje.com one. Prefer Origin, then
// Referer (both full URLs), then the Host header. Strip a leading "www.".
function deriveOriginSite(req: NextRequest): string {
  const fromUrl = (value: string | null): string | null => {
    if (!value) return null;
    try {
      return new URL(value).hostname;
    } catch {
      return null;
    }
  };
  const host =
    fromUrl(req.headers.get("origin")) ??
    fromUrl(req.headers.get("referer")) ??
    (req.headers.get("host")?.split(":")[0] || null);
  if (!host) return "unknown";
  return host.replace(/^www\./, "");
}

async function verifyTurnstile(
  token: string,
  remoteIp: string | null
): Promise<{ success: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY missing on server");
    return { success: false, reason: "server_misconfig" };
  }
  try {
    const body = new URLSearchParams();
    body.append("secret", secret);
    body.append("response", token);
    if (remoteIp) body.append("remoteip", remoteIp);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const data = await res.json();
    if (data.success === true) {
      return { success: true };
    }
    return { success: false, reason: (data["error-codes"] || []).join(",") };
  } catch (err) {
    console.error("Turnstile verify exception:", err);
    return { success: false, reason: "verify_exception" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.first_name || typeof body.first_name !== "string") {
      return NextResponse.json(
        { error: "First name is required." },
        { status: 400 }
      );
    }
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }
    if (!body.turnstile_token || typeof body.turnstile_token !== "string") {
      return NextResponse.json(
        { error: "Captcha verification missing. Please reload and try again." },
        { status: 400 }
      );
    }
    if (body.tcpa_consent !== true) {
      return NextResponse.json(
        { error: "Please agree to the contact disclosure to submit the form." },
        { status: 400 }
      );
    }

    const ipAddress = req.headers.get("x-forwarded-for") ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;
    const originSite = deriveOriginSite(req);

    const turnstileResult = await verifyTurnstile(body.turnstile_token, ipAddress);
    if (!turnstileResult.success) {
      console.warn("Turnstile verification failed:", turnstileResult.reason);
      return NextResponse.json(
        { error: "Captcha verification failed. Please refresh and try again." },
        { status: 403 }
      );
    }

    const firstName: string = body.first_name.trim();
    const lastName: string | null =
      typeof body.last_name === "string" && body.last_name.trim().length > 0
        ? body.last_name.trim()
        : null;
    const email: string = body.email.trim().toLowerCase();
    const phone: string | null =
      typeof body.phone === "string" && body.phone.trim().length > 0
        ? body.phone.trim()
        : null;
    const message: string | null =
      typeof body.message === "string" && body.message.trim().length > 0
        ? body.message.trim()
        : null;

    const leadSource = leadSourceFromSiteKey(SITE_KEY);
    const consentTimestamp = new Date().toISOString();
    const brokerageId = await resolveBrokerageId();

    const row = {
      brokerage_id: brokerageId,
      entity_kind: "person",
      lifecycle_stage: "lead",
      visibility: "team",
      first_name: firstName,
      last_name: lastName,
      display_name: buildDisplayName(firstName, lastName, email),
      primary_email: email,
      emails: [{ label: "home", address: email }],
      primary_phone: phone,
      phones: [],
      lead_source: leadSource,
      notes: annotatedNotes(message, ipAddress, userAgent),
      tags: ["web-lead", leadSource],
      do_not_contact: false,
      email_opt_out: false,
      sms_opt_out: false,
      marketing_consent: false,
      tcpa_consent: true,
      tcpa_consent_at: consentTimestamp,
      activity_count: 0,
      email_count: 0,
      call_count: 0,
      meeting_count: 0,
      engagement_score: 0,
    };

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase env vars on misraje-site");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("contact").insert(row);

    if (error) {
      console.error("Supabase insert error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { error: "We could not save your message. Please try again." },
        { status: 500 }
      );
    }

    // Notify the team via Brevo. Fail-open: the lead is already saved above, so a
    // mail error must only be logged — it must never 500 the visitor.
    try {
      const brevoKey = process.env.BREVO_API_KEY;
      if (!brevoKey) {
        console.error("BREVO_API_KEY missing; skipping lead notification email");
      } else {
        const displayName = row.display_name;
        const { subject, htmlContent, textContent } = buildLeadEmail({
          displayName,
          email,
          phone,
          message,
          originSite,
          leadSource,
        });

        const mailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({
            sender: { email: "jack@misraje.com", name: "Misraje Web Leads" },
            to: [
              { email: "jack@misraje.com" },
              { email: "karen@misraje.com" },
            ],
            replyTo: { email, name: displayName },
            subject,
            htmlContent,
            textContent,
          }),
        });

        if (!mailRes.ok) {
          const detail = await mailRes.text().catch(() => "");
          console.error(
            "Brevo notification failed:",
            mailRes.status,
            detail.slice(0, 500)
          );
        }
      }
    } catch (mailErr) {
      console.error("Brevo notification exception:", mailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
