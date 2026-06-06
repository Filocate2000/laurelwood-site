-- scripts/sql/commute-cities.sql
-- Phase 1 of the laurelwood-site commute widget rework.
-- Run this once in the Supabase SQL editor (shared misraje project).
--
-- Creates commute_cities: the destination/origin city catalog the widget reads
-- at runtime (service-role only). Seeds 29 cities to match laurelwood-site's
-- local CITY_COORDS fallback list exactly. Idempotent: safe to re-run.
-- NOTE: 28 of these come from misraje-site/lib/commute/cities.ts; "los-feliz" is
-- the 29th, present in laurelwood's local CITY_COORDS + neighborhoods.ts but not
-- in misraje's cities.ts, included here so the table and the fallback agree.
--
-- RLS: enabled with NO policies, so the anon and authenticated roles get zero
-- rows (default-deny). The service_role key (SUPABASE_SECRET_KEY) bypasses RLS,
-- so only server routes can read/write. This matches the project convention used
-- for commute_reviews (migration 033) and commute_cache.

create table if not exists commute_cities (
  slug        text primary key,
  label       text not null,
  lat         double precision not null,
  lng         double precision not null,
  active      boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Service-role-only access: enable RLS and create no policies (default deny for
-- anon/authenticated; service_role bypasses RLS).
alter table commute_cities enable row level security;

-- Seed 29 cities (28 from misraje-site/lib/commute/cities.ts + los-feliz).
insert into commute_cities (slug, label, lat, lng) values
  ('burbank', 'Burbank', 34.1808, -118.309),
  ('glendale', 'Glendale', 34.1425, -118.2551),
  ('sherman-oaks', 'Sherman Oaks', 34.1511, -118.449),
  ('encino', 'Encino', 34.1597, -118.5012),
  ('van-nuys', 'Van Nuys', 34.1865, -118.449),
  ('north-hollywood', 'North Hollywood', 34.1722, -118.3787),
  ('woodland-hills', 'Woodland Hills', 34.1684, -118.6058),
  ('studio-city', 'Studio City', 34.1395, -118.387),
  ('san-fernando', 'San Fernando', 34.282, -118.4389),
  ('calabasas', 'Calabasas', 34.1367, -118.6612),
  ('santa-monica', 'Santa Monica', 34.0195, -118.4912),
  ('beverly-hills', 'Beverly Hills', 34.0736, -118.4004),
  ('culver-city', 'Culver City', 34.0211, -118.3965),
  ('west-hollywood', 'West Hollywood', 34.09, -118.3617),
  ('malibu', 'Malibu', 34.0259, -118.7798),
  ('el-segundo', 'El Segundo', 33.9192, -118.4165),
  ('venice', 'Venice', 33.985, -118.4695),
  ('westwood', 'Westwood', 34.0633, -118.4478),
  ('brentwood', 'Brentwood', 34.0613, -118.472),
  ('pacific-palisades', 'Pacific Palisades', 34.0357, -118.5156),
  ('playa-vista', 'Playa Vista', 33.976, -118.4205),
  ('marina-del-rey', 'Marina del Rey', 33.9803, -118.4517),
  ('pasadena', 'Pasadena', 34.1478, -118.1445),
  ('toluca-lake', 'Toluca Lake', 34.1497, -118.3531),
  ('downtown-la', 'Downtown LA', 34.0407, -118.2468),
  ('hollywood', 'Hollywood', 34.0928, -118.3287),
  ('los-feliz', 'Los Feliz', 34.1062, -118.2903),
  ('century-city', 'Century City', 34.056, -118.4172),
  ('westlake-village', 'Westlake Village', 34.1467, -118.8054)
on conflict (slug) do nothing;

-- ---- Verification (expect city_count = 29; report the output back) ----
select count(*) as city_count from commute_cities;
select slug, label, lat, lng, active from commute_cities order by label;
