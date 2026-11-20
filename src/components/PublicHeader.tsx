import React, { useState } from 'react';
import { Menu, X as CloseIcon } from 'lucide-react';
import { siteConfig } from '../config/site.config';
import { PUBLIC_PATHS } from '../lib/publicRoutes';
import { t } from '../i18n';
import LanguageSwitcher from './ui/LanguageSwitcher';

// « register » : page d'inscription ouverte depuis un lien envoyé par l'administration.
export type PublicPage =
  | 'home' | 'about' | 'education' | 'admissions' | 'school-life' | 'news'
  | 'contact' | 'privacy' | 'register';

interface PublicHeaderProps {
  currentPage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

// La confidentialité reste accessible depuis le pied de page.
const navItems: { id: PublicPage; label: string }[] = [
  { id: 'home', label: t("Accueil") },
  { id: 'about', label: "L'établissement" },
  { id: 'education', label: 'Enseignement' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'school-life', label: 'Vie scolaire' },
  { id: 'news', label: 'Actualités' },
  { id: 'contact', label: t("Contact") },
];

const PublicHeader: React.FC<PublicHeaderProps> = ({ currentPage, onNavigate, onLoginClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // De vrais liens <a href> (plutôt que des <button onClick>) pour que les
  // pages publiques soient explorables par les moteurs de recherche et
  // ouvrables dans un nouvel onglet / avec clic molette.
  const navigate = (page: PublicPage) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const linkClass = (active: boolean) =>
    `font-display text-sm uppercase tracking-wider transition ${
      active ? 'text-brand' : 'text-gray-200 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/95 text-white backdrop-blur">
      <nav className="container mx-auto px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          {/* min-w-0 : un nom d'école long passe à la ligne au lieu d'élargir la page. */}
          <a href={PUBLIC_PATHS.home} onClick={navigate('home')} className="flex min-w-0 items-center gap-3">
            <img
              src={siteConfig.logoUrl}
              alt={t("Logo {0}", [siteConfig.schoolName])}
              className="h-11 w-11 shrink-0 rounded-sm bg-white object-contain p-0.5"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23d92b25" width="40" height="40" rx="4"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-weight="bold"%3E${siteConfig.logoFallbackInitials}%3C/text%3E%3C/svg%3E`;
              }}
            />
            <h1 className="font-display text-sm font-semibold uppercase leading-tight tracking-wider sm:text-lg">
              {t(siteConfig.schoolName)}
            </h1>
          </a>

          <div className="hidden shrink-0 items-center gap-6 xl:flex">
            {navItems.map((item) => (
              <a key={item.id} href={PUBLIC_PATHS[item.id]} onClick={navigate(item.id)} className={linkClass(currentPage === item.id)}>
                {item.label}
              </a>
            ))}
            <LanguageSwitcher />
            <button
              onClick={onLoginClick}
              className="rounded-sm bg-brand px-5 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark"
            >
              {t("Connexion")}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-200 hover:text-white"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mt-3 space-y-1 border-t border-white/10 pb-4 pt-3 xl:hidden">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={PUBLIC_PATHS[item.id]}
                onClick={navigate(item.id)}
                className={`block w-full py-2 text-start ${linkClass(currentPage === item.id)}`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="mt-2 w-full rounded-sm bg-brand px-6 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-brand-dark"
            >
              {t("Connexion")}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default PublicHeader;
