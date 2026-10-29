'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { CloseIcon, DownloadIcon } from '@/components/icons';
import { useResidenceUI } from '@/components/ResidenceProvider';
import { PRICE_NOTE, residences, type Residence } from '@/lib/residences';
import { site } from '@/lib/site';

export function ResidenceSheet() {
  const { openId, sheetRef, handleSheetClosed, openQuickEnquiry } = useResidenceUI();
  const residence = residences.find((r) => r.id === openId) ?? null;

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    if (openId && !sheet.open) {
      sheet.showModal();
      sheet.scrollTop = 0;
    } else if (!openId && sheet.open) {
      sheet.close();
    }
  }, [openId, sheetRef]);

  return (
    <dialog
      ref={sheetRef}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={handleSheetClosed}
      onClick={(event) => {
        // A click on the dialog element itself, outside the content, is a click on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="sheet__bar">
        <button
          className="sheet__close"
          type="button"
          aria-label="Close residence details"
          onClick={() => sheetRef.current?.close()}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="sheet__body">
        {residence && (
          <ResidenceDetail
            residence={residence}
            onRequestViewing={openQuickEnquiry}
            onRequestBrochure={(id) => openQuickEnquiry(id, 'brochure')}
          />
        )}
      </div>
    </dialog>
  );
}

function ResidenceDetail({
  residence: r,
  onRequestViewing,
  onRequestBrochure,
}: {
  residence: Residence;
  onRequestViewing: (id: string) => void;
  onRequestBrochure: (id: string) => void;
}) {
  return (
    <>
      <Image
        className="sheet__image"
        src={r.photo.src}
        alt={r.photo.alt}
        width={2000}
        height={1250}
        sizes="(min-width: 60rem) 60rem, 100vw"
        style={r.photo.position ? { objectPosition: r.photo.position } : undefined}
      />
      <div className="sheet__content">
        <h2 className="sheet__title" id="sheet-title">
          {r.name}
        </h2>
        <p className="sheet__place">{r.area}, Bengaluru</p>
        <p className="sheet__desc">{r.description}</p>

        {r.note && (
          <p className="sheet__note">
            {r.note.text}
            {r.note.callOffice && (
              <>
                {' '}
                call us on <a href={site.phone.href}>{site.phone.display}</a>.
              </>
            )}
          </p>
        )}

        {r.enquire && (
          <div className="sheet__actions">
            <a
              className="button"
              href="#visit"
              onClick={(event) => {
                event.preventDefault();
                onRequestViewing(r.id);
              }}
            >
              Enquire now
            </a>
            <a
              className="button button--outline"
              href="#visit"
              onClick={(event) => {
                event.preventDefault();
                onRequestBrochure(r.id);
              }}
            >
              <DownloadIcon />
              Brochure
              <span className="visually-hidden"> for {r.name}</span>
            </a>
          </div>
        )}

        <dl className="specs">
          {r.specs.map((spec) => (
            <div key={spec.label} className={spec.wide ? 'specs__wide' : undefined}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
        {r.price.includes('*') && <p className="specs__note">{PRICE_NOTE}</p>}

        {r.paymentPlan && (
          <section className="sheet__gallery sheet__plan" aria-labelledby="sheet-plan-title">
            <h3 className="sheet__gallery-title" id="sheet-plan-title">
              Payment plan
            </h3>
            <p className="sheet__plan-name">{r.paymentPlan.title}</p>
            <p className="sheet__plan-intro">{r.paymentPlan.intro}</p>
            <dl className="plan">
              {r.paymentPlan.schedule.map((step) => (
                <div key={step.year}>
                  <dt>{step.year}</dt>
                  <dd>{step.share}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="sheet__gallery" aria-labelledby="sheet-gallery-title">
          <h3 className="sheet__gallery-title" id="sheet-gallery-title">
            Gallery
          </h3>
          {r.gallery ? (
            <ul className="sheet__gallery-grid" tabIndex={0} aria-label={`${r.name} photos, scroll sideways`}>
              {r.gallery.map((photo) => (
                <li key={photo.src}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="20rem"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <Image
              className="sheet__image sheet__image--second"
              src={r.secondPhoto.src}
              alt={r.secondPhoto.alt}
              width={1400}
              height={788}
              sizes="(min-width: 60rem) 52rem, 100vw"
            />
          )}
        </section>

        <section className="sheet__gallery" aria-labelledby="sheet-location-title">
          <h3 className="sheet__gallery-title" id="sheet-location-title">
            Location
          </h3>
          <iframe
            className="sheet__map"
            title={`Map showing ${r.name}`}
            src={`https://maps.google.com/maps?q=${r.location.lat},${r.location.lng}&z=14&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            className="sheet__map-link"
            href={`https://www.google.com/maps/search/?api=1&query=${r.location.lat},${r.location.lng}`}
            target="_blank"
            rel="noopener"
          >
            Open in Google Maps<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <h4 className="sheet__nearby-title">Nearby</h4>
          <ul className="nearby">
            {r.location.nearby.map((place) => (
              <li key={place.name}>
                <span className="nearby__kind">{place.kind}</span>
                <span className="nearby__name">{place.name}</span>
                <span className="nearby__km">{place.km}&nbsp;km</span>
              </li>
            ))}
          </ul>
          <p className="specs__note">Distances are approximate, by road.</p>
        </section>
      </div>
    </>
  );
}
