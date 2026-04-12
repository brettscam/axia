-- Axia MVP Schema
-- CLAUDE.md section 4: status check constraint includes 'draft' (bug fix applied)
-- CLAUDE.md section 3: RLS enabled on every table

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (linked to auth.users)
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CLIENTS (schema stays, no CRUD UI for MVP)
-- ============================================================
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  company text,
  created_at timestamptz default now() not null
);

alter table public.clients enable row level security;

create policy "Users can manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- APPRAISALS
-- ============================================================
create table public.appraisals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null default auth.uid(),
  client_name text,
  property_address text,
  property_city text,
  property_state text,
  property_zip text,
  property_type text default 'single_family',
  bedrooms integer,
  bathrooms numeric,
  gla integer,
  lot_size numeric,
  year_built integer,
  condition text,
  -- BUG FIX: 'draft' included in check constraint (CLAUDE.md section 4.1)
  status text not null default 'draft'
    check (status in ('draft', 'in_progress', 'review', 'completed')),
  document_content jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.appraisals enable row level security;

create policy "Users can manage own appraisals"
  on public.appraisals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- DOCUMENT VERSIONS (CLAUDE.md section 4.2)
-- ============================================================
create table public.document_versions (
  id uuid default uuid_generate_v4() primary key,
  appraisal_id uuid references public.appraisals(id) on delete cascade not null,
  content jsonb not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now() not null
);

alter table public.document_versions enable row level security;

create policy "Users can view own document versions"
  on public.document_versions for select
  using (
    exists (
      select 1 from public.appraisals
      where appraisals.id = document_versions.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  );

create policy "Users can insert own document versions"
  on public.document_versions for insert
  with check (
    exists (
      select 1 from public.appraisals
      where appraisals.id = document_versions.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  );

-- ============================================================
-- COMPARABLES
-- ============================================================
create table public.comparables (
  id uuid default uuid_generate_v4() primary key,
  appraisal_id uuid references public.appraisals(id) on delete cascade not null,
  attom_id text,
  address text not null,
  city text,
  state text,
  zip text,
  sale_price numeric,
  sale_date date,
  bedrooms integer,
  bathrooms numeric,
  gla integer,
  lot_size numeric,
  year_built integer,
  distance_miles numeric,
  similarity_score numeric,
  adjustments jsonb,
  created_at timestamptz default now() not null
);

alter table public.comparables enable row level security;

create policy "Users can manage own comparables"
  on public.comparables for all
  using (
    exists (
      select 1 from public.appraisals
      where appraisals.id = comparables.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.appraisals
      where appraisals.id = comparables.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  );

-- ============================================================
-- AI GENERATIONS (Phase 4 audit table)
-- ============================================================
create table public.ai_generations (
  id uuid default uuid_generate_v4() primary key,
  appraisal_id uuid references public.appraisals(id) on delete cascade not null,
  feature text not null,
  prompt text not null,
  output text not null,
  user_action text check (user_action in ('accepted', 'rejected', 'regenerated')),
  created_at timestamptz default now() not null
);

alter table public.ai_generations enable row level security;

create policy "Users can manage own ai generations"
  on public.ai_generations for all
  using (
    exists (
      select 1 from public.appraisals
      where appraisals.id = ai_generations.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.appraisals
      where appraisals.id = ai_generations.appraisal_id
        and appraisals.user_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_appraisals_user_id on public.appraisals(user_id);
create index idx_appraisals_status on public.appraisals(status);
create index idx_document_versions_appraisal_id on public.document_versions(appraisal_id);
create index idx_comparables_appraisal_id on public.comparables(appraisal_id);
create index idx_ai_generations_appraisal_id on public.ai_generations(appraisal_id);
create index idx_clients_user_id on public.clients(user_id);
