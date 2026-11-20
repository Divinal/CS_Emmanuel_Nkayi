import React from 'react';
import { Phone } from 'lucide-react';
import { siteConfig, phoneHref } from '../../config/site.config';
import { BTN_OUTLINE, BTN_RED, BannerBackground, Navigate, PublicLink } from './PublicBlocks';

// Bannière d'accueil : grand titre centré, mots-clés en rouge, deux boutons.
const HeroBanner: React.FC<{ onNavigate: Navigate }> = ({ onNavigate }) => (
  <section className="relative overflow-hidden text-white">
    <BannerBackground />

    <div className="container relative mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center lg:px-8">
      <p className="font-display text-sm uppercase tracking-[0.3em] text-gray-300">Nkayi · Bouenza · Congo</p>
      <h2 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
        Une école <span className="text-brand">de la garderie</span> au <span className="text-brand">lycée</span>
      </h2>
      <p className="mt-6 font-display text-base uppercase tracking-[0.2em] text-gray-200 sm:text-lg">
        {siteConfig.reportCard.schoolMotto}
      </p>

      <div className="mt-10 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <a href={phoneHref(siteConfig.contact.phone)} className={BTN_OUTLINE}>
          <Phone className="h-4 w-4" />
          {siteConfig.contact.phone}
        </a>
        <PublicLink to="admissions" onNavigate={onNavigate} className={BTN_RED}>
          Inscrire mon enfant
        </PublicLink>
      </div>
    </div>
  </section>
);

export default HeroBanner;
