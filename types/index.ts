export type ExperienceCategory = 'une_journee' | 'un_sejour' | 'une_saison'
export type ExperienceType = 'gastronomy' | 'wine_vines' | 'farm_terroir'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Partner {
  id: string
  name: string
  host_firstname: string
  host_lastname: string
  host_bio: string
  email: string
  phone: string
  address: string
  zone: string
  stripe_account_id: string
  commission_rate: number
  is_active: boolean
  created_at: string
}

export interface ExperienceImage {
  id: string
  experience_id: string
  url: string
  alt: string
  position: number
  is_cover: boolean
  created_at: string
}

export interface Experience {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  whats_included: string
  category: ExperienceCategory
  experience_type: ExperienceType
  zone: string
  price_from: number
  duration: string
  group_min: number
  group_max: number
  season: string
  language_note: string | null
  is_published: boolean
  partner_id: string
  partner?: Partner
  images?: ExperienceImage[]
  created_at: string
}

export interface Booking {
  id: string
  experience_id: string
  partner_id: string
  customer_firstname: string
  customer_lastname: string
  customer_email: string
  customer_phone: string | null
  customer_notes: string | null
  booking_date: string
  guests: number
  amount_total: number
  amount_commission: number
  amount_partner: number
  status: BookingStatus
  stripe_payment_intent_id: string
  cancellation_policy: string
  cancelled_at: string | null
  refund_amount: number | null
  created_at: string
  experience?: Experience
}

export interface Review {
  id: string
  booking_id: string
  experience_id: string
  customer_firstname: string
  rating: number
  comment: string
  is_published: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string
  category: string
  is_published: boolean
  published_at: string
  created_at: string
}