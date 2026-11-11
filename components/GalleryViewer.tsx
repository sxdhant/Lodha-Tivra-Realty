'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/icons';
import type { Photo } from '@/lib/residences';

type GalleryPhoto = Photo & { width: number; height: number };

/**
 * The sheet's gallery: a sideways strip of photos (or one large photo), each opening full screen.
 * The full-screen view is a modal dialog of its own, so Escape closes only the photo and focus
 * returns to the thumbnail that opened it. Arrow keys, and the buttons, move between photos.
 */
export function GalleryViewer({ name, photos, strip }: { name: string; photos: GalleryPhoto[]; strip: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const photo = index === null ? null : photos[index];

  // Where the sheet and the strip were scrolled to when a photo opened, so closing it puts them back exactly.
  const scrollWas = useRef({ sheetTop: 0, stripLeft: 0 });
  const stripRef = useRef<HTMLUListElement>(null);
  const sheetOf = (dialog: HTMLDialogElement) => dialog.closest<HTMLElement>('.sheet');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (index !== null && dialog && !dialog.open) {
      scrollWas.current = { sheetTop: sheetOf(dialog)?.scrollTop ?? 0, stripLeft: stripRef.current?.scrollLeft ?? 0 };
      dialog.showModal();
    }
  }, [index]);

  const restoreScroll = () => {
    const dialog = dialogRef.current;
    const sheet = dialog && sheetOf(dialog);
    const put = () => {
      if (sheet) sheet.scrollTop = scrollWas.current.sheetTop;
      if (stripRef.current) stripRef.current.scrollLeft = scrollWas.current.stripLeft;
    };
    put();
    requestAnimationFrame(put);
  };

  const step = (by: number) => setIndex((i) => (i === null ? i : (i + by + count) % count));

  const open = (i: number) => (
    <button type="button" className="gallery__open" aria-haspopup="dialog" onClick={() => setIndex(i)}>
      <Image
        className={strip ? undefined : 'sheet__image sheet__image--second'}
        src={photos[i].src}
        alt={photos[i].alt}
        width={photos[i].width}
        height={photos[i].height}
        sizes={strip ? '20rem' : '(min-width: 60rem) 52rem, 100vw'}
      />
    </button>
  );

  return (
    <>
      {strip ? (
        <ul ref={stripRef} className="sheet__gallery-grid" tabIndex={0} aria-label={`${name} photos, scroll sideways`}>
          {photos.map((p, i) => (
            <li key={p.src}>{open(i)}</li>
          ))}
        </ul>
      ) : (
        open(0)
      )}

      <dialog
        ref={dialogRef}
        className="viewer"
        aria-label={`${name} photo${photo && count > 1 ? `, ${index! + 1} of ${count}` : ''}`}
        onClose={(event) => {
          // This dialog sits inside the sheet's, and React would pass its close on to the sheet.
          event.stopPropagation();
          setIndex(null);
          restoreScroll();
        }}
        onClick={(event) => {
          // A click on the dialog itself, outside the photo and the buttons, is a click on the backdrop.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === 'ArrowRight') step(1);
          else if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        {photo && (
          <>
            <button
              type="button"
              className="viewer__button viewer__close"
              aria-label="Close photo"
              onClick={() => dialogRef.current?.close()}
            >
              <CloseIcon />
            </button>
            <figure className="viewer__figure">
              <Image
                key={photo.src}
                className="viewer__image"
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="100vw"
              />
              <figcaption className="viewer__caption">
                {count > 1 && (
                  <span className="viewer__count">
                    {index! + 1} / {count}
                  </span>
                )}
                {photo.alt}
              </figcaption>
            </figure>
            {count > 1 && (
              <>
                <button
                  type="button"
                  className="viewer__button viewer__prev"
                  aria-label="Previous photo"
                  onClick={() => step(-1)}
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  className="viewer__button viewer__next"
                  aria-label="Next photo"
                  onClick={() => step(1)}
                >
                  <ChevronRightIcon />
                </button>
              </>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
