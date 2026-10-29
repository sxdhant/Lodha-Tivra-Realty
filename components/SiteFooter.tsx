import Image from 'next/image';
import { BrandLogo } from '@/components/BrandLogo';
import { DirectionsIcon, FacebookIcon, InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon, WhatsAppIcon } from '@/components/icons';
import { WhatsAppLink } from '@/components/WhatsAppLink';
import { site } from '@/lib/site';

const GREETING = 'Hello, I would like to know more about Lodha residences in Bengaluru.';

const SOCIAL_ICONS = { Instagram: InstagramIcon, Facebook: FacebookIcon, LinkedIn: LinkedInIcon };

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap grid footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <p className="footer__partner-label">Developer</p>
            <a className="brand brand--large" href="#top" aria-label={`${site.name}, back to top`}>
              <BrandLogo variant="reversed" alt="" />
            </a>
          </div>
          <div className="footer__logo">
            <p className="footer__partner-label">Channel partner</p>
            <div className="footer__partner">
              <Image src="/brand/tivra-realty.png" alt="Tivra Realty, discover your dream space" width={641} height={289} />
            </div>
          </div>
        </div>
        <div className="footer__col">
          <h2 className="footer__heading">Office</h2>
          <p>
            {site.office.street}
            <br />
            {site.office.area}
            <br />
            {site.office.city}, {site.office.state} {site.office.pin}
          </p>
          <a className="footer__directions" href={site.office.mapHref} target="_blank" rel="noopener">
            <DirectionsIcon />
            Get directions
            <span className="visually-hidden"> to our office (opens in Google Maps in a new tab)</span>
          </a>
        </div>
        <div className="footer__col">
          <h2 className="footer__heading">Contact</h2>
          <ul className="footer__chips">
            <li>
              <a className="footer__chip" href={site.phone.href}>
                <PhoneIcon />
                <span className="visually-hidden">Call us: </span>
                {site.phone.display}
              </a>
            </li>
            <li>
              <WhatsAppLink className="footer__chip footer__chip--whatsapp" message={GREETING}>
                <WhatsAppIcon />
                <span className="visually-hidden">WhatsApp: </span>
                {site.phone.display}
                <span className="visually-hidden"> (opens WhatsApp)</span>
              </WhatsAppLink>
            </li>
            <li>
              <a className="footer__chip" href={site.gmailHref} target="_blank" rel="noopener">
                <MailIcon />
                <span className="visually-hidden">Email: </span>
                {site.email}
                <span className="visually-hidden"> (opens Gmail in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h2 className="footer__heading">Follow</h2>
          <ul>
            {site.social.map((link) => {
              const Icon = SOCIAL_ICONS[link.label];
              return (
                <li key={link.label}>
                  <a className="footer__social" href={link.href} target="_blank" rel="noopener">
                    <Icon />
                    {link.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="wrap footer__legal">
        <p>
          Images are artist’s impressions. Plans, areas and prices are indicative; the documents registered with
          Karnataka RERA for each project are final. Karnataka RERA agent registration {site.reraAgent}.
        </p>
        <p>
          © {new Date().getFullYear()} {site.legalName}
        </p>
      </div>
    </footer>
  );
}
