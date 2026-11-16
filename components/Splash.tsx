import { BrandLogo } from '@/components/BrandLogo';

// The opening screen: the page colour with the logo, shown on every load or refresh and then faded away by
// CSS alone (see .splash in globals.css).
export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <span className="splash__curtain splash__curtain--left" />
      <span className="splash__curtain splash__curtain--right" />
      <div className="splash__inner">
        <span className="splash__mark">
          <BrandLogo variant="original" className="splash__logo" loading="eager" />
        </span>
      </div>
    </div>
  );
}
