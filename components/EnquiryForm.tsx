'use client';

import { useEffect, useRef, useState } from 'react';
import { useResidenceUI, type EnquiryPurpose } from '@/components/ResidenceProvider';
import { Select } from '@/components/Select';
import { enquirableResidences } from '@/lib/residences';
import { EnquiryThanks } from '@/components/EnquiryThanks';
import { sendEnquiry } from '@/lib/enquiry';
import { site } from '@/lib/site';

type Values = {
  name: string;
  phone: string;
  email: string;
  purpose: EnquiryPurpose;
  residence: string;
  message: string;
  consent: boolean;
};

type CheckedField = 'name' | 'phone' | 'email' | 'consent';
type Errors = Partial<Record<CheckedField, string>>;

const CHECKED_FIELDS: CheckedField[] = ['name', 'phone', 'email', 'consent'];

const rules: Record<CheckedField, (values: Values) => string | null> = {
  name: (v) => (v.name.trim().length >= 2 ? null : 'Enter your full name.'),
  phone: (v) => {
    const digits = v.phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15
      ? null
      : 'Enter a phone number with at least 10 digits, including the country code if you are outside India.';
  },
  // Optional for a viewing; the brochure is sent by email, so it needs one.
  email: (v) => {
    const email = v.email.trim();
    if (email === '' && v.purpose === 'viewing') return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? null : 'Enter an email address in the format name@example.com.';
  },
  consent: (v) => (v.consent ? null : 'Tick this box so we can contact you about your request.'),
};

const isChecked = (key: keyof Values): key is CheckedField => (CHECKED_FIELDS as string[]).includes(key);

const INITIAL: Values = {
  name: '',
  phone: '',
  email: '',
  purpose: 'viewing',
  residence: 'any',
  message: '',
  consent: true,
};

export function EnquiryForm() {
  const { enquiryRequest } = useResidenceUI();
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const fieldRefs = useRef<Partial<Record<CheckedField, HTMLInputElement | null>>>({});

  // Enquire, Brochure or "Request a viewing" on a residence lands here with that residence and request chosen.
  useEffect(() => {
    if (!enquiryRequest) return;
    setStatus('idle');
    setValues((current) => ({
      ...current,
      purpose: enquiryRequest.purpose,
      residence: enquirableResidences.some((r) => r.id === enquiryRequest.id) ? enquiryRequest.id : current.residence,
    }));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('visit')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    fieldRefs.current.name?.focus({ preventScroll: true });
  }, [enquiryRequest]);

  const check = (field: CheckedField, next: Values) => {
    const message = rules[field](next);
    setErrors((current) => ({ ...current, [field]: message ?? undefined }));
    return message === null;
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Once a field has been flagged, keep re-checking it while the visitor fixes it.
    if (isChecked(key) && errors[key]) check(key, next);
  };

  // Check a text field when the visitor leaves it, if they typed something.
  const checkOnBlur = (field: Exclude<CheckedField, 'consent'>) => {
    if (values[field] !== '') check(field, values);
  };

  // The request is emailed to the team (see app/api/enquiry/route.ts), then the visitor sees a thank-you message.
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    const nextErrors: Errors = {};
    for (const field of CHECKED_FIELDS) {
      const message = rules[field](values);
      if (message) nextErrors[field] = message;
    }
    setErrors(nextErrors);
    const firstInvalid = CHECKED_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus('sending');
    const sent = await sendEnquiry({
      source: 'form',
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      purpose: values.purpose,
      residence: values.residence,
      message: values.message.trim(),
      website: honeypot,
    });
    setStatus(sent ? 'sent' : 'error');
  };

  const describedBy = (field: CheckedField, hint?: string) =>
    [hint, errors[field] ? `f-${field}-error` : null].filter(Boolean).join(' ') || undefined;

  if (status === 'sent') {
    return (
      <EnquiryThanks
        name={values.name}
        purpose={values.purpose}
        action={
          <button
            className="button"
            type="button"
            onClick={() => {
              setValues(INITIAL);
              setErrors({});
              setStatus('idle');
            }}
          >
            Send another request
          </button>
        }
      />
    );
  }

  return (
    <form className="enquiry" noValidate onSubmit={onSubmit}>
      <p className="enquiry__note">All fields are required unless marked optional.</p>

      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="f-website">Leave this field empty</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-name">Full name</label>
        <input
          ref={(el) => {
            fieldRefs.current.name = el;
          }}
          id="f-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy('name')}
          onChange={(e) => update('name', e.target.value)}
          onBlur={() => checkOnBlur('name')}
        />
        <FieldError id="f-name-error" message={errors.name} />
      </div>

      <div className="field">
        <label htmlFor="f-phone">Phone</label>
        <input
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          id="f-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={values.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy('phone')}
          onChange={(e) => update('phone', e.target.value)}
          onBlur={() => checkOnBlur('phone')}
        />
        <FieldError id="f-phone-error" message={errors.phone} />
      </div>

      <div className="field">
        <label htmlFor="f-email">
          Email {values.purpose === 'viewing' && <span className="field__optional">(optional)</span>}
        </label>
        <input
          ref={(el) => {
            fieldRefs.current.email = el;
          }}
          id="f-email"
          name="email"
          type="email"
          autoComplete="email"
          required={values.purpose === 'brochure'}
          value={values.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
          onChange={(e) => update('email', e.target.value)}
          onBlur={() => checkOnBlur('email')}
        />
        <FieldError id="f-email-error" message={errors.email} />
      </div>

      <div className="field">
        <label htmlFor="f-residence">Project</label>
        <Select
          id="f-residence"
          name="residence"
          value={values.residence}
          onChange={(value) => update('residence', value)}
          options={[
            { value: 'any', label: 'Not decided yet' },
            ...enquirableResidences.map((r) => ({ value: r.id, label: r.name, hint: r.area })),
          ]}
        />
      </div>

      <div className="field field--full">
        <label htmlFor="f-message">
          Anything we should know <span className="field__optional">(optional)</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={2}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>

      <div className="field field--full consent">
        <label className="consent__label">
          <input
            ref={(el) => {
              fieldRefs.current.consent = el;
            }}
            id="f-consent"
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy('consent')}
            onChange={(e) => update('consent', e.target.checked)}
          />
          <span>I agree to be contacted about this request by phone, email or WhatsApp.</span>
        </label>
        <FieldError id="f-consent-error" message={errors.consent} />
      </div>

      <div className="enquiry__submit field--full">
        {status === 'error' && (
          <p className="field__error" role="alert">
            We could not send your request. Please try again, or call us on {site.phone.display}.
          </p>
        )}
        <button className="button" type="submit" disabled={status === 'sending'}>
          {status === 'sending'
            ? 'Sending…'
            : values.purpose === 'brochure'
              ? 'Request the brochure'
              : 'Request a site visit'}
        </button>
      </div>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p className="field__error" id={id} hidden={!message}>
      {message}
    </p>
  );
}
