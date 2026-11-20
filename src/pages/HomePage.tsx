import React from 'react';
import { ArrowRight, MessagesSquare } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import HeroBanner from '../components/public/HeroBanner';
import StudentPhotoCard from '../components/public/StudentPhotoCard';
import { EventCard, PromoBanner, PublicLink, SectionTitle } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';
import { upcomingEvents } from '../content/events';
import { siteConfig } from '../config/site.config';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLoginClick }) => {
  const nextEvents = upcomingEvents().slice(0, 3);

  return (
    <PublicLayout currentPage="home" onNavigate={onNavigate} onLoginClick={onLoginClick}>
      <HeroBanner onNavigate={onNavigate} />

      {/* Présentation : texte sur fond bleu nuit, élèves à droite */}
      <section className="grid bg-navy text-white lg:grid-cols-2">
        <div className="px-4 py-14 sm:px-10 lg:px-16 lg:py-20">
          <h2 className="font-display text-2xl font-semibold uppercase leading-snug md:text-3xl">
            {siteConfig.schoolName}, l'école de toute la scolarité à Nkayi
          </h2>
          <span className="mt-4 block h-1 w-16 bg-brand" aria-hidden="true" />
          <p className="mt-6 max-w-xl leading-relaxed text-gray-300">
            De la garderie à la Terminale, nous suivons les programmes officiels du Congo et préparons nos élèves
            au CEPE, au BEPC et au Baccalauréat, dans un cadre discipliné et bienveillant.
          </p>
          <PublicLink
            to="about"
            onNavigate={onNavigate}
            className="mt-8 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-brand hover:text-white"
          >
            Découvrir l'établissement <ArrowRight className="h-4 w-4" />
          </PublicLink>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden bg-navy-700 py-12">
          <span className="absolute inset-y-0 left-0 w-2 bg-brand" aria-hidden="true" />
          <ul className="flex gap-3 px-6">
            {CYCLE_INFOS.slice(0, 4).map((cycle, index) => (
              <li
                key={cycle.id}
                className={index === 3 ? 'hidden sm:block' : ''}
                style={{ transform: `translateY(${index % 2 ? 24 : -12}px)` }}
              >
                <StudentPhotoCard cycle={cycle} className="h-[210px] w-[100px] sm:h-[260px] sm:w-[110px]" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cycles */}
      <section className="container mx-auto px-4 py-16 lg:px-8">
        <SectionTitle eyebrow="Enseignement" title="Nos cycles" center />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CYCLE_INFOS.map((cycle) => (
            <PublicLink
              key={cycle.id}
              to="education"
              onNavigate={onNavigate}
              className="group border-t-4 border-navy bg-white p-5 shadow-md transition hover:-translate-y-1 hover:border-brand"
            >
              <h3 className="font-display text-lg font-semibold uppercase text-navy">{cycle.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{cycle.ages}</p>
              {cycle.exam && (
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-brand">Examen : {cycle.exam.short}</p>
              )}
            </PublicLink>
          ))}
        </div>
      </section>

      {/* Événements */}
      {nextEvents.length > 0 && (
        <section className="bg-white">
          <div className="container mx-auto px-4 py-16 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <SectionTitle eyebrow="Agenda" title="Prochains événements" />
              <PublicLink
                to="news"
                onNavigate={onNavigate}
                className="mb-10 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-brand hover:text-brand-dark"
              >
                Tout l'agenda <ArrowRight className="h-4 w-4" />
              </PublicLink>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {nextEvents.map((event) => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-16 lg:px-8">
        <PromoBanner
          icon={MessagesSquare}
          eyebrow="Une question ?"
          title="Le secrétariat vous répond"
          cta={{ label: 'Nous contacter', to: 'contact' }}
          onNavigate={onNavigate}
        />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
