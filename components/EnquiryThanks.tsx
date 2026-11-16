'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Shown in place of an enquiry form once the request has gone through.
export function EnquiryThanks({
  name,
  purpose,
  action,
  titleId,
}: {
  name: string;
  purpose: 'viewing' | 'brochure';
  action: ReactNode;
  titleId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firstName = name.trim().split(/\s+/)[0];

  // Moves keyboard and screen reader users to the message, since the form they were in has gone.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="thanks" ref={ref} tabIndex={-1} role="status">
      <h3 className="thanks__title" id={titleId}>
        Thank you{firstName ? `, ${firstName}` : ''}.
      </h3>
      <p className="thanks__text">
        We have your request for {purpose === 'brochure' ? 'the brochure' : 'a site visit'}. A member of our team will
        be in touch with you shortly.
      </p>
      {action}
    </div>
  );
}
