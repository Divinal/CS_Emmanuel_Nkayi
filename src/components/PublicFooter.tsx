import React from 'react';
import { siteConfig, phoneHref, hasPublicEmail } from '../config/site.config';
import { PublicPage } from './PublicHeader';
import { PUBLIC_PATHS } from '../lib/publicRoutes';
import { t } from '../i18n';

const FOOTER_LINKS: Record<'main' | 'families', { id: PublicPage; label: string }[]> = {
  main: [
    { id: 'home', label: t("Accueil") },
    { id: 'about', label: "L'établissement" },
    { id: 'education', label: 'Enseignement' },
    { id: 'news', label: 'Actualités et événements' },
  ],
  families: [
    { id: 'admissions', label: 'Inscriptions et admissions' },
    { id: 'admissions', label: 'Questions fréquentes' },
    { id: 'school-life', label: 'Vie scolaire et tenue' },
    { id: 'contact', label: 'Nous écrire' },
    { id: 'privacy', label: t("Confidentialité") },
  ],
};

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
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">{t(siteConfig.about.title)}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t(siteConfig.about.description)}</p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">{t("Liens rapides")}</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.main.map((link) => (
                <li key={link.id}>
                  <a href={PUBLIC_PATHS[link.id]} onClick={navigate(link.id)} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button onClick={onLoginClick} className="text-gray-600 hover:text-blue-600 transition">
                  {t("Connexion")}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Familles</h3>
            <ul className="space-y-2 text-sm">
              {FOOTER_LINKS.families.map((link) => (
                <li key={link.label}>
                  <a href={PUBLIC_PATHS[link.id]} onClick={navigate(link.id)} className="text-gray-600 hover:text-blue-600 transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-lg">{t("Contact")}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {siteConfig.contact.addressLines.map((line) => (
                <li key={line}>{t(line)}</li>
              ))}
              {hasPublicEmail() && (
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-blue-600 transition">
                    {siteConfig.contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href={phoneHref(siteConfig.contact.phone)} className="hover:text-blue-600 transition">
                  {siteConfig.contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {t(siteConfig.copyrightOwner)}{t(". Tous droits réservés.")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
