import { whatsappHref } from '@/lib/site';

const NUMBER = '918709808869';

// Opens a WhatsApp chat with the firm with `message` typed in, without WhatsApp's "Open app / Continue to
// WhatsApp Web" page. On a phone it opens the app directly (the whatsapp:// link); if the app does not take
// over, it falls back to the wa.me link after a moment. On a computer it opens WhatsApp Web in a new tab.
export function openWhatsApp(message: string) {
  const text = encodeURIComponent(message);
  const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isPhone) {
    window.open(`https://web.whatsapp.com/send?phone=${NUMBER}&text=${text}`, '_blank', 'noopener');
    return;
  }

  window.location.href = `whatsapp://send?phone=${NUMBER}&text=${text}`;
  window.setTimeout(() => {
    // The page is hidden once the app has opened; only a visitor still here needs the fallback.
    if (!document.hidden) window.location.href = whatsappHref(message);
  }, 1500);
}
