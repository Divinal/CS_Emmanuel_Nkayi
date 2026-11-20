// Blocs réutilisés par les pages publiques : lien interne, bannière de page,
// encart d'appel à l'action, carte d'événement et titre de section.
// Thème : bleu nuit (navy) + rouge (brand), titres en Oswald majuscules.
import React from 'react';
import { CalendarDays, LucideIcon } from 'lucide-react';
import type { PublicPage } from '../PublicHeader';
import { PUBLIC_PATHS } from '../../lib/publicRoutes';
import { siteConfig } from '../../config/site.config';
import { SchoolEvent, eventBadge, eventDateText } from '../../content/events';

export type Navigate = (page: PublicPage) => void;

// Vrai lien <a href> (indexable, ouvrable dans un nouvel onglet) qui navigue sans recharger.
export const PublicLink: React.FC<{
  to: PublicPage;
  onNavigate: Navigate;
  className?: string;
  children: React.ReactNode;
}> = ({ to, onNavigate, className, children }) => (
  <a
    href={PUBLIC_PATHS[to]}
    onClick={(e) => {
      e.preventDefault();
      onNavigate(to);
    }}
    className={className}
  >
    {children}
  </a>
);

// Styles de boutons partagés.
export const BTN_RED =
  'inline-flex items-center justify-center gap-2 rounded-sm bg-brand px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark';
export const BTN_OUTLINE =
  'inline-flex items-center justify-center gap-2 rounded-sm border-2 border-white/80 px-7 py-3 font-display text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-navy';

// Fond sombre des bannières : photo de l'école (si renseignée) sous un voile bleu nuit.
export const BannerBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    {siteConfig.heroImage ? (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteConfig.heroImage})` }}
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-navy-700 via-navy-800 to-navy-950" />
    )}
    <div className="absolute inset-0 bg-navy-950/75" />
    <div className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{ backgroundImage: 'repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 26px)' }}
    />
  </div>
);

// Petit trait rouge sous les titres.
export const RedRule: React.FC<{ center?: boolean }> = ({ center }) => (
  <span className={`mt-4 block h-1 w-16 bg-brand ${center ? 'mx-auto' : ''}`} aria-hidden="true" />
);

export const PageBanner: React.FC<{ eyebrow?: string; title: string; description: string }> = ({
  eyebrow,
  title,
  description,
}) => (
  <section className="relative overflow-hidden text-white">
    <BannerBackground />
    <div className="container relative mx-auto px-4 py-16 text-center lg:px-8 md:py-24">
      {eyebrow && (
        <p className="mb-3 font-display text-sm font-medium uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
      )}
      <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold uppercase leading-tight md:text-5xl">{title}</h2>
      <RedRule center />
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">{description}</p>
    </div>
  </section>
);

export const SectionTitle: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}> = ({ eyebrow, title, description, center, light }) => (
  <div className={`mb-10 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
    {eyebrow && (
      <p className="mb-2 font-display text-sm font-medium uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
    )}
    <h2 className={`font-display text-2xl font-semibold uppercase md:text-3xl ${light ? 'text-white' : 'text-navy'}`}>
      {title}
    </h2>
    <RedRule center={center} />
    {description && (
      <p className={`mt-4 leading-relaxed ${light ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    )}
  </div>
);

// Bandeau d'appel à l'action, bleu nuit avec bouton rouge.
export const PromoBanner: React.FC<{
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text?: string;
  cta: { label: string; to?: PublicPage; onClick?: () => void };
  onNavigate: Navigate;
}> = ({ icon: Icon, eyebrow, title, text, cta, onNavigate }) => (
  <aside className="relative overflow-hidden border-l-4 border-brand bg-navy p-6 text-white shadow-lg md:p-8" aria-label={eyebrow}>
    <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-brand/15 text-brand">
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
        <h3 className="mt-1 font-display text-xl font-semibold uppercase md:text-2xl">{title}</h3>
        {text && <p className="mt-1 text-sm leading-relaxed text-gray-300 md:text-base">{text}</p>}
      </div>
      {cta.to ? (
        <PublicLink to={cta.to} onNavigate={onNavigate} className={`${BTN_RED} shrink-0`}>
          {cta.label}
        </PublicLink>
      ) : (
        <button type="button" onClick={cta.onClick} className={`${BTN_RED} shrink-0`}>
          {cta.label}
        </button>
      )}
    </div>
  </aside>
);

export const EventCard: React.FC<{ event: SchoolEvent; past?: boolean; compact?: boolean }> = ({ event, past, compact }) => {
  const badge = eventBadge(event);
  return (
    <article
      className={`flex gap-4 border-b-2 border-transparent bg-white p-5 shadow-md transition hover:border-brand hover:shadow-lg ${
        past ? 'opacity-70' : ''
      }`}
    >
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center text-white ${past ? 'bg-gray-400' : 'bg-navy'}`}
        aria-hidden="true"
      >
        <span className="font-display text-2xl font-semibold leading-none">{badge.day}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase text-brand">{badge.month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">{event.category}</p>
        <h3 className="mt-1 font-bold text-navy">{event.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 shrink-0" />
          {eventDateText(event)}
        </p>
        {!compact && <p className="mt-2 text-sm leading-relaxed text-gray-600">{event.description}</p>}
      </div>
    </article>
  );
};
