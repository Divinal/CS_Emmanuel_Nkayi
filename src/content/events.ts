// Agenda public de l'établissement (pages Accueil et Actualités).
// Pour ajouter un événement : copier un bloc, changer la date (AAAA-MM-JJ),
// le titre et le texte. Le site range seul les événements « à venir » et « passés ».
// Les dates des examens d'État sont fixées chaque année par le ministère :
// garder « dateLabel » tant que la date officielle n'est pas publiée.

export type EventCategory = 'Vie de l’école' | 'Examens' | 'Spirituel' | 'Fête nationale' | 'Inscriptions' | 'Sport et culture';

export interface SchoolEvent {
  id: string;
  date: string; // AAAA-MM-JJ : sert au tri et à la séparation à venir / passé
  endDate?: string;
  dateLabel?: string; // remplace la date affichée (ex. « Juin 2027 »)
  title: string;
  description: string;
  category: EventCategory;
  place?: string;
}

export const CATEGORY_STYLES: Record<EventCategory, string> = {
  'Vie de l’école': 'bg-blue-100 text-blue-700',
  Examens: 'bg-red-100 text-red-700',
  Spirituel: 'bg-purple-100 text-purple-700',
  'Fête nationale': 'bg-green-100 text-green-700',
  Inscriptions: 'bg-amber-100 text-amber-800',
  'Sport et culture': 'bg-teal-100 text-teal-700',
};

export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'rentree-2026',
    date: '2026-10-05',
    dateLabel: 'Octobre 2026',
    title: 'Rentrée scolaire 2026-2027',
    description:
      "Reprise des cours pour tous les cycles, de la garderie au lycée. Accueil des nouveaux élèves et des familles, présentation des équipes pédagogiques.",
    category: 'Vie de l’école',
    place: 'Complexe Scolaire Emmanuel',
  },
  {
    id: 'fete-republique-2026',
    date: '2026-11-28',
    title: 'Fête de la Proclamation de la République',
    description:
      "Jour férié national : pas de cours. Les élèves sont invités à revoir en famille le sens de cette date dans l'histoire du Congo.",
    category: 'Fête nationale',
  },
  {
    id: 'compositions-t1-2026',
    date: '2026-12-07',
    dateLabel: 'Décembre 2026',
    title: 'Compositions du premier trimestre',
    description:
      "Évaluations de fin de trimestre dans tous les niveaux. Le calendrier détaillé par classe est communiqué aux élèves. Les bulletins sont ensuite disponibles dans l'espace en ligne.",
    category: 'Examens',
  },
  {
    id: 'noel-2026',
    date: '2026-12-18',
    dateLabel: 'Décembre 2026',
    title: 'Fête de Noël de l’école',
    description:
      "Chants, saynètes et récitations préparés par les élèves de la garderie au lycée, suivis d'un moment de partage avec les familles avant les congés de fin d'année.",
    category: 'Vie de l’école',
    place: 'Cour de l’établissement',
  },
  {
    id: 'inscriptions-2027',
    date: '2027-01-11',
    dateLabel: 'À partir de janvier 2027',
    title: 'Pré-inscriptions pour l’année 2027-2028',
    description:
      "Ouverture des pré-inscriptions pour les nouveaux élèves de tous les cycles. Renseignements et retrait du dossier au secrétariat ou via le formulaire de contact.",
    category: 'Inscriptions',
    place: 'Secrétariat',
  },
  {
    id: 'journee-femme-2027',
    date: '2027-03-08',
    title: 'Journée internationale des droits des femmes',
    description:
      "Activités de sensibilisation et exposés sur la place des femmes dans la société congolaise, préparés par les élèves du collège et du lycée.",
    category: 'Sport et culture',
  },
  {
    id: 'compositions-t2-2027',
    date: '2027-03-15',
    dateLabel: 'Mars 2027',
    title: 'Compositions du deuxième trimestre',
    description: "Évaluations de fin de deuxième trimestre dans tous les niveaux, avant les congés de Pâques.",
    category: 'Examens',
  },
  {
    id: 'semaine-sportive-2027',
    date: '2027-04-26',
    dateLabel: 'Avril 2027',
    title: 'Semaine sportive et culturelle',
    description:
      "Tournois inter-classes de football, handball et athlétisme, concours de lecture, de dictée et de dessin. Remise de diplômes aux vainqueurs.",
    category: 'Sport et culture',
  },
  {
    id: 'examens-etat-2027',
    date: '2027-06-01',
    dateLabel: 'Juin – juillet 2027',
    title: 'Examens d’État : CEPE, BEPC et BAC',
    description:
      "Les élèves de CM2, de 3ème et de Terminale passent les examens nationaux. Les dates officielles sont fixées par le ministère de l'Enseignement préscolaire, primaire, secondaire et de l'alphabétisation.",
    category: 'Examens',
  },
  {
    id: 'fin-annee-2027',
    date: '2027-07-02',
    dateLabel: 'Fin juin 2027',
    title: 'Kermesse et remise des prix',
    description:
      "Fête de fin d'année : récompense des meilleurs élèves de chaque classe, spectacles des élèves et kermesse ouverte aux familles.",
    category: 'Vie de l’école',
    place: 'Cour de l’établissement',
  },
];

const todayIso = (): string => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// Un événement reste « à venir » jusqu'à la fin de son dernier jour.
export const upcomingEvents = (): SchoolEvent[] => {
  const today = todayIso();
  return SCHOOL_EVENTS.filter((event) => (event.endDate || event.date) >= today).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
};

export const pastEvents = (): SchoolEvent[] => {
  const today = todayIso();
  return SCHOOL_EVENTS.filter((event) => (event.endDate || event.date) < today).sort((a, b) =>
    b.date.localeCompare(a.date),
  );
};

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

// Pastille de calendrier : jour + mois abrégé (ou rien si la date est approximative).
export const eventBadge = (event: SchoolEvent): { day: string; month: string; year: string } => {
  const [year, month, day] = event.date.split('-');
  return { day: event.dateLabel ? '•' : String(Number(day)), month: MONTHS[Number(month) - 1], year };
};

export const eventDateText = (event: SchoolEvent): string => {
  if (event.dateLabel) return event.dateLabel;
  const [year, month, day] = event.date.split('-').map(Number);
  const text = new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
};
