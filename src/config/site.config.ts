// Contenu personnalisable par école : modifier ce fichier (et lui seul) suffit
// à adapter le nom, le logo, les textes et les coordonnées d'un site cloné.
import type { SchoolCycle } from '../lib/levels';

export const siteConfig = {
  // URL publique du site (sans slash final) : utilisée pour le SEO
  // (balises canonical/Open Graph, robots.txt, sitemap.xml).
  // À METTRE À JOUR avec l'adresse donnée par Vercel.
  siteUrl: 'https://cs-emmanuel-nkayi.vercel.app',
  schoolName: 'Complexe Scolaire Emmanuel',
  tagline: 'Plateforme scolaire en ligne',
  // Chemin absolu depuis public/ : sert aussi de favicon et d'image de partage.
  logoUrl: '/Images/logo-cs-emmanuel.png',
  logoFallbackInitials: 'CE',
  // Cycles proposés par l'établissement, du plus jeune au plus âgé.
  cycles: ['garderie', 'prescolaire', 'primaire', 'college', 'lycee'] as SchoolCycle[],
  hero: {
    title: 'Amour – Travail – Réussite, de la garderie au lycée',
    description:
      "La plateforme du Complexe Scolaire Emmanuel de Nkayi : notes, bulletins, emplois du temps, frais de scolarité et échanges entre l'école et les familles, accessibles en ligne.",
  },
  stats: [
    { value: '5', label: 'Cycles' },
    { value: '24h/24', label: 'Accès' },
    { value: '100%', label: 'En ligne' },
  ],
  about: {
    title: 'Complexe Scolaire Emmanuel',
    description:
      'Un établissement de Nkayi qui accompagne chaque élève de la garderie au lycée, autour de sa devise : Amour – Travail – Réussite.',
  },
  contact: {
    addressLines: ['Rue Nzaou Kayes, n° 47', 'Nkayi, République du Congo'],
    // À REMPLACER par l'adresse email de l'établissement.
    email: 'contact@exemple.com',
    // Plusieurs numéros séparés par « / » : le premier sert au lien d'appel.
    phone: '+242 06 955 00 13',
  },
  copyrightOwner: 'Complexe Scolaire Emmanuel',
  // En-tête officiel du bulletin de notes (imprimé tel quel, sans traduction).
  reportCard: {
    authorityLines: [
      "MINISTÈRE DE L'ENSEIGNEMENT PRÉSCOLAIRE, PRIMAIRE, SECONDAIRE ET DE L'ALPHABÉTISATION",
      "DIRECTION DÉPARTEMENTALE DE L'ENSEIGNEMENT PRÉSCOLAIRE, PRIMAIRE, SECONDAIRE ET DE L'ALPHABÉTISATION DE LA BOUENZA",
    ],
    country: 'RÉPUBLIQUE DU CONGO',
    countryMotto: 'Unité – Travail – Progrès',
    schoolMotto: 'Amour – Travail – Réussite',
    address: 'Rue Nzaou Kayes, n° 47',
    city: 'Nkayi',
    // Nom imprimé sous « Le chef d'établissement » (laisser vide pour signer à la main).
    headName: 'Durand Précieux MANKESSI',
  },
};

export type SiteConfig = typeof siteConfig;

// L'adresse d'exemple n'est jamais affichée aux visiteurs.
export const hasPublicEmail = (): boolean =>
  Boolean(siteConfig.contact.email) && !/@exemple\.com$/i.test(siteConfig.contact.email);

// Lien d'appel : seul le premier numéro est composé.
export const phoneHref = (phone: string): string => `tel:${phone.split('/')[0].replace(/\s/g, '')}`;
