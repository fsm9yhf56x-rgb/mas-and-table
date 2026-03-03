// Mas & Table — Icon System
// Usage: <IconDate size={24} />
// Toutes les icônes acceptent size (défaut 24) et className

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  accentColor?: string;
}

const c = "#2C2C2C";
const olive = "#6B7C5C";

// ─────────────────────────────────────────
// FONCTIONNELLES
// ─────────────────────────────────────────

export function IconDate({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <rect x="2.5" y="4" width="21" height="19.5" rx="1.5" stroke={c} strokeWidth="0.75" opacity="0.7"/>
      <line x1="2.5" y1="9.5" x2="23.5" y2="9.5" stroke={c} strokeWidth="0.6" opacity="0.4"/>
      <path d="M8.5 2 C8.5 2 8 3 8 4 C8 5 8.5 5.5 9 5.5 C9.5 5.5 10 5 10 4 C10 3 9.5 2 9.5 2" stroke={olive} strokeWidth="0.75" fill="none" strokeLinecap="round"/>
      <path d="M16.5 2 C16.5 2 16 3 16 4 C16 5 16.5 5.5 17 5.5 C17.5 5.5 18 5 18 4 C18 3 17.5 2 17.5 2" stroke={olive} strokeWidth="0.75" fill="none" strokeLinecap="round"/>
      <circle cx="8" cy="14.5" r="1.2" fill={olive} opacity="0.5"/>
      <circle cx="13" cy="14.5" r="0.8" fill={c} opacity="0.15"/>
      <circle cx="18" cy="14.5" r="0.8" fill={c} opacity="0.15"/>
      <circle cx="8" cy="19" r="0.8" fill={c} opacity="0.15"/>
      <circle cx="13" cy="19" r="0.8" fill={c} opacity="0.15"/>
      <circle cx="18" cy="19" r="0.8" fill={c} opacity="0.15"/>
    </svg>
  );
}

export function IconGuests({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="10" cy="8" r="3.2" stroke={c} strokeWidth="0.75" opacity="0.7"/>
      <path d="M3.5 23 C3.5 18.5 6.5 15.5 10 15.5 C13.5 15.5 16.5 18.5 16.5 23" stroke={c} strokeWidth="0.75" fill="none" opacity="0.7" strokeLinecap="round"/>
      <circle cx="18.5" cy="9" r="2.3" stroke={olive} strokeWidth="0.6" opacity="0.5"/>
      <path d="M15 23 C15 20 16.5 18 19 18 C21 18 22.5 19.5 22.5 22" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.5" strokeLinecap="round"/>
    </svg>
  );
}

export function IconLocation({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 26" fill="none" className={className}>
      <path d="M12 2 C8 2 5 5.2 5 9 C5 14.5 12 24 12 24 C12 24 19 14.5 19 9 C19 5.2 16 2 12 2Z" stroke={c} strokeWidth="0.75" fill="none" opacity="0.65"/>
      <circle cx="12" cy="9" r="2.5" stroke={olive} strokeWidth="0.7" fill="none"/>
      <path d="M12 3.5 C13.5 2 15 2.5 14.5 4 C14 5 12.5 4.5 12 3.5Z" fill={olive} opacity="0.25"/>
    </svg>
  );
}

export function IconDuration({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="13" cy="13" r="10.5" stroke={c} strokeWidth="0.75" opacity="0.65"/>
      <ellipse cx="13" cy="4.5" rx="1" ry="1.5" fill={olive} opacity="0.2"/>
      <ellipse cx="13" cy="21.5" rx="1" ry="1.5" fill={olive} opacity="0.2"/>
      <ellipse cx="4.5" cy="13" rx="1.5" ry="1" fill={olive} opacity="0.2"/>
      <ellipse cx="21.5" cy="13" rx="1.5" ry="1" fill={olive} opacity="0.2"/>
      <line x1="13" y1="13" x2="13" y2="7.5" stroke={c} strokeWidth="0.85" strokeLinecap="round" opacity="0.7"/>
      <line x1="13" y1="13" x2="17" y2="16" stroke={olive} strokeWidth="0.85" strokeLinecap="round"/>
      <circle cx="13" cy="13" r="1.1" fill={c} opacity="0.6"/>
    </svg>
  );
}

