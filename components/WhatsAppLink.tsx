'use client';

import { openWhatsApp } from '@/lib/openWhatsApp';
import { whatsappHref } from '@/lib/site';

// A link to a WhatsApp chat that opens the app directly (see lib/openWhatsApp.ts). Without JavaScript it is a
// plain wa.me link.
export function WhatsAppLink({
  message,
  children,
  ...rest
}: { message: string; children: React.ReactNode } & Omit<React.ComponentProps<'a'>, 'href' | 'onClick'>) {
  return (
    <a
      {...rest}
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener"
      onClick={(event) => {
        event.preventDefault();
        openWhatsApp(message);
      }}
    >
      {children}
    </a>
  );
}
