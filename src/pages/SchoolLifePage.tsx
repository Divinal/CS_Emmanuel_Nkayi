import React from 'react';
import { Clock, Dumbbell, Heart, Music, Shirt, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import StudentPhotoCard from '../components/public/StudentPhotoCard';
import { PageBanner, SectionTitle } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const ACTIVITIES = [
  { icon: Heart, title: 'Valeurs', text: 'Respect, entraide et bienveillance.' },
  { icon: Dumbbell, title: 'Sport', text: 'EPS et tournois inter-classes.' },
  { icon: Music, title: 'Fêtes et culture', text: 'Noël, semaine culturelle, remise des prix.' },
  { icon: Users, title: 'Citoyenneté', text: 'Éducation civique et fêtes nationales.' },
];

const RULES = [
  { icon: Clock, text: 'Ponctualité et assiduité' },
  { icon: Shirt, text: 'Tenue scolaire officielle obligatoire' },
  { icon: Users, text: 'Respect de tous et du matériel' },
];

const SchoolLifePage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="school-life" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Vie scolaire"
      title="Grandir et apprendre ensemble"
      description="Valeurs, sport, fêtes et règles communes pour que chacun s'épanouisse."
    />

    <section className="container mx-auto px-4 py-16 lg:px-8">
      <SectionTitle eyebrow="Activités" title="Une année bien remplie" center />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIVITIES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border-t-4 border-brand bg-white p-6 text-center shadow-md">
            <Icon className="mx-auto h-8 w-8 text-brand" />
            <h3 className="mt-3 font-display text-lg font-semibold uppercase text-navy">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-navy text-white">
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <SectionTitle eyebrow="Tenue scolaire" title="La tenue officielle par cycle" center light />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {CYCLE_INFOS.map((cycle) => (
            <div key={cycle.id} className="flex flex-col items-center text-center">
              <StudentPhotoCard cycle={cycle} className="h-[200px] w-[130px]" />
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{cycle.uniform}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 py-16 lg:px-8">
      <SectionTitle eyebrow="Règles de vie" title="Ce que nous attendons" center />
      <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {RULES.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 bg-white p-5 shadow-md">
            <Icon className="h-6 w-6 shrink-0 text-brand" />
            <span className="font-semibold text-navy">{text}</span>
          </li>
        ))}
      </ul>
    </section>
  </PublicLayout>
);

export default SchoolLifePage;