export function IconPrice({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="13" cy="13" r="10.5" stroke={c} strokeWidth="0.75" opacity="0.65"/>
      <circle cx="13" cy="13" r="7.5" stroke={c} strokeWidth="0.4" opacity="0.2" strokeDasharray="1.2 2"/>
      <path d="M15.5 9 C14.5 8 13.5 7.5 12.5 7.5 C10.5 7.5 9 9.5 9 13 C9 16.5 10.5 18.5 12.5 18.5 C13.5 18.5 14.5 18 15.5 17" stroke={c} strokeWidth="0.85" fill="none" opacity="0.7" strokeLinecap="round"/>
      <line x1="8" y1="12" x2="14" y2="12" stroke={olive} strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="8" y1="14" x2="14" y2="14" stroke={olive} strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  );
}

export function IconEnglish({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="13" cy="13" r="10.5" stroke={c} strokeWidth="0.75" opacity="0.65"/>
      <path d="M13 2.5 C11 5.5 10.5 9 10.5 13 C10.5 17 11 20.5 13 23.5" stroke={c} strokeWidth="0.55" fill="none" opacity="0.4"/>
      <path d="M13 2.5 C15 5.5 15.5 9 15.5 13 C15.5 17 15 20.5 13 23.5" stroke={c} strokeWidth="0.55" fill="none" opacity="0.4"/>
      <path d="M2.5 10 Q13 8.5 23.5 10" stroke={olive} strokeWidth="0.55" fill="none" opacity="0.5"/>
      <path d="M2.5 16 Q13 17.5 23.5 16" stroke={olive} strokeWidth="0.55" fill="none" opacity="0.5"/>
    </svg>
  );
}

export function IconHost({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="13" cy="8.5" r="3.8" stroke={c} strokeWidth="0.75" opacity="0.65"/>
      <path d="M4.5 24 C4.5 19.5 8 16 13 16 C18 16 21.5 19.5 21.5 24" stroke={c} strokeWidth="0.75" fill="none" opacity="0.65" strokeLinecap="round"/>
      <circle cx="18" cy="15.5" r="1.1" fill={olive} opacity="0.35"/>
      <path d="M18 14.2 C18.5 14.6 18.7 15.1 18 15.5 C17.3 15.1 17.5 14.6 18 14.2Z" fill={olive} opacity="0.3"/>
    </svg>
  );
}

