alter table public.collection_media
  add column if not exists price numeric,
  add column if not exists size text,
  add column if not exists color_name text,
  add column if not exists color_hex text,
  add column if not exists product_id uuid references public.products(id) on delete set null;

create index if not exists collection_media_product_idx on collection_media (product_id);

drop policy if exists "Public can view published collection media" on public.collection_media;
create policy "Public can view published collection media"
  on public.collection_media for select to anon, authenticated
  using (exists (
    select 1 from public.collections c where c.id = collection_media.collection_id and c.is_published
  ));
