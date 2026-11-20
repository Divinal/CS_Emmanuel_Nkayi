import React from 'react';
import { BellRing, Clock, Heart, Dumbbell, HeartPulse, Music, Shirt, Smartphone, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import StudentPhotoCard from '../components/public/StudentPhotoCard';
import { PageBanner, PromoBanner, SectionTitle } from '../components/public/PublicBlocks';
import { CYCLE_INFOS } from '../content/cycles';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const ACTIVITIES = [
  {
    icon: Heart,
    title: 'Entraide et valeurs',
    text: "Respect, entraide et bienveillance au quotidien, actions de solidarité et éducation aux valeurs morales et civiques.",
  },
  {
    icon: Dumbbell,
    title: 'Sport',
    text: 'Éducation physique et sportive à tous les niveaux, tournois inter-classes de football, handball et athlétisme.',
  },
  {
    icon: Music,
    title: 'Fêtes et culture',
    text: "Fête de Noël, semaine culturelle, concours de lecture, de dictée et de dessin, kermesse et remise des prix.",
  },
  {
    icon: Users,
    title: 'Citoyenneté',
    text: "Éducation civique et morale, célébration des fêtes nationales, sensibilisation à l'hygiène et à l'environnement.",
  },
];

const RULES = [
  { icon: Clock, title: 'Ponctualité et assiduité', text: "Les retards et absences sont relevés chaque jour et signalés aux familles dans l'espace en ligne." },
  { icon: Shirt, title: 'Tenue correcte', text: 'La tenue scolaire officielle est obligatoire et doit être propre et complète.' },
  { icon: Users, title: 'Respect', text: 'Respect des enseignants, du personnel, des camarades et du matériel de l’établissement.' },
  { icon: HeartPulse, title: 'Santé', text: "Les parents signalent à l'administration tout problème de santé ou traitement particulier de leur enfant." },
];

const SchoolLifePage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="school-life" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Vie scolaire"
      title="Grandir, apprendre et vivre ensemble"
      description="Au-delà des cours, l'école est un lieu de vie : valeurs, sport, fêtes, citoyenneté et règles communes pour que chacun s'épanouisse."
    />

    <section className="container mx-auto px-4 py-14 lg:px-8">
      <SectionTitle eyebrow="Activités" title="Une année bien remplie" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIVITIES.map(({ icon: Icon, title, text }) => (
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

    <section className="bg-white">
      <div className="container mx-auto px-4 py-14 lg:px-8">
        <SectionTitle
          eyebrow="Tenue scolaire"
          title="La tenue officielle, cycle par cycle"
          description="Conformément au décret du 30 août 2023 portant uniformisation de la tenue scolaire en République du Congo, applicable aux établissements publics et privés."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CYCLE_INFOS.map((cycle) => (
            <div key={cycle.id} className="flex flex-col items-center text-center">
              <StudentPhotoCard cycle={cycle} className="h-[240px] w-[160px]" />
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{cycle.uniform}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="container mx-auto px-4 py-14 lg:px-8">
      <SectionTitle eyebrow="Règles de vie" title="Ce que nous attendons de chaque élève" />
      <div className="grid gap-6 sm:grid-cols-2">
        {RULES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4 rounded-xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <Icon className="h-7 w-7 shrink-0 text-blue-600" />
            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <div className="container mx-auto space-y-6 px-4 pb-16 lg:px-8">
      <PromoBanner
        tone="blue"
        icon={BellRing}
        eyebrow="Parents informés en temps réel"
        title="Absences, retards, comportement : soyez prévenu"
        text="Chaque absence ou retard enregistré par l'école apparaît dans l'espace en ligne de l'élève, avec une notification."
        cta={{ label: 'Se connecter', onClick: onLoginClick }}
        onNavigate={onNavigate}
      />
      <PromoBanner
        tone="green"
        icon={Smartphone}
        eyebrow="Agenda de l'école"
        title="Fêtes, compositions, examens : ne manquez rien"
        text="Consultez l'agenda de l'année : fête de Noël, compositions trimestrielles, semaine sportive, examens d'État et remise des prix."
        cta={{ label: "Voir l'agenda", to: 'news' }}
        onNavigate={onNavigate}
      />
    </div>
  </PublicLayout>
);

export default SchoolLifePage;
