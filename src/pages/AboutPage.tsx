import React from 'react';
import { BookHeart, Hammer, MapPin, Trophy } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';
import { PublicPage } from '../components/PublicHeader';
import { PageBanner, SectionTitle } from '../components/public/PublicBlocks';
import { siteConfig } from '../config/site.config';

interface PageProps {
  onNavigate: (page: PublicPage) => void;
  onLoginClick: () => void;
}

const MOTTO = [
  { icon: BookHeart, word: 'Amour', text: 'Respect, bienveillance et esprit de famille.' },
  { icon: Hammer, word: 'Travail', text: 'Effort, rigueur et persévérance au quotidien.' },
  { icon: Trophy, word: 'Réussite', text: 'Réussir ses examens et grandir en responsabilité.' },
];

const TEAM = [
  { role: "Chef d'établissement", detail: siteConfig.reportCard.headName || 'Direction' },
  { role: 'Direction des études', detail: 'Pédagogie et examens' },
  { role: 'Secrétariat', detail: 'Inscriptions et accueil' },
  { role: 'Économat', detail: 'Frais de scolarité' },
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
        description="Au service des familles de Nkayi, de la garderie à la Terminale."
      />

      <section className="container mx-auto px-4 py-16 lg:px-8">
        <SectionTitle eyebrow="Notre devise" title={siteConfig.reportCard.schoolMotto} center />
        <div className="grid gap-5 md:grid-cols-3">
          {MOTTO.map(({ icon: Icon, word, text }) => (
            <div key={word} className="border-t-4 border-brand bg-white p-7 text-center shadow-md">
              <Icon className="mx-auto h-9 w-9 text-brand" />
              <h3 className="mt-4 font-display text-2xl font-semibold uppercase text-navy">{word}</h3>
              <p className="mt-2 text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container mx-auto grid gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionTitle eyebrow="Organisation" title="L'équipe" light />
            <ul className="divide-y divide-white/10">
              {TEAM.map((member) => (
                <li key={member.role} className="flex justify-between gap-4 py-3">
                  <span className="font-semibold">{member.role}</span>
                  <span className="text-end text-sm text-gray-400">{member.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle eyebrow="Nous trouver" title="À Nkayi" light />
            <div className="flex items-start gap-4">
              <MapPin className="h-7 w-7 shrink-0 text-brand" />
              <div>
                {siteConfig.contact.addressLines.map((line) => (
                  <p key={line} className="text-gray-200">{line}</p>
                ))}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block font-display text-sm font-semibold uppercase tracking-wider text-brand hover:text-white"
                >
                  Ouvrir dans Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default AboutPage;
