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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          {/* min-w-0 : un nom d'école long passe à la ligne au lieu d'élargir la page. */}
          <a href={PUBLIC_PATHS.home} onClick={navigate('home')} className="flex items-center gap-3 min-w-0">
            <img
              src={siteConfig.logoUrl}
              alt={t("Logo {0}", [siteConfig.schoolName])}
              className="h-10 w-10 shrink-0 object-contain"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%233b82f6" width="40" height="40" rx="8"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-weight="bold"%3E${siteConfig.logoFallbackInitials}%3C/text%3E%3C/svg%3E`;
              }}
            />
            <h1 className="text-base sm:text-xl md:text-2xl font-bold leading-tight text-blue-600">{t(siteConfig.schoolName)}</h1>
          </a>

          <div className="hidden xl:flex shrink-0 items-center gap-5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={PUBLIC_PATHS[item.id]}
                onClick={navigate(item.id)}
                className={`text-sm transition ${
                  currentPage === item.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </a>
            ))}
            <LanguageSwitcher />
            <button
              onClick={onLoginClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
            >
              {t("Connexion")}
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-blue-600"
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pb-4 space-y-1 border-t pt-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={PUBLIC_PATHS[item.id]}
                onClick={navigate(item.id)}
                className={`block w-full text-start py-2 transition ${
                  currentPage === item.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                onLoginClick();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
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
