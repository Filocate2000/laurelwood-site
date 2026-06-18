// Shared builder for the internal "new lead" notification email.
//
// Presentation only. Given the lead fields, it returns the Brevo subject, a
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

// Corporate palette.
const NAVY = "#001D38";
const GOLD = "#c8a96e";
const PAGE_BG = "#f3f4f6";
const CARD_BG = "#ffffff";
const BORDER = "#e5e7eb";
const TEXT = "#1f2937";
const NAVY_MUTED = "#9fb0c2";

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

  const emailCell = `<a href="mailto:${escapeHtml(
    email
  )}" style="color:${NAVY};text-decoration:underline;">${escapeHtml(email)}</a>`;

  const rows: Array<[string, string]> = [
    ["Name", escapeHtml(displayName)],
    ["Email", emailCell],
    ["Phone", escapeHtml(phoneValue)],
    ["Message", escapeHtml(messageValue).replace(/\n/g, "<br>")],
    ["Site", escapeHtml(originSite)],
    ["Lead source", escapeHtml(leadSource)],
  ];

  const fieldRows = rows
    .map(([label, value], i) => {
      const topBorder = i === 0 ? "" : `border-top:1px solid ${BORDER};`;
      return `
                <tr>
                  <td style="padding:16px 0;${topBorder}font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};font-weight:bold;margin:0 0 5px 0;">${label}</div>
                    <div style="font-size:15px;line-height:1.6;color:${TEXT};">${value}</div>
                  </td>
                </tr>`;
    })
    .join("");

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background-color:${CARD_BG};border-radius:8px;overflow:hidden;border:1px solid ${BORDER};">

          <tr>
            <td style="background-color:${NAVY};padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:28px 32px 24px 32px;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-weight:bold;">New Lead</p>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.25;color:#ffffff;">${escapeHtml(
                      originSite
                    )}</p>
                    <p style="margin:6px 0 0 0;font-size:13px;color:${NAVY_MUTED};">Misraje Real Estate Partners</p>
                  </td>
                </tr>
                <tr><td style="height:3px;line-height:3px;font-size:0;background-color:${GOLD};">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 32px 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${fieldRows}
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:${NAVY};padding:18px 32px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${NAVY_MUTED};">
                Sent automatically from the ${escapeHtml(
                  originSite
                )} contact form. Reply directly to reach this lead.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, htmlContent, textContent };
}
