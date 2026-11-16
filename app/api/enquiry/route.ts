import { enquirableResidences } from '@/lib/residences';
import { site } from '@/lib/site';

// Passes each enquiry from the landing page on to the team in two ways, and either one is enough:
//   - an email, through Resend (https://resend.com)
//   - a new row in a Google Sheet, through a Google Apps Script web app (see docs/enquiry-sheet.md)
// Set these in the host's environment variables:
//   RESEND_API_KEY            the API key from Resend (email is skipped without it)
//   ENQUIRY_TO_EMAIL          who receives the emails (comma separated for several); defaults to the site email
//   ENQUIRY_FROM_EMAIL        the sender, e.g. "Tivra Realty <enquiries@tivrarealty.com>" once the domain is verified
//                             in Resend; until then Resend only allows its test sender, which is the default here
//   ENQUIRY_WEBHOOK_URL       the Apps Script web app address (the sheet is skipped without it)
//   ENQUIRY_WEBHOOK_SECRET    a password the script checks, so only this site can add rows

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Enquiry = {
  name: string;
  phone: string;
  email: string;
  project: string;
  request: string;
  note: string;
  source: string;
};

async function sendEmail(apiKey: string, enquiry: Enquiry): Promise<boolean> {
  const rows: [string, string][] = [
    ['Name', enquiry.name],
    ['Phone', enquiry.phone],
    ['Email', enquiry.email || 'Not given'],
    ['Project', enquiry.project],
    ['Request', enquiry.request],
    ['Note', enquiry.note || 'None'],
    ['Sent from', enquiry.source],
  ];
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL ?? 'Lodha Landing Page <onboarding@resend.dev>',
        to: (process.env.ENQUIRY_TO_EMAIL ?? site.email)
          .split(',')
          .map((address) => address.trim())
          .filter(Boolean),
        subject: `New enquiry: ${enquiry.project} · ${enquiry.request} · ${enquiry.name}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
        html:
          `<p>A new enquiry came in from the landing page.</p><table cellpadding="6">` +
          rows.map(([label, value]) => `<tr><td><b>${label}</b></td><td>${escapeHtml(value)}</td></tr>`).join('') +
          `</table>`,
        // Replying to the email goes to the visitor, when they gave an address.
        ...(enquiry.email ? { reply_to: enquiry.email } : {}),
      }),
    });
    if (!response.ok) console.error('Enquiry email failed:', response.status, await response.text());
    return response.ok;
  } catch (error) {
    console.error('Enquiry email failed:', error);
    return false;
  }
}

async function saveToSheet(url: string, enquiry: Enquiry): Promise<boolean> {
  try {
    // Apps Script answers a POST with a redirect to the result, which fetch follows.
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...enquiry, secret: process.env.ENQUIRY_WEBHOOK_SECRET ?? '' }),
    });
    const reply = (await response.text()).trim();
    if (!response.ok || reply !== 'ok') console.error('Enquiry sheet failed:', response.status, reply.slice(0, 200));
    return response.ok && reply === 'ok';
  } catch (error) {
    console.error('Enquiry sheet failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // The hidden field is filled in: a bot. Say it worked and send nothing.
  if (text(body.website, 200)) return Response.json({ ok: true });

  const enquiry: Enquiry = {
    name: text(body.name, 100),
    phone: text(body.phone, 30),
    email: text(body.email, 120),
    project: enquirableResidences.find((r) => r.id === text(body.residence, 60))?.name ?? 'Not decided yet',
    request: body.purpose === 'brochure' ? 'Brochure' : 'Site visit',
    note: text(body.message, 1000),
    source: body.source === 'quick' ? 'Enquire pop-up' : 'Enquiry form',
  };

  const digits = enquiry.phone.replace(/\D/g, '');
  if (
    enquiry.name.length < 2 ||
    digits.length < 10 ||
    digits.length > 15 ||
    (enquiry.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email))
  ) {
    return Response.json({ error: 'Please check your details.' }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const sheetUrl = process.env.ENQUIRY_WEBHOOK_URL;
  if (!resendKey && !sheetUrl) {
    console.error('Enquiry not sent: set RESEND_API_KEY and/or ENQUIRY_WEBHOOK_URL.');
    return Response.json({ error: 'Not configured.' }, { status: 503 });
  }

  // Both run at once. The visitor gets a thank-you if at least one of them went through.
  const results = await Promise.all([
    resendKey ? sendEmail(resendKey, enquiry) : null,
    sheetUrl ? saveToSheet(sheetUrl, enquiry) : null,
  ]);
  if (!results.includes(true)) return Response.json({ error: 'Could not send.' }, { status: 502 });
  return Response.json({ ok: true });
}
