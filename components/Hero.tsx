'use client';

import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { PauseIcon, PlayIcon, ReplayIcon } from '@/components/icons';
import { site } from '@/lib/site';

// A silent 1280×720 H.264 encode of Lodha-intro-hero.mp4; the poster is its first frame.
const HERO_VIDEO = '/hero/lodha-intro-hero.mp4';
const HERO_POSTER = '/hero/lodha-intro-hero-poster.webp';

// The headline's last word keeps cycling through these, for as long as the film plays.
const WORDS = ['Luxury', 'Prestige', 'Comfort', 'Serenity', 'Elegance', 'Eternity'];
const FIRST_HOLD = 2200;
const HOLD = 1800;

function WordRotator({ start, paused }: { start: boolean; paused: boolean }) {
  // Rest on "Eternity" until the visitor can see the headline; that is also what no-script
  // visitors and those who prefer reduced motion get.
  const [index, setIndex] = useState(WORDS.length - 1);
  const [prev, setPrev] = useState(-1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAnimate(true);
    setIndex(0);
  }, []);

  useEffect(() => {
    if (!animate || !start || paused) return;
    const timer = window.setTimeout(
      () => {
        setPrev(index);
        setIndex((index + 1) % WORDS.length);
      },
      prev === -1 ? FIRST_HOLD : HOLD,
    );
    return () => window.clearTimeout(timer);
  }, [animate, start, paused, index, prev]);

  return (
    <em className="hero__accent">
      <span className="visually-hidden">Eternity.</span>
      <span className="hero__rotor" aria-hidden="true">
        {WORDS.map((word, i) => (
          <span key={word} className={i === index ? 'is-current' : i === prev ? 'is-past' : undefined}>
            {word}.
          </span>
        ))}
      </span>
    </em>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  // The film plays while the visitor wants it to and the hero is on screen.
  const wantsPlay = useRef(true);
  const onScreen = useRef(true);

  preload(HERO_POSTER, { as: 'image', fetchPriority: 'high' });

  const syncPlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!wantsPlay.current || !onScreen.current) {
      video.pause();
      return;
    }
    video.play().catch((error: DOMException) => {
      // Autoplay refused, for example in a power-saving mode: offer the play button instead.
      if (error.name !== 'NotAllowedError') return;
      wantsPlay.current = false;
      setPaused(true);
    });
  };

  // Open the doors once the poster or the first frame is in. Two frames, so the closed state paints first.
  useEffect(() => {
    const video = videoRef.current;
    let frame = 0;
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setReady(true));
      });
    };

    if (!video || video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      reveal();
      return () => cancelAnimationFrame(frame);
    }

    const poster = new Image();
    poster.src = HERO_POSTER;
    poster.decode().then(reveal, reveal);
    video.addEventListener('loadeddata', reveal, { once: true });
    video.addEventListener('error', reveal, { once: true });
    const fallback = window.setTimeout(reveal, 2500);
    return () => {
      video.removeEventListener('loadeddata', reveal);
      video.removeEventListener('error', reveal);
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Start playing unless the visitor prefers reduced motion, and rest while the hero is scrolled away.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    // Browsers only autoplay muted video, and React does not always render the muted attribute.
    video.muted = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wantsPlay.current = false;
      setPaused(true);
    }
    const observer = new IntersectionObserver(([entry]) => {
      onScreen.current = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const togglePlayback = () => {
    wantsPlay.current = !wantsPlay.current;
    setPaused(!wantsPlay.current);
    syncPlayback();
  };

  // Back to the first shot, playing, even if the visitor had paused it.
  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    wantsPlay.current = true;
    setPaused(false);
    syncPlayback();
  };

  return (
    <section ref={sectionRef} className={`hero${ready ? ' is-ready' : ''}`} id="top" aria-labelledby="hero-title">
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__video"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noremoteplayback"
          disableRemotePlayback
          aria-hidden="true"
        />
      </div>
      <div className="hero__content wrap">
        <h1 className="hero__title" id="hero-title">
          <span className="visually-hidden">Lodha luxury residences in Bengaluru</span>
          <span aria-hidden="true" style={{ display: 'contents' }}>
          <span className="line">
            <span>An Address with</span>
          </span>
          <span className="line">
            <span>
              a Sense of <WordRotator start={ready} paused={paused} />
            </span>
          </span>
          </span>
        </h1>
        <div className="hero__foot">
          <p className="hero__lede">
            As a {site.name}, we advise buyers on Lodha’s luxury residences across the city, from the first shortlist
            to the day you collect the keys.
          </p>
          <a className="button button--light button--glass button--small hero__cta" href="#projects">
            Explore projects
            <span className="hero__cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
          <div className="hero__controls">
            <button className="hero__control" type="button" aria-label="Replay the background video" onClick={replay}>
              <ReplayIcon />
            </button>
            <button
              className="hero__control"
              type="button"
              aria-label={paused ? 'Play the background video' : 'Pause the background video'}
              onClick={togglePlayback}
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
          <p className="hero__caption">Artist’s impressions.</p>
        </div>
      </div>
    </section>
  );
}
