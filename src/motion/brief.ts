// Brief builder: five steps, checked as you go, with the ball hopping along a dope sheet.
// Focus moves to each step's heading so screen-reader and keyboard users keep their place.
// An unsent draft is kept in this browser only, and cleared once the brief is sent.
import { fromForm, toText, validate, SERVICE_CHOICES, type Errors } from '../lib/brief';
import { pad } from './lifecycle';

const DRAFT = 'fbf-brief-draft';
const STEP_FIELDS: (keyof Errors)[][] = [['services'], [], ['message'], ['name', 'email'], []];
const LABELS: Record<string, string> = {
  services: 'What you need',
  budget: 'Budget',
  timeline: 'Timeline',
  deadline: 'Deadline',
  message: 'The story',
  links: 'Links',
  name: 'Name',
  email: 'Email',
  organisation: 'Organisation',
};

export function initBrief(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-brief-form]')!;
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('fieldset[data-step]')];
  const cells = [...root.querySelectorAll<HTMLElement>('[data-cell]')];
  const counter = root.querySelector<HTMLElement>('[data-brief-counter]')!;
  const ballBox = root.querySelector<HTMLElement>('.progress')!;
  const ball = root.querySelector<HTMLElement>('[data-brief-ball]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-brief-back]')!;
  const next = form.querySelector<HTMLButtonElement>('[data-brief-next]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-brief-submit]')!;
  const summary = form.querySelector<HTMLElement>('[data-brief-errors]')!;
  const status = form.querySelector<HTMLElement>('[data-brief-status]')!;
  const review = form.querySelector<HTMLElement>('[data-brief-review]')!;
  form.querySelector<HTMLInputElement>('[data-brief-time]')!.value = String(Date.now());
  root.classList.add('is-stepped');
  form.noValidate = true;
  let cur = 0;

  // ---------- draft ----------
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT) ?? 'null');
    if (draft) {
      for (const [k, v] of Object.entries(draft as Record<string, string | string[]>)) {
        form.querySelectorAll<HTMLInputElement>(`[name="${k}"]`).forEach((el) => {
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = ([] as string[]).concat(v).includes(el.value);
          else el.value = String(v);
        });
      }
    }
  } catch {}
  form.addEventListener('input', () => {
    try {
      const b = fromForm(new FormData(form));
      localStorage.setItem(DRAFT, JSON.stringify(b));
    } catch {}
  });

  // ---------- errors ----------
  const showErrors = (errors: Errors, fields: (keyof Errors)[]) => {
    for (const f of fields) {
      const msg = errors[f] ?? '';
      const slot = form.querySelector<HTMLElement>(`[data-error="${f}"]`);
      if (slot) slot.textContent = msg;
      form.querySelectorAll(`[name="${f}"]`).forEach((el) => (msg ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid')));
    }
    const list = fields.filter((f) => errors[f]);
    summary.hidden = !list.length;
    summary.innerHTML = list.length
      ? `<p><strong>Please fix ${list.length === 1 ? 'this' : `these ${list.length} things`}:</strong></p><ul>${list
          .map((f) => `<li><a href="#" data-goto="${f}">${errors[f]}</a></li>`)
          .join('')}</ul>`
      : '';
    if (list.length) summary.focus();
    return list.length === 0;
  };
  summary.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLElement>('[data-goto]');
    if (!a) return;
    e.preventDefault();
    const f = a.dataset.goto as keyof Errors;
    go(STEP_FIELDS.findIndex((s) => s.includes(f)), false);
    form.querySelector<HTMLElement>(`[name="${f}"]`)?.focus();
  });
  const checkStep = (i: number) => showErrors(validate(fromForm(new FormData(form))), STEP_FIELDS[i]);

  // ---------- review ----------
  const renderReview = () => {
    const b = fromForm(new FormData(form));
    const label = (v: string) => SERVICE_CHOICES.find((c) => c.value === v)?.label ?? v;
    const rows = Object.entries({ ...b, services: b.services.map(label).join(', ') }).filter(([, v]) => v);
    review.replaceChildren(
      ...rows.map(([k, v]) => {
        const div = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = LABELS[k] ?? k;
        dd.textContent = String(v);
        div.append(dt, dd);
        return div;
      }),
    );
  };

  // ---------- steps ----------
  function go(i: number, focus = true) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => s.classList.toggle('is-current', k === cur));
    cells.forEach((c, k) => {
      c.classList.toggle('is-current', k === cur);
      c.classList.toggle('is-done', k < cur);
    });
    ballBox.style.setProperty('--step', String(cur));
    ball.style.animation = 'none';
    void ball.offsetWidth;
    ball.style.animation = '';
    counter.textContent = `FRAME ${pad(cur + 1, 2)} / ${pad(steps.length, 2)}`;
    back.hidden = cur === 0;
    next.hidden = cur === steps.length - 1;
    submit.hidden = cur !== steps.length - 1;
    if (cur === steps.length - 1) renderReview();
    status.textContent = `Step ${cur + 1} of ${steps.length}: ${steps[cur].querySelector('legend')!.textContent!.replace(/^\d+\s*/, '')}`;
    if (focus) {
      const legend = steps[cur].querySelector('legend')!;
      legend.tabIndex = -1;
      legend.focus({ preventScroll: true });
      root.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  next.addEventListener('click', () => checkStep(cur) && go(cur + 1));
  back.addEventListener('click', () => {
    summary.hidden = true;
    go(cur - 1);
  });
  // Enter in a single-line field moves forward instead of submitting early.
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && cur < steps.length - 1) {
      e.preventDefault();
      next.click();
    }
  });

  // ---------- send ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = fromForm(new FormData(form));
    const errors = validate(b);
    if (Object.keys(errors).length) {
      const first = STEP_FIELDS.findIndex((s) => s.some((f) => errors[f]));
      go(first, false);
      showErrors(errors, STEP_FIELDS[first]);
      return;
    }
    submit.disabled = true;
    submit.textContent = 'Sending…';
    const payload = Object.fromEntries(['website', 't'].map((k) => [k, String(new FormData(form).get(k) ?? '')]));
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ ...b, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        try {
          localStorage.removeItem(DRAFT);
        } catch {}
        const done = document.createElement('div');
        done.className = 'done';
        done.setAttribute('role', 'status');
        done.innerHTML = '<h2 class="text-3xl" tabindex="-1">Brief received.</h2><p class="mt-3 text-ink-soft"></p>';
        done.querySelector('p')!.textContent = root.dataset.success ?? '';
        form.replaceWith(done);
        cells.forEach((c) => c.classList.add('is-done'));
        counter.textContent = 'FRAME 05 / 05 · SENT';
        done.querySelector('h2')!.focus();
        return;
      }
      if (data.reason === 'invalid' && data.errors) {
        const first = STEP_FIELDS.findIndex((s) => s.some((f) => data.errors[f]));
        go(first, false);
        showErrors(data.errors, STEP_FIELDS[first]);
      } else fallback(b);
    } catch {
      fallback(b);
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send brief';
    }
  });

  function fallback(b: ReturnType<typeof fromForm>) {
    const box = root.querySelector<HTMLElement>('[data-brief-fallback]')!;
    const link = box.querySelector<HTMLAnchorElement>('[data-brief-mailto]')!;
    link.href = `mailto:${root.dataset.email}?subject=${encodeURIComponent(`New brief: ${b.organisation || b.name}`)}&body=${encodeURIComponent(toText(b))}`;
    form.hidden = true;
    box.hidden = false;
    box.querySelector('h2')!.setAttribute('tabindex', '-1');
    box.querySelector<HTMLElement>('h2')!.focus();
  }

  go(0, false);
}
