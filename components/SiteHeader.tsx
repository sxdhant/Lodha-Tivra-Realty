'use client';

import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { CloseIcon, MenuIcon } from '@/components/icons';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { site } from '@/lib/site';

const NAV = [
  { href: '#projects', label: 'Projects' },
  { href: '#where', label: 'Locations' },
  { href: '#lodha', label: 'About Lodha' },
  { href: '#visit', label: 'Visit' },
];

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const { openQuickEnquiry } = useResidenceUI();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Transparent over the hero, solid everywhere else.
  useEffect(() => {
    const header = headerRef.current;
    const hero = document.getElementById('top');
    if (!header || !hero) {
      setSolid(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      rootMargin: `-${header.offsetHeight}px 0px 0px 0px`,
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Slides away while the visitor scrolls down and returns as soon as they scroll back up.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Clamped, so the bounce past either end of the page on phones doesn't count as a direction.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), max);
      if (y <= header.offsetHeight) setHidden(false);
      else if (y > lastY + 8) setHidden(true);
      else if (y < lastY - 8) setHidden(false);
      else return; // too small to count: measure the next move from the same point
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // The menu is for small screens only; close it if the window widens.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) menuRef.current?.close();
    };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header ref={headerRef} className={`site-header${solid ? ' is-solid' : ''}${hidden ? ' is-hidden' : ''}`}>
        <div className="site-header__inner wrap">
          <a className="brand" href="#top" aria-label={`${site.name}, back to top`}>
            <BrandLogo variant="reversed" className="brand__reversed" alt="" preload />
            <BrandLogo variant="original" className="brand__original" alt="" loading="eager" />
          </a>
          <nav className="site-nav" aria-label="Primary">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            className="button button--small header-cta"
            href="#visit"
            onClick={(event) => {
              event.preventDefault();
              openQuickEnquiry();
            }}
          >
            <span className="header-cta__short">Enquire</span>
            <span className="header-cta__long">Request a viewing</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Menu"
            aria-haspopup="dialog"
            aria-controls="menu"
            onClick={() => menuRef.current?.showModal()}
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <dialog
        ref={menuRef}
        className="menu"
        id="menu"
        aria-label="Menu"
        onClick={(event) => {
          // A click on the dim backdrop lands on the dialog itself.
          if (event.target === event.currentTarget || (event.target as Element).closest('a, [data-menu-close]')) {
            menuRef.current?.close();
          }
        }}
      >
        <div className="menu__inner">
          <div className="menu__top">
            <span className="brand">
              <BrandLogo variant="reversed" />
            </span>
            <button className="menu-toggle" type="button" aria-label="Close menu" data-menu-close>
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Menu">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            className="button button--light hero__cta"
            href="#visit"
            onClick={(event) => {
              event.preventDefault();
              openQuickEnquiry();
            }}
          >
            Enquire now
            <span className="hero__cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>
      </dialog>
    </>
  );
}
