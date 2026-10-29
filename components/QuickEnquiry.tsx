'use client';

import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from '@/components/icons';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { enquirableResidences } from '@/lib/residences';
import { openWhatsApp } from '@/lib/openWhatsApp';

type Errors = { name?: string; phone?: string };

// The small pop-up behind every Enquire button: name, phone and project.
export function QuickEnquiry() {
  const { quickEnquiry, closeQuickEnquiry } = useResidenceUI();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState('any');
  const [purpose, setPurpose] = useState<'viewing' | 'brochure'>('viewing');
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (quickEnquiry && !dialog.open) {
      setResidence(enquirableResidences.some((r) => r.id === quickEnquiry.residence) ? quickEnquiry.residence : 'any');
      setPurpose(quickEnquiry.purpose);
      setErrors({});
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!quickEnquiry && dialog.open) {
      dialog.close();
    }
  }, [quickEnquiry]);

  const check = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) next.phone = 'Enter a phone number with at least 10 digits.';
    return next;
  };

  // The enquiry goes out as a WhatsApp message, with what the visitor filled in typed into it.
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = check();
    setErrors(next);
    if (next.name) return nameRef.current?.focus();
    if (next.phone) return phoneRef.current?.focus();

    const project = enquirableResidences.find((r) => r.id === residence)?.name;
    const brochure = purpose === 'brochure';
    const message = [
      brochure
        ? `Hello, I would like the brochure for ${project ?? 'your Lodha projects in Bengaluru'}.`
        : project
          ? `Hello, I would like to enquire about ${project}.`
          : 'Hello, I would like to know more about Lodha residences in Bengaluru.',
      '',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Project: ${project ?? 'Not decided yet'}`,
      ...(brochure ? ['Request: Brochure'] : []),
    ].join('\n');
    // Straight to WhatsApp, with the message already typed.
    openWhatsApp(message);
  };

  return (
    <dialog
      ref={dialogRef}
      className="quick"
      aria-labelledby="quick-title"
      onClose={closeQuickEnquiry}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <button
        className="quick__close"
        type="button"
        aria-label="Close enquiry form"
        onClick={() => dialogRef.current?.close()}
      >
        <CloseIcon />
      </button>

      <form className="quick__body" noValidate onSubmit={onSubmit}>
          <h2 className="quick__title" id="quick-title">
            {purpose === 'brochure' ? 'Get the brochure' : 'Enquire now'}
          </h2>
          <p className="quick__lede">
            {purpose === 'brochure'
              ? 'Leave your details and we will send the brochure on WhatsApp.'
              : 'Leave your details and we will pick the chat up on WhatsApp.'}
          </p>

          <div className="field">
            <label htmlFor="q-name">Name</label>
            <input
              ref={nameRef}
              id="q-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'q-name-error' : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((c) => ({ ...c, name: undefined }));
              }}
            />
            <p className="field__error" id="q-name-error" hidden={!errors.name}>
              {errors.name}
            </p>
          </div>

          <div className="field">
            <label htmlFor="q-phone">Phone number</label>
            <input
              ref={phoneRef}
              id="q-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={phone}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'q-phone-error' : undefined}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((c) => ({ ...c, phone: undefined }));
              }}
            />
            <p className="field__error" id="q-phone-error" hidden={!errors.phone}>
              {errors.phone}
            </p>
          </div>

          <div className="field">
            <label htmlFor="q-project">Project</label>
            <select id="q-project" name="residence" value={residence} onChange={(e) => setResidence(e.target.value)}>
              <option value="any">Not decided yet</option>
              {enquirableResidences.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <button className="button quick__send" type="submit">
            Send enquiry
          </button>
          <p className="quick__fine">By sending, you agree to be contacted about this request by phone or WhatsApp.</p>
        </form>
    </dialog>
  );
}
