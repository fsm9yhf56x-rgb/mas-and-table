-- ============================================================
-- MAS & TABLE — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PARTNERS ────────────────────────────────────────────────
create table partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  host_firstname text not null,
  host_lastname text not null,
  host_bio text,
  email text not null unique,
  phone text,
  address text,
  zone text not null,
  stripe_account_id text,
  commission_rate numeric(4,2) not null default 15.00,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── EXPERIENCES ─────────────────────────────────────────────
create type experience_category as enum ('une_journee', 'un_sejour', 'une_saison');
create type experience_type as enum ('gastronomy', 'wine_vines', 'farm_terroir');

create table experiences (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  tagline text not null,
  description text not null,
  whats_included text,
  category experience_category not null,
  experience_type experience_type not null,
  zone text not null,
  price_from numeric(10,2) not null,
  duration text not null,
  group_min integer not null default 1,
  group_max integer not null default 12,
  season text,
  language_note text,
  is_published boolean not null default false,
  partner_id uuid not null references partners(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ─── EXPERIENCE IMAGES ───────────────────────────────────────
create table experience_images (
  id uuid primary key default uuid_generate_v4(),
  experience_id uuid not null references experiences(id) on delete cascade,
  url text not null,
  alt text,
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── BOOKINGS ────────────────────────────────────────────────
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  experience_id uuid not null references experiences(id),
  partner_id uuid not null references partners(id),
  customer_firstname text not null,
  customer_lastname text not null,
  customer_email text not null,
  customer_phone text,
  customer_notes text,
  booking_date date not null,
  guests integer not null default 1,
  amount_total numeric(10,2) not null,
  amount_commission numeric(10,2) not null,
  amount_partner numeric(10,2) not null,
  status booking_status not null default 'pending',
  stripe_payment_intent_id text,
  cancellation_policy text,
  cancelled_at timestamptz,
  refund_amount numeric(10,2),
  created_at timestamptz not null default now()
);

-- ─── REVIEWS ─────────────────────────────────────────────────
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id),
  experience_id uuid not null references experiences(id),
  customer_firstname text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── BLOG POSTS ──────────────────────────────────────────────
create table blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  category text not null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

-- ─── INDEXES ─────────────────────────────────────────────────
create index idx_experiences_published on experiences(is_published);
create index idx_experiences_category on experiences(category);
create index idx_experiences_slug on experiences(slug);
create index idx_bookings_status on bookings(status);
create index idx_bookings_experience on bookings(experience_id);
create index idx_blog_posts_slug on blog_posts(slug);
create index idx_blog_posts_published on blog_posts(is_published);

-- ─── RLS (Row Level Security) ────────────────────────────────
-- Public can read published experiences, blog posts, and reviews
alter table experiences enable row level security;
alter table partners enable row level security;
alter table experience_images enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table blog_posts enable row level security;

-- Public read policies
create policy "Public can view published experiences"
  on experiences for select
  using (is_published = true);

create policy "Public can view images of published experiences"
  on experience_images for select
  using (
    exists (
      select 1 from experiences
      where experiences.id = experience_images.experience_id
      and experiences.is_published = true
    )
  );

create policy "Public can view active partners"
  on partners for select
  using (is_active = true);

create policy "Public can view published reviews"
  on reviews for select
  using (is_published = true);

create policy "Public can view published blog posts"
  on blog_posts for select
  using (is_published = true);

-- Bookings: only service role can read/write (via API routes)
create policy "Service role only for bookings"
  on bookings for all
  using (false);