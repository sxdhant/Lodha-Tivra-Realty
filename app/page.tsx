import { AboutLodha } from '@/components/AboutLodha';
import { Hero } from '@/components/Hero';
import { MobileDock } from '@/components/MobileDock';
import { MediaGuard } from '@/components/MediaGuard';
import { QuickEnquiry } from '@/components/QuickEnquiry';
import { ResidenceProvider } from '@/components/ResidenceProvider';
import { Residences } from '@/components/Residences';
import { ResidenceSheet } from '@/components/ResidenceSheet';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Visit } from '@/components/Visit';
import { WhereWeBuild } from '@/components/WhereWeBuild';

export default function Home() {
  return (
    <ResidenceProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Residences />
        <WhereWeBuild />
        <AboutLodha />
        <Visit />
      </main>
      <SiteFooter />
      <MobileDock />
      <ResidenceSheet />
      <QuickEnquiry />
      <MediaGuard />
    </ResidenceProvider>
  );
}
