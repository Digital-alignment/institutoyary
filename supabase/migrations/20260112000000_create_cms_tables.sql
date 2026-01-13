-- Create projects table
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  content jsonb default '[]'::jsonb,
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create blogs table
create table if not exists blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content jsonb default '[]'::jsonb,
  cover_image text,
  status text default 'draft' check (status in ('draft', 'published')),
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (start with public read access for now, restrict write later)
alter table projects enable row level security;
alter table blogs enable row level security;

-- Policies for projects
create policy "Enable read access for all users" on projects
  for select using (true);

create policy "Enable insert for authenticated users only" on projects
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on projects
  for update using (auth.role() = 'authenticated');
  
create policy "Enable delete for authenticated users only" on projects
  for delete using (auth.role() = 'authenticated');

-- Policies for blogs
create policy "Enable read access for all users" on blogs
  for select using (true);

create policy "Enable insert for authenticated users only" on blogs
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on blogs
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on blogs
  for delete using (auth.role() = 'authenticated');
