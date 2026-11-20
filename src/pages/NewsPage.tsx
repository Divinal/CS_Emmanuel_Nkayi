import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { EventCard, PageBanner, PromoBanner, SectionTitle } from '../components/public/PublicBlocks';
import { CATEGORY_STYLES, EventCategory, pastEvents, upcomingEvents } from '../content/events';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const CATEGORIES = Object.keys(CATEGORY_STYLES) as EventCategory[];

const NewsPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => {
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const matches = (eventCategory: EventCategory) => category === 'all' || eventCategory === category;
  const upcoming = upcomingEvents().filter((event) => matches(event.category));
  const past = pastEvents().filter((event) => matches(event.category));

  const chipClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
    }`;

  return (
    <PublicLayout currentPage="news" onNavigate={onNavigate} onLoginClick={onLoginClick}>
      <PageBanner
        eyebrow="Actualités"
        title="Agenda de l'année 2026-2027"
        description="Fêtes, compositions, examens d'État, inscriptions et temps forts de la vie de l'établissement."
      />

      <section className="container mx-auto px-4 py-12 lg:px-8">
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
          <button type="button" onClick={() => setCategory('all')} className={chipClass(category === 'all')} aria-pressed={category === 'all'}>
            Tout
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={chipClass(category === item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <SectionTitle eyebrow="À venir" title="Prochains rendez-vous" />
        {upcoming.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Aucun événement à venir dans cette catégorie pour le moment.</p>
        )}
      </section>

      <div className="container mx-auto px-4 lg:px-8">
        <PromoBanner
          tone="purple"
          icon={Megaphone}
          eyebrow="Annonces officielles"
          title="Les annonces de l'école, directement sur votre téléphone"
          text="Changements d'horaires, réunions de parents, dates de compositions : les annonces de la direction arrivent dans l'espace en ligne avec une notification."
          cta={{ label: 'Se connecter', onClick: onLoginClick }}
          onNavigate={onNavigate}
        />
      </div>

      {past.length > 0 && (
        <section className="container mx-auto px-4 py-12 lg:px-8">
          <SectionTitle eyebrow="Déjà passés" title="Retour sur l'année" />
          <div className="grid gap-5 md:grid-cols-2">
            {past.map((event) => (
              <EventCard key={event.id} event={event} past />
            ))}
          </div>
        </section>
      )}
      <div className="pb-6" />
    </PublicLayout>
  );
};

export default NewsPage;
