import React from 'react';
import { Award, CheckCircle2, ClipboardList, GraduationCap, Shirt } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import StudentPhotoCard from '../components/public/StudentPhotoCard';
import { PageBanner, PromoBanner, SectionTitle } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const SCHOOL_YEAR = [
  { title: 'Trois trimestres', text: "L'année scolaire commence en octobre et se divise en trois trimestres, séparés par les congés de Noël et de Pâques." },
  { title: 'Devoirs et compositions', text: 'Les élèves sont évalués par des interrogations et devoirs réguliers, puis par une composition à la fin de chaque trimestre.' },
  { title: 'Bulletins trimestriels', text: 'Chaque trimestre, un bulletin présente les notes, les moyennes, le rang et les appréciations des enseignants.' },
  { title: "Examens d'État", text: 'CEPE en fin de CM2, BEPC en fin de 3ème et Baccalauréat en fin de Terminale, organisés par le ministère.' },
];

const EducationPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="education" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Enseignement"
      title="De la garderie au Baccalauréat"
      description="Cinq cycles qui suivent l'organisation du système éducatif de la République du Congo : préscolaire, primaire, puis enseignement secondaire général au collège et au lycée."
    />

    <section className="container mx-auto px-4 py-14 lg:px-8">
      <SectionTitle eyebrow="L'année scolaire" title="Comment s'organise l'année" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SCHOOL_YEAR.map((item, index) => (
          <div key={item.title} className="rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <span className="text-sm font-black text-blue-600">0{index + 1}</span>
            <h3 className="mt-1 font-bold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="space-y-6 pb-6">
      {CYCLE_INFOS.map((cycle, index) => (
        <section key={cycle.id} id={cycle.id} className={index % 2 === 0 ? 'bg-white' : ''}>
          <div className="container mx-auto grid items-center gap-10 px-4 py-14 md:grid-cols-[220px_1fr] lg:px-8">
            <StudentPhotoCard
              cycle={cycle}
              className="mx-auto h-[300px] w-[200px] -rotate-3"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: cycle.accent }}>
                {cycle.ages}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">{cycle.name}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-gray-600">{cycle.summary}</p>

              <div className="mt-5 flex flex-wrap gap-2" aria-label={`Niveaux du cycle ${cycle.name}`}>
                {cycle.levels.map((level) => (
                  <span key={level} className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 ring-1 ring-blue-100">
                    {level}
                  </span>
                ))}
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {cycle.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {detail}
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {cycle.exam && (
                  <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                    <Award className="h-5 w-5 shrink-0 text-red-600" />
                    <div>
                      <p className="font-bold text-red-800">Examen d'État : {cycle.exam.short}</p>
                      <p className="text-sm text-red-700">{cycle.exam.long}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-4">
                  <Shirt className="h-5 w-5 shrink-0 text-amber-700" />
                  <div>
                    <p className="font-bold text-amber-900">Tenue scolaire</p>
                    <p className="text-sm text-amber-800">{cycle.uniform}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>

    <div className="container mx-auto space-y-6 px-4 pb-16 lg:px-8">
      <p className="flex items-start gap-2 text-sm text-gray-500">
        <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
        Tenues conformes au décret du 30 août 2023 portant uniformisation de la tenue scolaire en République du Congo.
      </p>
      <PromoBanner
        tone="amber"
        icon={GraduationCap}
        eyebrow="Classes d'examen : CM2, 3ème, Terminale"
        title="Préparez le CEPE, le BEPC et le BAC sereinement"
        text="Suivez chaque devoir, chaque composition et chaque bulletin de votre enfant dans l'espace en ligne, et réagissez à temps avec ses enseignants."
        cta={{ label: "Accéder à l'espace en ligne", onClick: onLoginClick }}
        onNavigate={onNavigate}
      />
    </div>
  </PublicLayout>
);

export default EducationPage;
