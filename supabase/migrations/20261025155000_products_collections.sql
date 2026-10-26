create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  price integer not null default 0,
  description text,
  short_description text,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_published_idx on public.products (is_published, is_featured);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color_name text not null,
  color_hex text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists product_variants_product_idx on public.product_variants (product_id);

create table if not exists public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  media_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_media_product_idx on product_media (product_id, sort_order);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  image_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists collections_slug_idx on public.collections (slug);
create index if not exists collections_published_idx on public.collections (is_published);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.collections enable row level security;

grant select on public.products, public.product_variants, public.product_media, public.collections to anon, authenticated;
grant insert, update, delete on public.products, public.product_variants, public.product_media, public.collections to authenticated;

-- Products policies
drop policy if exists "Public can view published products" on public.products;
create policy "Public can view published products"
  on public.products for select to anon, authenticated
  using (is_published);

drop policy if exists "Style admins manage products" on public.products;
create policy "Style admins manage products"
  on public.products for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

-- Product variants policies
drop policy if exists "Public can view product variants" on public.product_variants;
create policy "Public can view product variants"
  on public.product_variants for select to anon, authenticated
  using (exists (
    select 1 from public.products p where p.id = product_variants.product_id and p.is_published
  ));

drop policy if exists "Style admins manage product variants" on public.product_variants;
create policy "Style admins manage product variants"
  on public.product_variants for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

-- Product media policies
drop policy if exists "Public can view published product media" on public.product_media;
create policy "Public can view published product media"
  on public.product_media for select to anon, authenticated
  using (exists (
    select 1 from public.products p where p.id = product_media.product_id and p.is_published
  ));

drop policy if exists "Style admins manage product media" on public.product_media;
create policy "Style admins manage product media"
  on public.product_media for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

-- Collections policies
drop policy if exists "Public can view published collections" on public.collections;
create policy "Public can view published collections"
  on public.collections for select to anon, authenticated
  using (is_published);

drop policy if exists "Style admins manage collections" on public.collections;
create policy "Style admins manage collections"
  on public.collections for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

-- Storage bucket for product media (images + videos)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', false, 104857600, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies for product media
drop policy if exists "Public can view published product media files" on storage.objects;
create policy "Public can view published product media files"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.product_media as m
      join public.products as p on p.id = m.product_id
      where m.media_path = storage.objects.name
        and p.is_published
    )
  );

drop policy if exists "Style admins view product media files" on storage.objects;
create policy "Style admins view product media files"
  on storage.objects for select to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins upload product media files" on storage.objects;
create policy "Style admins upload product media files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins update product media files" on storage.objects;
create policy "Style admins update product media files"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()))
  with check (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins delete product media files" on storage.objects;
create policy "Style admins delete product media files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()));
