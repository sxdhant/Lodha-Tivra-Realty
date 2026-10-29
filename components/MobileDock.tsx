'use client';

import { useEffect, useState } from 'react';
import { CalendarIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { WhatsAppLink } from '@/components/WhatsAppLink';
import { site } from '@/lib/site';

const GREETING = 'Hello, I would like to know more about Lodha residences in Bengaluru.';

// Call, WhatsApp and Enquire, pinned to the foot of the screen on phones once the visitor has
// scrolled past the hero; it leaves again if they scroll back up into it. Hidden from 48rem up.
export function MobileDock() {
  const [shown, setShown] = useState(false);
  const { openQuickEnquiry } = useResidenceUI();

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`dock${shown ? ' is-shown' : ''}`} aria-label="Contact us">
      <a className="dock__action dock__action--call" href={site.phone.href}>
        <PhoneIcon />
        Call
      </a>
      <WhatsAppLink className="dock__action dock__action--whatsapp" message={GREETING}>
        <WhatsAppIcon />
        WhatsApp<span className="visually-hidden"> (opens WhatsApp)</span>
      </WhatsAppLink>
      <a
        className="dock__action dock__action--enquire"
        href="#visit"
        onClick={(event) => {
          event.preventDefault();
          openQuickEnquiry();
        }}
      >
        <CalendarIcon />
        Enquire
      </a>
    </nav>
  );
}
