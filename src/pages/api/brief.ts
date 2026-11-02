// Receives briefs from /contact. Where they go is a CMS setting ("Brief inbox"):
// an email to every listed address (via Resend), and optionally a copy saved in the CMS.
// If neither is set up yet, it answers 503 and the form offers a pre-filled email instead,
// so a brief is never silently dropped.
import type { APIRoute } from 'astro';
import { fromForm, toText, validate, type Brief } from '../../lib/brief';
import { writeClient } from '../../lib/sanity';

export const prerender = false;

type InboxSettings = { recipients?: string[]; storeCopy?: boolean; subjectPrefix?: string };

async function sendEmail(b: Brief, to: string[], prefix: string) {
  const key = import.meta.env.RESEND_API_KEY;
  if (!key || !to.length) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: import.meta.env.BRIEF_FROM_EMAIL || 'Frame by Frame <briefs@fbf.studio>',
      to,
      reply_to: b.email,
      subject: `${prefix}: ${b.organisation || b.name}`,
      text: toText(b),
    }),
  });
  if (!res.ok) console.error('brief: email failed', res.status, await res.text());
  return res.ok;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const isForm = !request.headers.get('content-type')?.includes('application/json');
  const data = isForm ? await request.formData() : objectToForm(await request.json());
  const reply = (status: number, body: Record<string, unknown>) =>
    isForm
      ? redirect(status < 300 ? '/contact/sent' : '/contact/problem', 303)
      : new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  // Spam traps: a hidden field people never fill, and forms sent impossibly fast.
  const started = Number(data.get('t'));
  if (data.get('website') || (started && Date.now() - started < 3000)) return reply(200, { ok: true });

  const brief = fromForm(data);
  const errors = validate(brief);
  if (Object.keys(errors).length) return reply(422, { ok: false, reason: 'invalid', errors });

  const sanity = writeClient();
  const inbox: InboxSettings = (await sanity?.fetch(`*[_id == "secrets.briefSettings"][0]{recipients, storeCopy, subjectPrefix}`)) ?? {};
  const recipients = inbox.recipients?.filter(Boolean) ?? [];

  const emailed = await sendEmail(brief, recipients, inbox.subjectPrefix || 'New brief').catch(() => false);
  let stored = false;
  if (sanity && (inbox.storeCopy ?? true)) {
    // "briefs." in the ID keeps the document private: only staff and this server can read it.
    await sanity
      .create({ _id: `briefs.${crypto.randomUUID()}`, _type: 'briefSubmission', receivedAt: new Date().toISOString(), ...brief, emailed })
      .then(() => (stored = true))
      .catch((err) => console.error('brief: store failed', err));
  }

  if (!emailed && !stored) return reply(503, { ok: false, reason: 'not-configured' });
  return reply(200, { ok: true });
};

function objectToForm(obj: Record<string, unknown>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj ?? {})) {
    for (const item of Array.isArray(v) ? v : [v]) f.append(k, String(item ?? ''));
  }
  return f;
}
