import type { Metadata, Viewport } from 'next';
import { Jost, Newsreader } from 'next/font/google';
import { Splash } from '@/components/Splash';
import { site } from '@/lib/site';
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

const title = `${site.name} | Lodha luxury residences in Bengaluru`;

export const metadata: Metadata = {
  title,
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    type: 'website',
    locale: 'en_IN',
    siteName: site.name,
  },
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
        <Splash />
        {children}
      </body>
    </html>
  );
}
