import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { siteConfig, phoneHref, hasPublicEmail } from '../config/site.config';
import { PublicPage } from './PublicHeader';
import { PUBLIC_PATHS } from '../lib/publicRoutes';
import { t } from '../i18n';

const FOOTER_LINKS: { id: PublicPage; label: string }[] = [
  { id: 'about', label: "L'établissement" },
  { id: 'education', label: 'Enseignement' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'school-life', label: 'Vie scolaire' },
  { id: 'news', label: 'Actualités' },
  { id: 'contact', label: t("Contact") },
];

interface PublicFooterProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate, onLoginClick }) => {
  const navigate = (page: PublicPage) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="mt-auto bg-navy-950 text-gray-400">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-white">{t(siteConfig.schoolName)}</h3>
          <span className="mt-3 block h-1 w-12 bg-brand" aria-hidden="true" />
          <p className="mt-4 font-display text-sm uppercase tracking-widest text-gray-300">
            {siteConfig.reportCard.schoolMotto}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {FOOTER_LINKS.map((link) => (
            <li key={link.id}>
              <a href={PUBLIC_PATHS[link.id]} onClick={navigate(link.id)} className="transition hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button onClick={onLoginClick} className="transition hover:text-white">
              {t("Connexion")}
            </button>
          </li>
        </ul>

        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {siteConfig.contact.addressLines.map((line) => t(line)).join(', ')}
          </li>
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 shrink-0 text-brand" />
            <a href={phoneHref(siteConfig.contact.phone)} className="transition hover:text-white">
              {siteConfig.contact.phone}
            </a>
          </li>
          {hasPublicEmail() && (
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand" />
              <a href={`mailto:${siteConfig.contact.email}`} className="transition hover:text-white">
                {siteConfig.contact.email}
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} {t(siteConfig.copyrightOwner)}{t(". Tous droits réservés.")}
          </p>
          <a href={PUBLIC_PATHS.privacy} onClick={navigate('privacy')} className="transition hover:text-white">
            {t("Confidentialité")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
