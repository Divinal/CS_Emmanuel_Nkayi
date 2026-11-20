import React from 'react';
import { CYCLE_INFOS } from '../../content/cycles';
import { siteConfig } from '../../config/site.config';
import StudentPhotoCard from './StudentPhotoCard';
import { BannerBackground, Confetti, Navigate, PublicLink, TitleRule } from './PublicBlocks';

// Décalage vertical de chaque carte : effet « éventail » de la bannière.
const CARD_OFFSETS = [34, -10, 50, -22, 22];

const HeroBanner: React.FC<{ onNavigate: Navigate }> = ({ onNavigate }) => (
  <section className="relative overflow-hidden text-white">
    <BannerBackground />
    <Confetti />

    <div className="container relative mx-auto grid items-center gap-6 px-4 py-12 lg:grid-cols-12 lg:gap-4 lg:px-8 lg:py-16">
      <div className="relative z-10 lg:col-span-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-sky-200 sm:text-sm">
          République du Congo · Nkayi, Bouenza
        </p>
        <h2 className="text-3xl font-black uppercase leading-[1.1] tracking-tight sm:text-4xl xl:text-5xl">
          Bienvenue au {siteConfig.schoolName}
        </h2>
        <TitleRule />
        <p className="max-w-xl text-base leading-relaxed text-blue-50 sm:text-lg">
          De la garderie au lycée, nous accompagnons chaque enfant vers la réussite scolaire et humaine,
          dans un cadre discipliné et bienveillant. Programmes officiels du Congo, préparation
          au CEPE, au BEPC et au Baccalauréat.
        </p>
        <p className="mt-5 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/25">
          Notre devise : {siteConfig.reportCard.schoolMotto}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PublicLink
            to="admissions"
            onNavigate={onNavigate}
            className="rounded-lg bg-white px-7 py-3 text-center font-bold text-blue-800 shadow-lg transition hover:bg-blue-50"
          >
            Inscrire mon enfant
          </PublicLink>
          <PublicLink
            to="education"
            onNavigate={onNavigate}
            className="rounded-lg px-7 py-3 text-center font-semibold text-white ring-2 ring-white/70 transition hover:bg-white/10"
          >
            Découvrir nos cycles
          </PublicLink>
        </div>
      </div>

      {/* Cartes photo des élèves, une par cycle. Défilables sur petit écran. */}
      <div className="-mx-4 overflow-x-auto overflow-y-hidden px-4 lg:col-span-7 lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="flex w-max items-center gap-3 py-16 lg:mx-auto lg:w-auto lg:justify-center lg:py-12 xl:gap-4">
          {CYCLE_INFOS.map((cycle, index) => (
            <li
              key={cycle.id}
              className="shrink-0"
              style={{ transform: `rotate(7deg) translateY(${CARD_OFFSETS[index % CARD_OFFSETS.length]}px)` }}
            >
              <StudentPhotoCard
                cycle={cycle}
                className="h-[220px] w-[118px] sm:h-[260px] sm:w-[130px] lg:h-[300px] lg:w-[100px] xl:h-[350px] xl:w-[126px]"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default HeroBanner;
