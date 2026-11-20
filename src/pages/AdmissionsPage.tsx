import React from 'react';
import { ChevronDown, FileCheck2, Phone, Receipt, School } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { PageBanner, PromoBanner, PublicLink, SectionTitle } from '../components/public/PublicBlocks';
import { siteConfig, phoneHref } from '../config/site.config';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const STEPS = [
  { title: 'Prise de contact', text: 'Passez au secrétariat, appelez-nous ou envoyez un message depuis le site pour connaître les places disponibles.' },
  { title: 'Dépôt du dossier', text: 'Remettez au secrétariat les pièces demandées pour le niveau souhaité.' },
  { title: 'Étude du dossier', text: "La direction examine le dossier et peut proposer un entretien ou un test de niveau, notamment en cas de changement d'école." },
  { title: 'Inscription définitive', text: "Après règlement des frais d'inscription, un reçu vous est remis et votre enfant est affecté dans sa classe." },
  { title: 'Accès en ligne', text: "L'administration vous transmet les identifiants de l'espace élève pour suivre notes, bulletins et paiements." },
];

const DOCUMENTS = [
  { label: "Extrait d'acte de naissance", scope: 'Tous les cycles' },
  { label: "Photos d'identité récentes", scope: 'Tous les cycles' },
  { label: 'Carnet de vaccination à jour', scope: 'Garderie et préscolaire' },
  { label: "Bulletins de l'année précédente", scope: 'À partir du CP2' },
  { label: 'Certificat de scolarité ou exeat', scope: "En cas de changement d'école" },
  { label: 'Attestation de réussite au CEPE', scope: 'Entrée en 6ème' },
  { label: 'Attestation de réussite au BEPC', scope: 'Entrée en Seconde' },
];

const FAQ = [
  {
    question: "Peut-on inscrire un enfant en cours d'année ?",
    answer:
      "Oui, selon les places disponibles dans la classe demandée. Pour un élève venant d'un autre établissement, prévoyez son exeat ou un certificat de scolarité et ses derniers bulletins.",
  },
  {
    question: 'Comment se paient les frais de scolarité ?',
    answer:
      "Les montants et les échéances sont communiqués par le secrétariat au moment de l'inscription. Chaque paiement donne lieu à un reçu, que vous retrouvez aussi dans l'espace en ligne de l'élève.",
  },
  {
    question: 'Quelle tenue mon enfant doit-il porter ?',
    answer:
      "La tenue scolaire officielle du Congo, selon le cycle : tablier au préscolaire, chemise kaki et bas bleu foncé au primaire, kaki pour les garçons et bleu ciel / bleu pour les filles au collège et au lycée. Le détail est sur la page Vie scolaire.",
  },
  {
    question: 'Comment suivre les notes de mon enfant ?',
    answer:
      "Avec les identifiants remis par l'administration, connectez-vous à l'espace en ligne : notes, bulletins, emploi du temps, absences et reçus de paiement y sont disponibles à tout moment.",
  },
  {
    question: "J'ai oublié le mot de passe de l'espace élève. Que faire ?",
    answer:
      "Adressez-vous au secrétariat ou à la direction : un nouveau mot de passe temporaire vous sera remis, à changer à la première connexion.",
  },
  {
    question: "Mon enfant est en classe d'examen. Comment s'inscrit-il au CEPE, au BEPC ou au BAC ?",
    answer:
      "L'établissement constitue les dossiers de candidature des élèves de CM2, de 3ème et de Terminale et informe les familles des pièces à fournir et des dates fixées par le ministère.",
  },
];

