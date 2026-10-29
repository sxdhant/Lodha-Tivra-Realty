'use client';

import { useEffect } from 'react';

// Takes the easy ways of saving the page's photos and the hero film away: right-click "Save image/video as…",
// dragging a picture out of the page, and long-press "Save image" on a phone (see also .media-guard in the CSS).
// This only stops casual saving: anything a browser shows can still be captured by determined visitors.
export function MediaGuard() {
  useEffect(() => {
    const isMedia = (target: EventTarget | null) =>
      target instanceof Element && target.closest('img, video, picture, svg image') !== null;
    const block = (event: Event) => {
      if (isMedia(event.target)) event.preventDefault();
    };
    document.addEventListener('contextmenu', block);
    document.addEventListener('dragstart', block);
    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('dragstart', block);
    };
  }, []);
  return null;
}
