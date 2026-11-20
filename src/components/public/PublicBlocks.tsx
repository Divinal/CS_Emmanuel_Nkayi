// Blocs réutilisés par les pages publiques : lien interne, bannière de page,
// encart promotionnel, carte d'événement et titre de section.
import React from 'react';
import { CalendarDays, MapPin, LucideIcon } from 'lucide-react';
import type { PublicPage } from '../PublicHeader';
import { PUBLIC_PATHS } from '../../lib/publicRoutes';
import { CATEGORY_STYLES, SchoolEvent, eventBadge, eventDateText } from '../../content/events';

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

// Petits carrés de couleur de la bannière (comme sur le livret d'accueil).
const CONFETTI = [
  { top: '14%', left: '6%', size: 14, color: '#22c55e', rotate: 12 },
  { top: '70%', left: '3%', size: 18, color: '#ef4444', rotate: -8 },
  { top: '82%', left: '22%', size: 12, color: '#ec4899', rotate: 20 },
  { top: '22%', left: '44%', size: 16, color: '#facc15', rotate: -14 },
  { top: '58%', left: '47%', size: 12, color: '#14b8a6', rotate: 8 },
  { top: '8%', left: '88%', size: 14, color: '#f97316', rotate: 25 },
];

export const Confetti: React.FC = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    {CONFETTI.map((square, index) => (
      <span
        key={index}
        className="absolute rounded-[3px] opacity-80"
        style={{
          top: square.top,
          left: square.left,
          width: square.size,
          height: square.size,
          backgroundColor: square.color,
          transform: `rotate(${square.rotate}deg)`,
        }}
      />
    ))}
  </div>
);

// Fond bleu nuit commun aux bannières.
export const BannerBackground: React.FC = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0f1d4d] via-[#18307a] to-[#1d4ed8]" />
    <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
    <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 22px)',
      }}
    />
  </div>
);

// Trait blanc terminé par un crochet, sous les grands titres.
export const TitleRule: React.FC = () => (
  <div className="my-6 flex items-start" aria-hidden="true">
    <span className="h-1 w-40 bg-white sm:w-56" />
    <span className="h-4 w-1 bg-white" />
  </div>
);

export const PageBanner: React.FC<{ eyebrow?: string; title: string; description: string }> = ({
  eyebrow,
  title,
  description,
}) => (
  <section className="relative overflow-hidden text-white">
    <BannerBackground />
    <Confetti />
    <div className="container relative mx-auto px-4 py-14 lg:px-8 md:py-20">
      {eyebrow && <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-200">{eyebrow}</p>}
      <h2 className="max-w-3xl text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">{title}</h2>
      <TitleRule />
      <p className="max-w-2xl text-base leading-relaxed text-blue-50 md:text-lg">{description}</p>
    </div>
  </section>
);

export const SectionTitle: React.FC<{ eyebrow?: string; title: string; description?: string; center?: boolean }> = ({
  eyebrow,
  title,
  description,
  center,
}) => (
  <div className={`mb-10 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-3xl'}`}>
    {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">{eyebrow}</p>}
    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h2>
    {description && <p className="mt-3 leading-relaxed text-gray-600">{description}</p>}
  </div>
);

type PromoTone = 'amber' | 'blue' | 'green' | 'purple';

const PROMO_TONES: Record<PromoTone, { box: string; icon: string; button: string; eyebrow: string }> = {
  amber: {
    box: 'from-amber-400 to-orange-500 text-gray-900',
    icon: 'bg-white/30 text-gray-900',
    button: 'bg-gray-900 text-white hover:bg-gray-800',
    eyebrow: 'text-gray-900/70',
  },
  blue: {
    box: 'from-blue-600 to-indigo-700 text-white',
    icon: 'bg-white/15 text-white',
    button: 'bg-white text-blue-700 hover:bg-blue-50',
    eyebrow: 'text-blue-100',
  },
  green: {
    box: 'from-emerald-500 to-teal-600 text-white',
    icon: 'bg-white/15 text-white',
    button: 'bg-white text-emerald-700 hover:bg-emerald-50',
    eyebrow: 'text-emerald-50',
  },
  purple: {
    box: 'from-fuchsia-600 to-purple-700 text-white',
    icon: 'bg-white/15 text-white',
    button: 'bg-white text-purple-700 hover:bg-purple-50',
    eyebrow: 'text-purple-100',
  },
};

// Encart promotionnel (« pub ») de l'établissement, à glisser entre deux sections.
export const PromoBanner: React.FC<{
  tone?: PromoTone;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  text: string;
  cta: { label: string; to?: PublicPage; onClick?: () => void };
  onNavigate: Navigate;
}> = ({ tone = 'blue', icon: Icon, eyebrow, title, text, cta, onNavigate }) => {
  const style = PROMO_TONES[tone];
  const buttonClass = `inline-flex shrink-0 items-center justify-center rounded-lg px-6 py-3 font-semibold shadow-md transition ${style.button}`;
  return (
    <aside
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 shadow-lg md:p-8 ${style.box}`}
      aria-label={eyebrow}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${style.icon}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className={`text-xs font-bold uppercase tracking-widest ${style.eyebrow}`}>{eyebrow}</p>
          <h3 className="mt-1 text-xl font-bold md:text-2xl">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed opacity-90 md:text-base">{text}</p>
        </div>
        {cta.to ? (
          <PublicLink to={cta.to} onNavigate={onNavigate} className={buttonClass}>
            {cta.label}
          </PublicLink>
        ) : (
          <button type="button" onClick={cta.onClick} className={buttonClass}>
            {cta.label}
          </button>
        )}
      </div>
    </aside>
  );
};

export const EventCard: React.FC<{ event: SchoolEvent; past?: boolean }> = ({ event, past }) => {
  const badge = eventBadge(event);
  return (
    <article
      className={`flex gap-4 rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-100 transition hover:shadow-lg ${
        past ? 'opacity-75' : ''
      }`}
    >
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl text-white ${
          past ? 'bg-gray-400' : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        }`}
        aria-hidden="true"
      >
        <span className="text-2xl font-black leading-none">{badge.day}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase">{badge.month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[event.category]}`}>
          {event.category}
        </span>
        <h3 className="mt-2 font-bold text-gray-900">{event.title}</h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-blue-700">
          <CalendarDays className="h-4 w-4 shrink-0" />
          {eventDateText(event)}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{event.description}</p>
        {event.place && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {event.place}
          </p>
        )}
      </div>
    </article>
  );
};
