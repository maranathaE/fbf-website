// Brief validation, shared by the browser (step checks) and /api/brief (the real check).

export interface Brief {
  services: string[];
  budget: string;
  timeline: string;
  deadline: string;
  message: string;
  links: string;
  name: string;
  email: string;
  organisation: string;
}

export const SERVICE_CHOICES = [
  { value: 'animation', label: 'Animation' },
  { value: 'production', label: 'Content production' },
  { value: 'live', label: 'Live streaming' },
  { value: 'other', label: 'Something else' },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type Errors = Partial<Record<keyof Brief, string>>;

export function validate(b: Brief): Errors {
  const e: Errors = {};
  if (!b.services.length) e.services = 'Pick at least one thing you need.';
  if (b.message.trim().length < 20) e.message = 'Tell us a little more: at least 20 characters.';
  if (b.message.length > 5000) e.message = 'Please keep it under 5,000 characters.';
  if (!b.name.trim()) e.name = 'Enter your name.';
  if (!EMAIL.test(b.email.trim())) e.email = 'Enter an email address like name@example.com.';
  return e;
}

/** Reads a brief from FormData (browser or server), trimming and capping every field. */
export function fromForm(data: FormData): Brief {
  const s = (k: string, max = 300) => String(data.get(k) ?? '').trim().slice(0, max);
  return {
    services: data.getAll('services').map(String).filter((v) => SERVICE_CHOICES.some((c) => c.value === v)),
    budget: s('budget'),
    timeline: s('timeline'),
    deadline: s('deadline', 20),
    message: s('message', 5000),
    links: s('links', 1000),
    name: s('name'),
    email: s('email'),
    organisation: s('organisation'),
  };
}

export function toText(b: Brief) {
  const label = (v: string) => SERVICE_CHOICES.find((c) => c.value === v)?.label ?? v;
  const head = [
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.organisation && `Organisation: ${b.organisation}`,
    `Needs: ${b.services.map(label).join(', ')}`,
    b.budget && `Budget: ${b.budget}`,
    b.timeline && `Timeline: ${b.timeline}`,
    b.deadline && `Deadline: ${b.deadline}`,
  ].filter(Boolean);
  return [head.join('\n'), b.message, b.links && `Links:\n${b.links}`].filter(Boolean).join('\n\n');
}
