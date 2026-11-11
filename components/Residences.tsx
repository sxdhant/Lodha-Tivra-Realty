'use client';

import Image, { getImageProps } from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PinIcon, PlusIcon } from '@/components/icons';
import { Monument } from '@/components/Monument';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { PRICE_NOTE, residences, type Residence, type ResidenceStatus } from '@/lib/residences';

type Filter = 'all' | ResidenceStatus;

// A status is offered only when some project has it. With a single status there is nothing to filter.
const FILTERS = ([
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'launching', label: 'Launching' },
  { value: 'completed', label: 'Completed' },
] satisfies { value: Filter; label: string }[]).filter(
  (option) => option.value === 'all' || residences.some((r) => r.status === option.value)
);

const matches = (filter: Filter) => residences.filter((r) => filter === 'all' || r.status === filter);

export function Residences() {
  const { openResidence, openQuickEnquiry } = useResidenceUI();
  const [filter, setFilter] = useState<Filter>('all');
  const [announcement, setAnnouncement] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const visible = matches(filter);

  const applyFilter = (value: Filter) => {
    const next = matches(value);
    setFilter(value);
    setAnnouncement(`Showing ${next.length} ${next.length === 1 ? 'project' : 'projects'}`);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      listRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease-out' });
    }
  };

  return (
    <section className="residences" id="projects" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="residences__head grid">
          <h2 className="residences__title" id="projects-title">
            Projects in <em className="residences__place">Bengaluru</em>
          </h2>
          <Monument />
          <p className="residences__intro">
            Lodha residences across Bengaluru, from Sarjapur Road in the south-east to the lakefront towers of Akshayanagar in the south.
          </p>
          {FILTERS.length > 2 && (
            <>
              <div className="filter" role="group" aria-label="Filter projects by status">
                {FILTERS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="filter__option"
                    aria-pressed={filter === option.value}
                    onClick={() => applyFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <p className="visually-hidden" aria-live="polite">
                {announcement}
              </p>
            </>
          )}
        </div>

        <ul className="residence-list" ref={listRef}>
          {visible.map((r) => (
            <li key={r.id} id={r.id} className="residence">
              <figure className="residence__media">
                <CardPhoto residence={r} />
                {(r.tag || r.tags) && (
                  <ul className="residence__tags">
                    {r.tag && <li className="residence__tag">{r.tag}</li>}
                    {r.tags?.map((tag) => (
                      <li key={tag} className="residence__chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </figure>
              <div className="residence__summary">
                <div className="residence__top">
                  <div className="residence__heading">
                    <h3 className="residence__name">
                      <button
                        className="residence__open"
                        type="button"
                        aria-haspopup="dialog"
                        onClick={(event) => openResidence(r.id, event.currentTarget)}
                      >
                        {r.name}
                      </button>
                    </h3>
                    <p className="residence__area">
                      <PinIcon />
                      <span className="visually-hidden">Location: </span>
                      {r.area}, Bengaluru
                    </p>
                  </div>
                  <span className="residence__icon" aria-hidden="true">
                    <PlusIcon />
                  </span>
                </div>
                <Description id={`${r.id}-line`} text={r.line} />
                <dl className="residence__meta">
                  <div>
                    <dt>Type</dt>
                    <dd>{r.type}</dd>
                  </div>
                  <div>
                    <dt>Unit size</dt>
                    <dd>{r.size}</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>{r.price}</dd>
                  </div>
                </dl>
                {r.enquire && (
                  <div className="residence__actions">
                    <button type="button" className="button button--small" onClick={() => openQuickEnquiry(r.id)}>
                      Enquire<span className="visually-hidden"> about {r.name}</span>
                    </button>
                    <button
                      type="button"
                      className="button button--small button--outline"
                      onClick={() => openQuickEnquiry(r.id, 'brochure')}
                    >
                      Brochure<span className="visually-hidden"> for {r.name}</span>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        {visible.some((r) => r.price.includes('*')) && <p className="residences__note">{PRICE_NOTE}</p>}
      </div>
    </section>
  );
}

// The card's description, cut to three lines. Read more appears only when the text runs longer.
function Description({ id, text }: { id: string; text: string }) {
  const lineRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  // Measured while clamped, again when the card's width changes and once the web fonts arrive.
  useEffect(() => {
    const line = lineRef.current;
    if (!line || expanded) return;
    const measure = () => setOverflows(line.scrollHeight > line.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(line);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <div className="residence__about">
      <p id={id} ref={lineRef} className={`residence__line${expanded ? ' is-expanded' : ''}`}>
        {text}
      </p>
      {overflows && (
        <button
          type="button"
          className="text-link residence__more"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

// The card's photo. A residence can give a second photo for wide screens, where the photo box is close to
// square and a landscape picture would be cropped hard; phones keep the first.
function CardPhoto({ residence: r }: { residence: Residence }) {
  const common = { width: 1400, height: 933, sizes: '(min-width: 48rem) 42vw, 100vw' };
  // The crop points reach the image as custom properties, so the wide-screen photo can have its own.
  const style = { '--pos': r.photo.position, '--pos-wide': r.desktopPhoto?.position } as CSSProperties;
  if (!r.desktopPhoto) return <Image {...common} src={r.photo.src} alt={r.photo.alt} style={style} />;

  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, src: r.desktopPhoto.src, alt: r.desktopPhoto.alt });
  const { props } = getImageProps({ ...common, src: r.photo.src, alt: r.photo.alt });
  return (
    <picture>
      <source media="(min-width: 48rem)" srcSet={wide} sizes={common.sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...props} style={style} />
    </picture>
  );
}
