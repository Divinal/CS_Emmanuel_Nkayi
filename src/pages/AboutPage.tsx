import React from 'react';
import { BookHeart, BookOpen, CalendarCheck, Hammer, MapPin, Sparkles, Trophy, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { PageBanner, PromoBanner, SectionTitle } from '../components/public/PublicBlocks';
import { siteConfig } from '../config/site.config';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const MOTTO = [
  {
    icon: BookHeart,
    word: 'Amour',
    text: "L'amour du prochain et le respect de chacun fondent la vie de l'établissement : bienveillance, entraide et esprit de famille entre élèves, parents et enseignants.",
  },
  {
    icon: Hammer,
    word: 'Travail',
    text: "L'effort quotidien, la rigueur et la persévérance sont au cœur de la réussite. Chaque élève est encouragé à donner le meilleur de lui-même.",
  },
  {
    icon: Trophy,
    word: 'Réussite',
    text: "Réussir ses examens, mais aussi grandir en responsabilité, en respect des autres et en amour du travail bien fait.",
  },
];

const PROJECT = [
  { icon: BookOpen, title: 'Des bases solides', text: 'Lecture, écriture, calcul et méthodes de travail acquises dès les petites classes.' },
  { icon: CalendarCheck, title: 'Un suivi régulier', text: 'Compositions trimestrielles, bulletins détaillés et suivi des absences et du comportement.' },
  { icon: Sparkles, title: 'L’épanouissement', text: 'Sport, fêtes de l’école, concours et activités culturelles tout au long de l’année.' },
  { icon: Users, title: 'Le partenariat avec les parents', text: 'Les familles sont informées et associées à la scolarité de leurs enfants.' },
];

const TEAM = [
  { role: "Chef d'établissement", detail: siteConfig.reportCard.headName || 'Direction' },
  { role: 'Direction des études', detail: 'Organisation pédagogique, emplois du temps, examens' },
  { role: 'Secrétariat', detail: 'Inscriptions, dossiers scolaires, accueil des familles' },
  { role: 'Économat', detail: 'Frais de scolarité, reçus et paiements' },
  { role: 'Enseignants', detail: 'Éducatrices, instituteurs et professeurs de chaque discipline' },
];

const AboutPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${siteConfig.contact.addressLines[0]}, Nkayi, Congo`,
  )}`;

  return (
    <PublicLayout currentPage="about" onNavigate={onNavigate} onLoginClick={onLoginClick}>
      <PageBanner
        eyebrow="L'établissement"
        title={siteConfig.schoolName}
        description="Un établissement scolaire au service des familles de Nkayi et de la Bouenza, qui accompagne chaque élève de la garderie à la Terminale."
      />

      <section className="container mx-auto px-4 py-14 lg:px-8">
        <SectionTitle
          eyebrow="Notre devise"
          title={siteConfig.reportCard.schoolMotto}
          description="Trois mots qui résument notre manière d'éduquer et ce que nous souhaitons pour chaque enfant."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {MOTTO.map(({ icon: Icon, word, text }) => (
            <div key={word} className="rounded-2xl bg-white p-7 shadow-md ring-1 ring-gray-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wide text-blue-800">{word}</h3>
              <p className="mt-2 leading-relaxed text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 py-14 lg:px-8">
          <SectionTitle
            eyebrow="Projet éducatif"
            title="Former des élèves compétents et responsables"
            description="Nous suivons les programmes officiels de la République du Congo et veillons à ce que chaque élève progresse à son rythme, avec exigence et bienveillance."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECT.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="mb-3 h-8 w-8 text-blue-600" />
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle eyebrow="Organisation" title="L'équipe de l'établissement" />
          <ul className="divide-y rounded-xl bg-white shadow-md ring-1 ring-gray-100">
            {TEAM.map((member) => (
              <li key={member.role} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold text-gray-900">{member.role}</span>
                <span className="text-sm text-gray-600 sm:text-end">{member.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionTitle eyebrow="Nous trouver" title="À Nkayi" />
          <div className="rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                {siteConfig.contact.addressLines.map((line) => (
                  <p key={line} className="text-gray-700">{line}</p>
                ))}
                <p className="mt-1 text-sm text-gray-500">Département de la Bouenza</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-semibold text-blue-700 hover:text-blue-800"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 lg:px-8">
        <PromoBanner
          tone="purple"
          icon={CalendarCheck}
          eyebrow="Visite de l'établissement"
          title="Venez nous rencontrer avec votre enfant"
          text="Prenez rendez-vous avec le secrétariat pour visiter l'école, rencontrer la direction et poser toutes vos questions avant l'inscription."
          cta={{ label: 'Prendre rendez-vous', to: 'contact' }}
          onNavigate={onNavigate}
        />
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