const AdmissionsPage: React.FC<PageProps> = ({ onNavigate, onLoginClick }) => (
  <PublicLayout currentPage="admissions" onNavigate={onNavigate} onLoginClick={onLoginClick}>
    <PageBanner
      eyebrow="Admissions"
      title="Inscrire votre enfant"
      description="De la garderie à la Terminale, voici comment se déroule une inscription au Complexe Scolaire Évangélique de Nkayi, et les pièces à préparer."
    />

    <section className="container mx-auto px-4 py-14 lg:px-8">
      <SectionTitle eyebrow="Démarche" title="Les étapes de l'inscription" />
      <ol className="grid gap-5 md:grid-cols-5">
        {STEPS.map((step, index) => (
          <li key={step.title} className="relative rounded-xl bg-white p-5 shadow-md ring-1 ring-gray-100">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {index + 1}
            </span>
            <h3 className="font-bold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="bg-white">
      <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-2 lg:px-8">
        <div>
          <SectionTitle eyebrow="Dossier" title="Pièces à fournir" />
          <ul className="divide-y rounded-xl ring-1 ring-gray-200">
            {DOCUMENTS.map((doc) => (
              <li key={doc.label} className="flex items-start gap-3 px-5 py-3.5">
                <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:gap-4">
                  <span className="font-medium text-gray-900">{doc.label}</span>
                  <span className="text-sm text-gray-500">{doc.scope}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            Liste indicative : le secrétariat vous confirme les pièces exigées pour chaque niveau.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <SectionTitle eyebrow="Calendrier" title="Quand s'inscrire ?" />
            <p className="leading-relaxed text-gray-700">
              Pensez à inscrire votre enfant avant la rentrée d'octobre : les places sont limitées dans chaque classe.
              Les périodes de pré-inscription pour l'année suivante sont annoncées dans l'agenda du site. Une
              inscription en cours d'année reste possible selon les places disponibles.
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 p-6 ring-1 ring-blue-100">
            <div className="flex items-start gap-3">
              <Receipt className="h-6 w-6 shrink-0 text-blue-700" />
              <div>
                <h3 className="font-bold text-blue-900">Frais d'inscription et de scolarité</h3>
                <p className="mt-1 text-sm leading-relaxed text-blue-900/80">
                  Les montants varient selon le cycle et sont communiqués par le secrétariat. Chaque versement donne
                  lieu à un reçu officiel, consultable dans l'espace en ligne de l'élève.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-green-50 p-6 ring-1 ring-green-100">
            <div className="flex items-start gap-3">
              <Phone className="h-6 w-6 shrink-0 text-green-700" />
              <div>
                <h3 className="font-bold text-green-900">Secrétariat</h3>
                <a href={phoneHref(siteConfig.contact.phone)} className="mt-1 block text-sm font-semibold text-green-800 hover:underline">
                  {siteConfig.contact.phone}
                </a>
                <p className="text-sm text-green-900/80">{siteConfig.contact.addressLines.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" className="container mx-auto px-4 py-14 lg:px-8">
      <SectionTitle eyebrow="FAQ" title="Questions fréquentes" />
      <div className="max-w-4xl space-y-3">
        {FAQ.map((item) => (
          <details key={item.question} className="group rounded-xl bg-white shadow-sm ring-1 ring-gray-100 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-gray-900">
              {item.question}
              <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-gray-600">{item.answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-6 text-gray-600">
        Vous ne trouvez pas votre réponse ?{' '}
        <PublicLink to="contact" onNavigate={onNavigate} className="font-semibold text-blue-700 hover:underline">
          Écrivez-nous
        </PublicLink>
        .
      </p>
    </section>

    <div className="container mx-auto px-4 pb-16 lg:px-8">
      <PromoBanner
        tone="amber"
        icon={School}
        eyebrow="Inscriptions"
        title="Réservez dès maintenant la place de votre enfant"
        text="Envoyez votre demande depuis le site en choisissant l'objet « Inscription » : le secrétariat vous recontacte pour fixer un rendez-vous."
        cta={{ label: 'Faire une demande', to: 'contact' }}
        onNavigate={onNavigate}
      />
    </div>
  </PublicLayout>
);

export default AdmissionsPage;
