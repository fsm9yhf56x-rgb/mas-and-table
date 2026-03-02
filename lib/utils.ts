import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export const CATEGORY_LABELS: Record<string, { nav: string; poetic: string }> = {
  une_journee: { nav: 'Une Journée', poetic: 'A Table' },
  un_sejour: { nav: 'Un Séjour', poetic: 'Among the Vines' },
  une_saison: { nav: 'Une Saison', poetic: 'Lost in Provence' },
}

export const CATEGORY_PRICE_RANGE: Record<string, string> = {
  une_journee: '€150 – €500 per person',
  un_sejour: '€800 – €2,500 per person',
  une_saison: '€2,000 – €5,000 per person',
}