# Lodha Preferred Partner — Bengaluru

Landing page for a Lodha Preferred Partner presenting Lodha's luxury residences in Bengaluru, built with Next.js (App Router, TypeScript).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node 20.9 or later. Keep TypeScript on 6.x: TypeScript 7 has no JavaScript API, which Next.js needs for type checking.

## Where things live

| Path | What it holds |
| --- | --- |
| `lib/site.ts` | Name, logo paths, phone, WhatsApp, email, office, RERA agent number, social links |
| `lib/residences.ts` | Every residence: copy, specs, prices, photos, map position |
| `public/brand/` | Partner logo: full colour for light backgrounds, reversed for dark ones |
| `public/hero/` | Hero film (a silent web encode of `Lodha-intro-hero.mp4`) and its poster frame |
| `app/globals.css` | All styles. The palette sits at the top: deep charcoal `#171715`, warm ivory `#F5F1E9`, champagne gold `#B69A68`, stone beige `#D9D0C2`, white, and muted greys `#5C5850` (on light) and `#A39E94` (on dark) |
| `app/layout.tsx` | Fonts (Newsreader, Jost via `next/font`) and page metadata |
| `components/` | One component per section; interactive ones are client components |

Each residence has a shareable link, for example `/#lodha-elanza`, which opens its detail sheet.

## About the logo files

`lodha-preferred-partner.png` is the supplied artwork, trimmed and with the white fill inside the "A" made transparent. `lodha-preferred-partner-reversed.png` was derived from it (black type turned white, gold kept) for the hero, menu and footer. If Lodha's partner kit includes an official reversed version, replace this file with it, keeping the same name.

## About the hero film

The hero plays `public/hero/lodha-intro-hero.mp4` on a loop, muted, behind a scrim. It is a 1280×720 H.264 encode of `Lodha-intro-hero.mp4` (in the project root, not served) with the audio removed: 2.6 MB instead of 7.1 MB. The poster is the film's first frame, shown until the film can play. Visitors can pause it or replay it from the start. It stays still for visitors who prefer reduced motion and pauses while the hero is off screen.

The film is 16:9, so phones show the centre of each shot. To replace it, keep the same file names and re-run:

```bash
ffmpeg -i Lodha-intro-hero.mp4 -an -c:v libx264 -preset slow -crf 25 -maxrate 3M -bufsize 6M \
  -profile:v high -level 4.0 -pix_fmt yuv420p -g 48 -movflags +faststart public/hero/lodha-intro-hero.mp4
ffmpeg -i Lodha-intro-hero.mp4 -frames:v 1 -c:v libwebp -quality 80 public/hero/lodha-intro-hero-poster.webp
```

## Before launch

- **About Lodha.** Unlike the placeholders below, the figures in `components/AboutLodha.tsx` are real: they come from [lodhagroup.com/our-story](https://www.lodhagroup.com/our-story) and Lodha Developers Limited's March 2026 corporate presentation. Update them when Lodha publishes new figures, and check the wording against Lodha's partner guidelines. Its image, `public/about/lodha-entrance.jpg`, is a still from the hero film, not a photograph of a Lodha building: replace it with an official photograph from Lodha's partner kit, keeping the same file name.
- **Residences.** Lodha Elanza in `lib/residences.ts` uses the partner's figures and Lodha's published RERA number, but its two photos are stand-ins: replace them with renders from Lodha's partner kit. Lodha Azure (Tower F) uses the partner's figures, with stand-in photos and no RERA number yet. Lodha Haven likewise (stand-in photos, no RERA number yet), using figures from Lodha's sales material and RERA filings.
- **Photography.** Images are Unsplash photos. Use Lodha's approved renders: put them in `public/` and use paths like `/renders/project.jpg`, or add their image host to `images.remotePatterns` in `next.config.ts`.
- **Contact details.** The phone number, the WhatsApp number in `site.whatsapp` (used by the phone dock's WhatsApp button) and the `.example` email address are dummies.
- **RERA numbers.** Each project shows `PRM/KA/RERA/0000/000/PR/000000`, and the footer shows an agent number `PRM/KA/RERA/0000/000/AG/000000`. Add the real project registrations and your agent registration.
- **Copyright name.** `legalName` in `lib/site.ts` should be your firm's registered name.
- **Enquiry form.** `sendEnquiry` in `components/EnquiryForm.tsx` only simulates a send. Connect it to your CRM, a form service or a Server Action. Each request carries `purpose`: `viewing`, or `brochure` from a card's Brochure button, which promises the visitor the project brochure by email within one working day, so whoever receives these must send it (or automate it once you have the PDFs).
- **Brand guidelines.** Check the logo placement and the reversed version against Lodha's partner guidelines.
