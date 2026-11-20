import React, { useState } from 'react';
import type { CycleInfo, Outfit } from '../../content/cycles';

const SKIN = '#7b4a2c';
const HAIR = '#1b120d';
const SHOES = '#1f2937';

// Silhouette d'élève dans la tenue officielle de son cycle (affichée tant
// qu'aucune vraie photo n'a été déposée dans public/Images/eleves/).
const UniformFigure: React.FC<{ outfit: Outfit; girl?: boolean }> = ({ outfit, girl }) => {
  const shade = 'rgba(0,0,0,0.12)';
  return (
    <svg viewBox="19 2 62 184" preserveAspectRatio="xMidYMax meet" className="h-full w-full" aria-hidden="true">
      {/* bras */}
      <rect x="21" y="58" width="11" height="50" rx="5.5" fill={SKIN} />
      <rect x="68" y="58" width="11" height="50" rx="5.5" fill={SKIN} />
      {/* cou et tête */}
      <rect x="45" y="44" width="10" height="14" fill={SKIN} />
      <circle cx="50" cy="32" r="16" fill={SKIN} />
      <path d="M34 31a16 16 0 0 1 32 0c-6-6-26-6-32 0z" fill={HAIR} />
      {girl && (
        <>
          <circle cx="36" cy="20" r="5" fill={HAIR} />
          <circle cx="64" cy="20" r="5" fill={HAIR} />
        </>
      )}
      {/* jambes */}
      {outfit.kind !== 'pants' && (
        <>
          <rect x="38" y="120" width="9" height="56" rx="3" fill={SKIN} />
          <rect x="53" y="120" width="9" height="56" rx="3" fill={SKIN} />
        </>
      )}
      {outfit.kind === 'pants' && (
        <>
          <rect x="33" y="104" width="16" height="72" rx="3" fill={outfit.bottom} />
          <rect x="51" y="104" width="16" height="72" rx="3" fill={outfit.bottom} />
          <rect x="49" y="104" width="2" height="60" fill={shade} />
        </>
      )}
      {outfit.kind === 'skirt' && <path d="M31 104h38l7 34H24z" fill={outfit.bottom} />}
      {/* haut : chemise ou tablier */}
      {outfit.kind === 'apron' ? (
        <path d="M31 56h38l9 92H22z" fill={outfit.shirt} />
      ) : (
        <path d="M31 56h38l2 52H29z" fill={outfit.shirt} />
      )}
      {/* manches courtes */}
      <path d="M31 56l-11 6 2 16 11-3z" fill={outfit.shirt} />
      <path d="M69 56l11 6-2 16-11-3z" fill={outfit.shirt} />
      {/* col et boutons */}
      <path d="M42 56l8 10 8-10" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinejoin="round" />
      {outfit.kind !== 'apron' && (
        <>
          <circle cx="50" cy="76" r="1.4" fill={shade} />
          <circle cx="50" cy="88" r="1.4" fill={shade} />
          <circle cx="50" cy="100" r="1.4" fill={shade} />
        </>
      )}
      {outfit.kind === 'apron' && <rect x="38" y="96" width="24" height="16" rx="3" fill="rgba(255,255,255,0.35)" />}
      {outfit.epaulettes && (
        <>
          <rect x="30" y="55" width="13" height="4" rx="1.5" fill="#8a7244" />
          <rect x="57" y="55" width="13" height="4" rx="1.5" fill="#8a7244" />
        </>
      )}
      {/* chaussures */}
      <rect x="32" y="174" width="17" height="8" rx="4" fill={SHOES} />
      <rect x="51" y="174" width="17" height="8" rx="4" fill={SHOES} />
    </svg>
  );
};

interface StudentPhotoCardProps {
  cycle: CycleInfo;
  className?: string;
  style?: React.CSSProperties;
  showLabel?: boolean;
}

// Carte photo verticale de la bannière : vraie photo si elle existe, sinon
// illustration des tenues officielles. La photo n'apparaît qu'une fois chargée,
// pour ne jamais afficher d'icône d'image cassée.
const StudentPhotoCard: React.FC<StudentPhotoCardProps> = ({ cycle, className = '', style, showLabel = true }) => {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoMissing, setPhotoMissing] = useState(false);

  return (
    <figure
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 ${className}`}
      style={style}
    >
      <div className="absolute inset-x-0 top-0 z-20 h-2" style={{ backgroundColor: cycle.accent }} />

      <div
        className="absolute inset-0 flex items-end justify-center pb-10 pt-6"
        style={{ background: `linear-gradient(180deg, #f8fafc 0%, ${cycle.accent}33 100%)` }}
      >
        <div className="flex h-[80%] w-full items-end justify-center gap-0.5 px-1.5">
          <div className="h-full min-w-0 flex-1">
            <UniformFigure outfit={cycle.outfits[0]} girl />
          </div>
          <div className="h-full min-w-0 flex-1">
            <UniformFigure outfit={cycle.outfits[1]} />
          </div>
        </div>
      </div>

      {!photoMissing && (
        <img
          src={cycle.photo}
          alt={`Élèves du cycle ${cycle.name} en tenue scolaire`}
          loading="lazy"
          onLoad={() => setPhotoLoaded(true)}
          onError={() => setPhotoMissing(true)}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-500 ${
            photoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {showLabel && (
        <figcaption className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-6 text-center">
          <span className="block text-xs font-bold uppercase tracking-wide text-white sm:text-sm">{cycle.name}</span>
        </figcaption>
      )}
    </figure>
  );
};

export default StudentPhotoCard;
