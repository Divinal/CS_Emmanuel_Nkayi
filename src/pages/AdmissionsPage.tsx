import React from 'react';
import { ChevronDown, FileCheck2, Phone } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { BTN_OUTLINE, BTN_RED, PageBanner, PublicLink, SectionTitle } from '../components/public/PublicBlocks';
import { siteConfig, phoneHref } from '../config/site.config';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const STEPS = [
  { title: 'Contact', text: 'Appelez ou passez au secrétariat.' },
  { title: 'Dossier', text: 'Déposez les pièces demandées.' },
  { title: 'Inscription', text: 'Réglez les frais, recevez votre reçu.' },
  { title: 'Accès en ligne', text: 'Suivez notes et bulletins.' },
];

const DOCUMENTS = [
  { label: "Extrait d'acte de naissance", scope: 'Tous' },
  { label: "Photos d'identité", scope: 'Tous' },
  { label: 'Carnet de vaccination', scope: 'Garderie, préscolaire' },
  { label: "Bulletins de l'année précédente", scope: 'Dès le CP2' },
  { label: 'Exeat ou certificat de scolarité', scope: "Changement d'école" },
];

const FAQ = [
  {
    question: "Peut-on inscrire un enfant en cours d'année ?",
    answer: 'Oui, selon les places disponibles. Prévoyez son exeat et ses derniers bulletins.',
  },
  {
    question: 'Comment se paient les frais de scolarité ?',
    answer: "Les montants sont donnés par le secrétariat. Chaque paiement donne un reçu, visible aussi dans l'espace en ligne.",
  },
  {
    question: 'Comment suivre les notes de mon enfant ?',
    answer: "Connectez-vous à l'espace en ligne avec les identifiants remis par l'administration.",
  },
];

const AdmissionsPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="admissions" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Admissions"
      title="Inscrire votre enfant"
      description="Quatre étapes simples, de la garderie à la Terminale."
    />

    <section className="container mx-auto px-4 py-16 lg:px-8">
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="bg-white p-6 shadow-md">
            <span className="font-display text-4xl font-semibold text-brand">0{index + 1}</span>
            <h3 className="mt-2 font-display text-lg font-semibold uppercase text-navy">{step.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="bg-white">
      <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle eyebrow="Dossier" title="Pièces à fournir" />
          <ul className="divide-y">
            {DOCUMENTS.map((doc) => (
              <li key={doc.label} className="flex items-center gap-3 py-3">
                <FileCheck2 className="h-5 w-5 shrink-0 text-brand" />
                <span className="flex-1 font-medium text-navy">{doc.label}</span>
                <span className="text-end text-sm text-gray-500">{doc.scope}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionTitle eyebrow="FAQ" title="Questions fréquentes" />
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.question} className="group bg-gray-100">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-navy">
                  {item.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-brand transition group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-gray-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-navy text-white">
      <div className="container mx-auto flex flex-col items-center gap-6 px-4 py-14 text-center lg:px-8">
        <h2 className="font-display text-2xl font-semibold uppercase md:text-3xl">Réservez la place de votre enfant</h2>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <a
            href={phoneHref(siteConfig.contact.phone)}
            className={BTN_OUTLINE}
          >
            <Phone className="h-4 w-4" />
            {siteConfig.contact.phone}
          </a>
          <PublicLink to="contact" onNavigate={onNavigate} className={BTN_RED}>
            Faire une demande
          </PublicLink>
        </div>
      </div>
    </section>
  </PublicLayout>
);

export default AdmissionsPage;
