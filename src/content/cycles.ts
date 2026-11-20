// Contenu des pages publiques sur les cycles d'enseignement (système éducatif
// de la République du Congo). Texte en français uniquement.
import type { SchoolCycle } from '../lib/levels';

// Tenues scolaires : décret du 30 août 2023 portant uniformisation de la tenue
// scolaire en République du Congo (établissements publics et privés).
export type Outfit = {
  shirt: string;
  bottom: string;
  kind: 'apron' | 'pants' | 'skirt';
  epaulettes?: boolean;
};

export interface CycleInfo {
  id: Exclude<SchoolCycle, 'superieur'>;
  name: string;
  ages: string;
  levels: string[];
  exam?: { short: string; long: string };
  summary: string;
  details: string[];
  uniform: string;
  // Deux silhouettes dessinées dans la bannière en l'absence de vraie photo.
  outfits: [Outfit, Outfit];
  // Couleur de la bande en haut de la carte photo.
  accent: string;
  // Photo d'élèves : à déposer dans public/Images/eleves/ (voir LISEZ-MOI.txt).
  photo: string;
}

const KAKI = '#c2a46a';
const BLEU_FONCE = '#1f3a6d';
const BLEU_CIEL = '#8fcbe8';
const BLEU = '#2d5ca8';
const ROSE = '#f2a7c3';

export const CYCLE_INFOS: CycleInfo[] = [
  {
    id: 'garderie',
    name: 'Garderie',
    ages: 'Les tout-petits',
    levels: ['Garderie'],
    summary:
      "Un premier pas en douceur hors de la maison : éveil, jeux, chants et apprentissage de la vie en groupe, dans un cadre sécurisé.",
    details: [
      'Accueil bienveillant et encadrement attentif',
      'Activités d’éveil : chants, comptines, jeux, motricité',
      'Apprentissage de la propreté, du partage et de l’autonomie',
    ],
    uniform: 'Tablier de l’établissement : rose pour les filles, bleu ciel pour les garçons.',
    outfits: [
      { shirt: ROSE, bottom: ROSE, kind: 'apron' },
      { shirt: BLEU_CIEL, bottom: BLEU_CIEL, kind: 'apron' },
    ],
    accent: '#22c55e',
    photo: '/Images/eleves/garderie.jpg',
  },
  {
    id: 'prescolaire',
    name: 'Préscolaire',
    ages: '3 à 5 ans',
    levels: ['Petite Section', 'Moyenne Section', 'Grande Section'],
    summary:
      "Le préscolaire prépare l'entrée au CP1 : langage, pré-lecture, pré-écriture, premiers nombres, dessin et activités manuelles.",
    details: [
      'Développement du langage et de l’expression orale',
      'Pré-lecture, graphisme et premiers nombres',
      'Éveil artistique, musical et spirituel',
    ],
    uniform: 'Tablier : rose pour les filles, bleu ciel pour les garçons.',
    outfits: [
      { shirt: ROSE, bottom: ROSE, kind: 'apron' },
      { shirt: BLEU_CIEL, bottom: BLEU_CIEL, kind: 'apron' },
    ],
    accent: '#3b82f6',
    photo: '/Images/eleves/prescolaire.jpg',
  },
  {
    id: 'primaire',
    name: 'Primaire',
    ages: '6 à 11 ans',
    levels: ['CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'],
    exam: { short: 'CEPE', long: "Certificat d'Études Primaires Élémentaires" },
    summary:
      "Six années pour maîtriser la lecture, l'écriture et le calcul, et découvrir les sciences, l'histoire, la géographie et l'éducation civique.",
    details: [
      'Français, mathématiques, sciences d’observation',
      'Histoire, géographie, éducation civique et morale',
      'Classe de CM2 : préparation au CEPE',
    ],
    uniform: 'Chemise kaki, jupe ou pantalon bleu foncé.',
    outfits: [
      { shirt: KAKI, bottom: BLEU_FONCE, kind: 'skirt' },
      { shirt: KAKI, bottom: BLEU_FONCE, kind: 'pants' },
    ],
    accent: '#d946ef',
    photo: '/Images/eleves/primaire.jpg',
  },
  {
    id: 'college',
    name: 'Collège',
    ages: '6ème à 3ème',
    levels: ['6ème', '5ème', '4ème', '3ème'],
    exam: { short: 'BEPC', long: "Brevet d'Études du Premier Cycle" },
    summary:
      "Le premier cycle du secondaire consolide les fondamentaux et ouvre aux langues vivantes, aux sciences physiques et aux SVT.",
    details: [
      'Français, mathématiques, anglais, histoire-géographie',
      'Sciences physiques, SVT, éducation physique et sportive',
      'Classe de 3ème : préparation au BEPC et orientation au lycée',
    ],
    uniform:
      'Garçons : chemise kaki à manches courtes avec épaulettes, pantalon kaki. Filles : chemise bleu ciel, pantalon bleu.',
    outfits: [
      { shirt: BLEU_CIEL, bottom: BLEU, kind: 'pants' },
      { shirt: KAKI, bottom: KAKI, kind: 'pants', epaulettes: true },
    ],
    accent: '#f97316',
    photo: '/Images/eleves/college.jpg',
  },
  {
    id: 'lycee',
    name: 'Lycée',
    ages: 'Seconde à Terminale',
    levels: ['Seconde', 'Première', 'Terminale'],
    exam: { short: 'BAC', long: "Baccalauréat de l'enseignement général" },
    summary:
      "Le second cycle prépare au Baccalauréat dans les séries littéraires et scientifiques, et à la poursuite d'études supérieures.",
    details: [
      'Séries A (littéraire), C (mathématiques et sciences physiques), D (sciences de la vie et de la Terre)',
      'Philosophie, langues vivantes, mathématiques, sciences',
      'Classe de Terminale : préparation au Baccalauréat',
    ],
    uniform:
      'Garçons : chemise kaki à manches courtes avec épaulettes, pantalon kaki. Filles : chemise bleu ciel, pantalon bleu.',
    outfits: [
      { shirt: KAKI, bottom: KAKI, kind: 'pants', epaulettes: true },
      { shirt: BLEU_CIEL, bottom: BLEU, kind: 'pants' },
    ],
    accent: '#14b8a6',
    photo: '/Images/eleves/lycee.jpg',
  },
];
