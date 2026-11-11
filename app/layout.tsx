import type { Metadata, Viewport } from 'next';
import { Jost, Newsreader } from 'next/font/google';
import { ShaderBackground } from '@/components/shader-background';
import { Splash } from '@/components/Splash';
import { StructuredData } from '@/components/StructuredData';
import { site, siteUrl } from '@/lib/site';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jost',
  display: 'swap',
});

// Kept under about 60 characters so search results do not cut it off.
const title = `${site.name} | Luxury Homes in Bengaluru`;
const shareImage = { url: '/og.jpg', width: 1200, height: 630, alt: 'A resort-style pool deck at dusk beside a Lodha residence' };

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: site.description,
    type: 'website',
    locale: 'en_IN',
    siteName: site.name,
    url: '/',
    images: [shareImage],
  },
  twitter: { card: 'summary_large_image', title, description: site.description, images: [shareImage.url] },
};

export const viewport: Viewport = {
  themeColor: '#171715',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The inline script adds a class before React hydrates, hence suppressHydrationWarning.
    // data-scroll-behavior lets Next jump instantly on route changes despite the smooth scrolling in CSS.
    <html
      lang="en-IN"
      className={`${newsreader.variable} ${jost.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Lets CSS hold the hero's closed state until the Hero component plays the opening. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <StructuredData />
        <ShaderBackground />
        <Splash />
        {children}
      </body>
    </html>
  );
}
