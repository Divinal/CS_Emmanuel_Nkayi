import React from 'react';
import { ArrowRight, BookOpenCheck, Heart, HeartHandshake, Laptop, MessagesSquare, School, ShieldCheck } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import HeroBanner from '../components/public/HeroBanner';
import { EventCard, PromoBanner, PublicLink, SectionTitle } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';
import { upcomingEvents } from '../content/events';
import { siteConfig } from '../config/site.config';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const LEVEL_COUNT = CYCLE_INFOS.reduce((total, cycle) => total + cycle.levels.length, 0);

const KEY_FIGURES = [
  { value: String(CYCLE_INFOS.length), label: 'Cycles, de la garderie au lycée' },
  { value: String(LEVEL_COUNT), label: 'Niveaux de classe' },
  { value: '3', label: "Examens d'État préparés : CEPE, BEPC, BAC" },
  { value: '24h/24', label: 'Notes et bulletins en ligne' },
];

const STRENGTHS = [
  {
    icon: Heart,
    title: "Une éducation fondée sur l'amour",
    text: "Bienveillance, respect, honnêteté et entraide guident la vie de l'école et la relation entre élèves, parents et enseignants.",
  },
  {
    icon: BookOpenCheck,
    title: 'Les programmes officiels',
    text: "Enseignement conforme aux programmes du ministère de l'Enseignement préscolaire, primaire, secondaire et de l'alphabétisation.",
  },
  {
    icon: ShieldCheck,
    title: 'Discipline et suivi',
    text: "Assiduité, ponctualité et comportement suivis au quotidien, avec un compte rendu régulier aux familles.",
  },
  {
    icon: HeartHandshake,
    title: 'École et familles ensemble',
    text: "Les parents suivent notes, bulletins, absences et frais de scolarité en ligne, et échangent avec l'école.",
  },
];

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLoginClick }) => {
  const nextEvents = upcomingEvents().slice(0, 3);

  return (
    <PublicLayout currentPage="home" onNavigate={onNavigate} onLoginClick={onLoginClick}>
      <HeroBanner onNavigate={onNavigate} />

      {/* Présentation */}
      <section className="bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
          <div className="space-y-4 leading-relaxed text-gray-700">
            <p>
              Le <strong>{siteConfig.schoolName}</strong> accueille les enfants et les jeunes de la garderie
              jusqu'à la classe de Terminale, à Nkayi, rue Nzaou Kayes, n° 47.
            </p>
            <p>
              Vous trouverez sur ce site la présentation de l'établissement et de ses cycles, les conditions
              d'inscription, la vie scolaire, l'agenda des événements, ainsi que l'accès à l'espace en ligne
              réservé aux élèves, aux parents et aux enseignants.
            </p>
            <PublicLink
              to="about"
              onNavigate={onNavigate}
              className="inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
            >
              Découvrir l'établissement <ArrowRight className="h-4 w-4" />
            </PublicLink>
          </div>
          <dl className="grid grid-cols-2 gap-4">
            {KEY_FIGURES.map((figure) => (
              <div key={figure.label} className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 ring-1 ring-blue-100">
                <dt className="sr-only">{figure.label}</dt>
                <dd className="text-3xl font-black text-blue-700">{figure.value}</dd>
                <dd className="mt-1 text-sm text-gray-600">{figure.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container mx-auto px-4 pt-14 lg:px-8">
        <PromoBanner
          tone="amber"
          icon={School}
          eyebrow="Inscriptions et transferts"
          title="Une place pour votre enfant, de la garderie à la Terminale"
          text="Première inscription, changement d'école ou entrée en classe d'examen : le secrétariat vous renseigne sur les places disponibles et le dossier à fournir."
          cta={{ label: 'Voir les admissions', to: 'admissions' }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Cycles */}
      <section className="container mx-auto px-4 py-14 lg:px-8">
        <SectionTitle
          eyebrow="Enseignement"
          title="Nos cycles d'enseignement"
          description="Un parcours complet et cohérent, conforme au système éducatif congolais."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {CYCLE_INFOS.map((cycle) => (
            <PublicLink
              key={cycle.id}
              to="education"
              onNavigate={onNavigate}
              className="group flex flex-col rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="mb-4 h-1.5 w-12 rounded-full" style={{ backgroundColor: cycle.accent }} />
              <h3 className="text-lg font-bold text-gray-900">{cycle.name}</h3>
              <p className="text-sm font-medium text-blue-700">{cycle.ages}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{cycle.levels.join(' · ')}</p>
              {cycle.exam && (
                <span className="mt-4 inline-block self-start rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  Examen : {cycle.exam.short}
                </span>
              )}
            </PublicLink>
          ))}
        </div>
      </section>

      {/* Événements */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionTitle eyebrow="Agenda" title="Prochains événements" />
            <PublicLink
              to="news"
              onNavigate={onNavigate}
              className="mb-10 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
            >
              Tout l'agenda <ArrowRight className="h-4 w-4" />
            </PublicLink>
          </div>
          {nextEvents.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-3">
              {nextEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Le prochain agenda sera publié très bientôt.</p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 pt-14 lg:px-8">
        <PromoBanner
          tone="blue"
          icon={Laptop}
          eyebrow="Espace parents et élèves"
          title="Suivez la scolarité de votre enfant en ligne"
          text="Notes, bulletins trimestriels, emploi du temps, absences, frais de scolarité et messages de l'école : tout est accessible depuis votre téléphone, 24h/24."
          cta={{ label: 'Se connecter', onClick: onLoginClick }}
          onNavigate={onNavigate}
        />
      </div>

      {/* Atouts */}
      <section className="container mx-auto px-4 py-14 lg:px-8">
        <SectionTitle eyebrow="Pourquoi nous choisir" title={siteConfig.reportCard.schoolMotto} center />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STRENGTHS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 lg:px-8">
        <PromoBanner
          tone="green"
          icon={MessagesSquare}
          eyebrow="Une question ?"
          title="L'équipe de l'établissement vous répond"
          text="Inscription, frais de scolarité, vie scolaire : écrivez-nous depuis le site ou appelez le secrétariat."
          cta={{ label: 'Nous contacter', to: 'contact' }}
          onNavigate={onNavigate}
        />
      </div>
    </PublicLayout>
  );
};

export default HomePage;