export function IconConfirmed({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="13" cy="13" r="10.5" stroke={olive} strokeWidth="0.75" opacity="0.6"/>
      <circle cx="13" cy="2.5" r="0.9" fill={olive} opacity="0.3"/>
      <circle cx="23.5" cy="13" r="0.9" fill={olive} opacity="0.3"/>
      <circle cx="13" cy="23.5" r="0.9" fill={olive} opacity="0.3"/>
      <circle cx="2.5" cy="13" r="0.9" fill={olive} opacity="0.3"/>
      <path d="M8.5 13.5 C10 15.5 11 16.5 13 16.5 C15 16.5 18 11 18 11" stroke={olive} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function IconEmail({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 24" fill="none" className={className}>
      <rect x="2" y="4" width="22" height="16" rx="1.5" stroke={c} strokeWidth="0.75" opacity="0.65"/>
      <path d="M2 5.5 L13 14 L24 5.5" stroke={c} strokeWidth="0.65" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 9.5 C13 9.5 11.5 8 11.5 7 C11.5 6.2 12.2 5.5 13 6.5 C13.8 5.5 14.5 6.2 14.5 7 C14.5 8 13 9.5 13 9.5Z" fill={olive} opacity="0.25"/>
    </svg>
  );
}

export function IconNext({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 20" fill="none" className={className}>
      <path d="M3 10 Q13 9 22 10" stroke={c} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M16.5 5.5 C20 8 22 10 22 10 C22 10 20 12 16.5 14.5" stroke={c} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="4.5" cy="10" r="1.5" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.5"/>
      <circle cx="4.5" cy="10" r="0.5" fill={olive} opacity="0.4"/>
    </svg>
  );
}

export function IconBack({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 20" fill="none" className={className}>
      <path d="M23 10 Q13 9 4 10" stroke={c} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M9.5 5.5 C6 8 4 10 4 10 C4 10 6 12 9.5 14.5" stroke={c} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="21.5" cy="10" r="1.5" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.5"/>
      <circle cx="21.5" cy="10" r="0.5" fill={olive} opacity="0.4"/>
    </svg>
  );
}

export function IconShare({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" className={className}>
      <circle cx="20" cy="5.5" r="2.5" stroke={c} strokeWidth="0.75" opacity="0.6"/>
      <circle cx="6" cy="13" r="2.5" stroke={c} strokeWidth="0.75" opacity="0.6"/>
      <circle cx="20" cy="20.5" r="2.5" stroke={c} strokeWidth="0.75" opacity="0.6"/>
      <path d="M8.5 11.5 C12 9 16 7.5 17.5 7" stroke={olive} strokeWidth="0.65" fill="none" opacity="0.55" strokeLinecap="round"/>
      <path d="M8.5 14.5 C12 17 16 18.5 17.5 19" stroke={olive} strokeWidth="0.65" fill="none" opacity="0.55" strokeLinecap="round"/>
      <circle cx="13" cy="9.5" r="0.8" fill={olive} opacity="0.3"/>
      <circle cx="13" cy="16.5" r="0.8" fill={olive} opacity="0.3"/>
    </svg>
  );
}

// ─────────────────────────────────────────
// TYPES D'EXPÉRIENCES
// ─────────────────────────────────────────

export function IconGastronomy({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 28" fill="none" className={className}>
      <path d="M4 20 C4 11 9.5 5 16 5 C22.5 5 28 11 28 20" stroke={c} strokeWidth="0.85" fill="none" opacity="0.6" strokeLinecap="round"/>
      <line x1="2" y1="20" x2="30" y2="20" stroke={c} strokeWidth="0.85" strokeLinecap="round" opacity="0.55"/>
      <line x1="5" y1="23" x2="27" y2="23" stroke={c} strokeWidth="0.5" opacity="0.2" strokeLinecap="round"/>
      <circle cx="16" cy="4" r="1.5" stroke={olive} strokeWidth="0.7" fill="none" opacity="0.7"/>
      <path d="M11 13 C11 13 12 11.5 11 10" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M16 12 C16 12 17 10.5 16 9" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M21 13 C21 13 22 11.5 21 10" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.4" strokeLinecap="round"/>
    </svg>
  );
}

export function IconWine({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M9 4 L19 4 C19 4 18.5 12 14 14 C9.5 12 9 4 9 4Z" stroke={c} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <line x1="14" y1="14" x2="14" y2="22" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="22" x2="18" y2="22" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <path d="M9.5 8 C11 9 13.5 9.5 14 9 C14.5 9.5 17 9 18.5 8" stroke={olive} strokeWidth="0.6" fill="none" opacity="0.5"/>
    </svg>
  );
}

export function IconFarm({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <path d="M14 24 C14 24 14 12 14 8" stroke={c} strokeWidth="1" strokeLinecap="round"/>
      <path d="M14 16 C14 16 9 15 7 10 C10 8 14 10 14 16Z" fill={olive} opacity="0.25" stroke={olive} strokeWidth="0.7"/>
      <path d="M14 12 C14 12 19 11 21 6 C18 4 14 6 14 12Z" fill={c} opacity="0.1" stroke={c} strokeWidth="0.7"/>
    </svg>
  );
}

export function IconWellness({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className={className}>
      <circle cx="14" cy="14" r="5" stroke={c} strokeWidth="1"/>
      <line x1="14" y1="4" x2="14" y2="7" stroke={olive} strokeWidth="1" strokeLinecap="round"/>
      <line x1="14" y1="21" x2="14" y2="24" stroke={olive} strokeWidth="1" strokeLinecap="round"/>
      <line x1="4" y1="14" x2="7" y2="14" stroke={olive} strokeWidth="1" strokeLinecap="round"/>
      <line x1="21" y1="14" x2="24" y2="14" stroke={olive} strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.5" y1="7.5" x2="9.6" y2="9.6" stroke={c} strokeWidth="0.75" strokeLinecap="round" opacity="0.4"/>
      <line x1="18.4" y1="18.4" x2="20.5" y2="20.5" stroke={c} strokeWidth="0.75" strokeLinecap="round" opacity="0.4"/>
      <line x1="20.5" y1="7.5" x2="18.4" y2="9.6" stroke={c} strokeWidth="0.75" strokeLinecap="round" opacity="0.4"/>
      <line x1="9.6" y1="18.4" x2="7.5" y2="20.5" stroke={c} strokeWidth="0.75" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}