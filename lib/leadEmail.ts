// Shared builder for the internal "new lead" notification email.
//
// Presentation only. Given the lead fields, it returns the Brevo subject, the
// branded HTML body, and a plain-text fallback. Keep this file byte-identical
// across misraje-site, laurelwood-site, and fryman-estates so every site's
// alert renders the same. No em dashes or en dashes anywhere in the copy.

export interface LeadEmailInput {
  displayName: string;
  email: string;
  phone: string | null;
  message: string | null;
  originSite: string;
  leadSource: string;
}

export interface LeadEmail {
  subject: string;
  htmlContent: string;
  textContent: string;
}

// Human-readable label for the originating site (originSite has any leading
// "www." already stripped). Falls back to the raw host when unmapped.
const SITE_FRIENDLY: Record<string, string> = {
  "laurelwoodestates.com": "Laurelwood Estates",
  "eastlaurelwood.com": "East Laurelwood",
  "westlaurelwood.com": "West Laurelwood",
  "thedonastreets.com": "The Dona Streets",
  "frymanestates.com": "Fryman Canyon Estates",
  "misraje.com": "Misraje Real Estate",
  "trose.com": "Trose",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildLeadEmail(input: LeadEmailInput): LeadEmail {
  const { displayName, email, phone, message, originSite, leadSource } = input;

  const phoneValue = phone ?? "(not provided)";
  const messageValue = message ?? "(none)";
  const siteFriendly = SITE_FRIENDLY[originSite] ?? originSite;
  const emailHref = encodeURIComponent(email);

  const subject = `New lead from ${originSite}: ${displayName}`;

  const textContent = [
    `New lead from ${originSite}`,
    "",
    `Name: ${displayName}`,
    `Email: ${email}`,
    `Phone: ${phoneValue}`,
    `Message: ${messageValue}`,
    `Site: ${originSite}`,
    `Lead source: ${leadSource}`,
    "",
    `Sent automatically from the ${originSite} contact form. Reply directly to reach this lead.`,
  ].join("\n");

  const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="format-detection" content="telephone=no"><meta name="color-scheme" content="light only"></head>
<body style="margin:0; padding:0; background:#f0f2f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f2f5; padding:24px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px; width:100%; background:#ffffff; border-radius:8px; overflow:hidden; font-family:Arial,Helvetica,sans-serif;">

  <!-- HEADER -->
  <tr><td style="background:#001D38; padding:28px 36px; text-align:center;">
    <div style="color:#ffffff; font-size:20px; font-weight:bold; letter-spacing:0.5px; margin-bottom:4px;">Misraje Real Estate Partners</div>
    <div style="color:#c8a96e; font-size:12px; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:20px;">Jack Misraje &amp; Karen Misraje</div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:420px; margin:0 auto;">
      <tr>
        <td style="text-align:center; padding:0 12px; border-right:1px solid rgba(255,255,255,0.2); vertical-align:top;">
          <div style="color:#ffffff; font-size:13px; font-weight:bold; margin-bottom:5px;">Jack Misraje</div>
          <div style="color:rgba(255,255,255,0.75); font-size:12px; line-height:1.7;">
            <a href="mailto:jack@misraje.com" style="color:#ffffff; text-decoration:none;">jack@misraje.com</a><br>
            <span style="color:rgba(255,255,255,0.75);">323-209-5225</span>
          </div>
        </td>
        <td style="text-align:center; padding:0 12px; vertical-align:top;">
          <div style="color:#ffffff; font-size:13px; font-weight:bold; margin-bottom:5px;">Karen Misraje</div>
          <div style="color:rgba(255,255,255,0.75); font-size:12px; line-height:1.7;">
            <a href="mailto:karen@misraje.com" style="color:#ffffff; text-decoration:none;">karen@misraje.com</a><br>
            <span style="color:rgba(255,255,255,0.75);">310-488-1030</span>
          </div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- GOLD ACCENT BAR -->
  <tr><td style="height:4px; background:#c8a96e; font-size:0; line-height:0;">&nbsp;</td></tr>

  <!-- NEW LEAD BANNER -->
  <tr><td style="background:#f7f4ee; padding:16px 36px; text-align:center; border-bottom:1px solid #e8e0d0;">
    <div style="color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px;">New Lead</div>
    <div style="color:#001D38; font-size:17px; font-weight:bold;">Generated from: ${escapeHtml(siteFriendly)}</div>
  </td></tr>

  <!-- FIELDS -->
  <tr><td style="padding:28px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:0 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Name</td></tr>
      <tr><td style="padding:0 0 16px 0; color:#222222; font-size:15px; border-bottom:1px solid #eeeeee;">${escapeHtml(displayName)}</td></tr>

      <tr><td style="padding:16px 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Email</td></tr>
      <tr><td style="padding:0 0 16px 0; font-size:15px; border-bottom:1px solid #eeeeee;"><a href="mailto:${emailHref}" style="color:#001D38; text-decoration:underline;">${escapeHtml(email)}</a></td></tr>

      <tr><td style="padding:16px 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Phone</td></tr>
      <tr><td style="padding:0 0 16px 0; color:#222222; font-size:15px; border-bottom:1px solid #eeeeee;">${escapeHtml(phoneValue)}</td></tr>

      <tr><td style="padding:16px 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Message</td></tr>
      <tr><td style="padding:0 0 16px 0; color:#222222; font-size:15px; line-height:1.6; border-bottom:1px solid #eeeeee;">${escapeHtml(messageValue).replace(/\n/g, "<br>")}</td></tr>

      <tr><td style="padding:16px 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Generated From</td></tr>
      <tr><td style="padding:0 0 16px 0; color:#222222; font-size:15px; border-bottom:1px solid #eeeeee;">${escapeHtml(siteFriendly)}</td></tr>

      <tr><td style="padding:16px 0 6px 0; color:#c8a96e; font-size:12px; font-weight:bold; letter-spacing:0.08em; text-transform:uppercase;">Lead Source</td></tr>
      <tr><td style="padding:0; color:#222222; font-size:15px;">${escapeHtml(leadSource)}</td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#001D38; padding:16px 36px; text-align:center;">
    <div style="color:rgba(255,255,255,0.7); font-size:11px; line-height:1.6;">This lead was submitted through your website contact form.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, htmlContent, textContent };
}
