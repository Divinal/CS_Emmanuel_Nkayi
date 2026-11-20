import React from 'react';
import { Award } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import StudentPhotoCard from '../components/public/StudentPhotoCard';
import { PageBanner } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const EducationPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="education" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Enseignement"
      title="De la garderie au Baccalauréat"
      description="Cinq cycles, conformes au système éducatif de la République du Congo."
    />

    <div className="container mx-auto space-y-6 px-4 py-16 lg:px-8">
      {CYCLE_INFOS.map((cycle) => (
        <section
          key={cycle.id}
          id={cycle.id}
          className="grid items-center gap-8 border-l-4 border-brand bg-white p-6 shadow-md sm:grid-cols-[140px_1fr] md:p-8"
        >
          <StudentPhotoCard cycle={cycle} className="mx-auto h-[200px] w-[130px]" />
          <div>
            <p className="font-display text-sm uppercase tracking-[0.2em] text-brand">{cycle.ages}</p>
            <h2 className="mt-1 font-display text-2xl font-semibold uppercase text-navy md:text-3xl">{cycle.name}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">{cycle.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2" aria-label={`Niveaux du cycle ${cycle.name}`}>
              {cycle.levels.map((level) => (
                <span key={level} className="bg-navy px-3 py-1 text-sm font-medium text-white">
                  {level}
                </span>
              ))}
            </div>
            {cycle.exam && (
              <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand">
                <Award className="h-5 w-5 shrink-0" />
                Examen d'État : {cycle.exam.short} ({cycle.exam.long})
              </p>
            )}
          </div>
        </section>
      ))}
    </div>
  </PublicLayout>
);

export default EducationPage;
