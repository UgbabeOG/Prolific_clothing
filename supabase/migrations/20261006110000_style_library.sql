create table if not exists public.style_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.styles (
  id uuid primary key default gen_random_uuid(),
  style_number bigint generated always as identity unique,
  category_id uuid not null references public.style_categories(id) on delete restrict,
  image_path text,
  image_width integer,
  image_height integer,
  is_published boolean not null default false,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint styles_image_path_unique unique (image_path),
  constraint styles_image_dimensions_positive check (
    (image_width is null and image_height is null)
    or (image_width is not null and image_height is not null and image_width > 0 and image_height > 0)
  )
);

create index if not exists styles_public_listing_idx
  on public.styles (style_number desc)
  where is_published and not is_deleted;

create index if not exists styles_category_idx
  on public.styles (category_id);

create or replace function public.is_style_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'style_admin', false);
$$;

revoke all on function public.is_style_admin() from public;
grant execute on function public.is_style_admin() to authenticated;

create or replace function public.prevent_style_number_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.style_number <> old.style_number then
    raise exception 'Style IDs are permanent and cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists styles_style_number_immutable on public.styles;
create trigger styles_style_number_immutable
  before update of style_number on public.styles
  for each row execute function public.prevent_style_number_change();

alter table public.style_categories enable row level security;
alter table public.styles enable row level security;

grant select on public.style_categories, public.styles to anon, authenticated;
grant insert, update, delete on public.style_categories, public.styles to authenticated;
grant usage, select on sequence public.styles_style_number_seq to authenticated;

drop policy if exists "Public can view active style categories" on public.style_categories;
drop policy if exists "Style admins view all categories" on public.style_categories;
create policy "Public can view active style categories"
  on public.style_categories for select to anon, authenticated
  using (is_active);

create policy "Style admins view all categories"
  on public.style_categories for select to authenticated
  using ((select public.is_style_admin()));

drop policy if exists "Style admins manage categories" on public.style_categories;
create policy "Style admins manage categories"
  on public.style_categories for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

drop policy if exists "Public can view published styles" on public.styles;
drop policy if exists "Style admins view all styles" on public.styles;
create policy "Public can view published styles"
  on public.styles for select to anon, authenticated
  using (is_published and not is_deleted);

create policy "Style admins view all styles"
  on public.styles for select to authenticated
  using ((select public.is_style_admin()));

drop policy if exists "Style admins manage styles" on public.styles;
create policy "Style admins manage styles"
  on public.styles for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

insert into public.style_categories (name, slug, sort_order)
values
  ('Native', 'native', 1),
  ('Kaftan', 'kaftan', 2),
  ('Agbada', 'agbada', 3),
  ('Shirts', 'shirts', 4),
  ('Trousers', 'trousers', 5),
  ('Jalabia', 'jalabia', 6),
  ('Dan Chiki', 'dan-chiki', 7),
  ('Mixed Fabric', 'mixed-fabric', 8),
  ('Lace', 'lace', 9),
  ('Streetwear', 'streetwear', 10)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('style-library', 'style-library', false, 5242880, array['image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view published style images" on storage.objects;
create policy "Public can view published style images"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'style-library'
    and exists (
      select 1
      from public.styles as s
      join public.style_categories as c on c.id = s.category_id
      where s.image_path = storage.objects.name
        and s.is_published
        and not s.is_deleted
        and c.is_active
    )
  );

drop policy if exists "Style admins view style images" on storage.objects;
create policy "Style admins view style images"
  on storage.objects for select to authenticated
  using (bucket_id = 'style-library' and (select public.is_style_admin()));

drop policy if exists "Style admins upload style images" on storage.objects;
create policy "Style admins upload style images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'style-library' and (select public.is_style_admin()));

drop policy if exists "Style admins update style images" on storage.objects;
create policy "Style admins update style images"
  on storage.objects for update to authenticated
  using (bucket_id = 'style-library' and (select public.is_style_admin()))
  with check (bucket_id = 'style-library' and (select public.is_style_admin()));

drop policy if exists "Style admins delete style images" on storage.objects;
create policy "Style admins delete style images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'style-library' and (select public.is_style_admin()));
