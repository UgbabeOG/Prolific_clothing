create table if not exists public.collection_media (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  media_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists collection_media_collection_idx on collection_media (collection_id, sort_order);

alter table public.collection_media enable row level security;

grant select on public.collection_media to anon, authenticated;
grant insert, update, delete on public.collection_media to authenticated;

drop policy if exists "Public can view published collection media" on public.collection_media;
create policy "Public can view published collection media"
  on public.collection_media for select to anon, authenticated
  using (exists (
    select 1 from public.collections c where c.id = collection_media.collection_id and c.is_published
  ));

drop policy if exists "Style admins manage collection media" on public.collection_media;
create policy "Style admins manage collection media"
  on public.collection_media for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));

-- Storage policies for collection media files (same bucket as product-media)
drop policy if exists "Public can view published collection media files" on storage.objects;
create policy "Public can view published collection media files"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'product-media'
    and exists (
      select 1
      from public.collection_media as cm
      join public.collections as c on c.id = cm.collection_id
      where cm.media_path = storage.objects.name
        and c.is_published
    )
  );

drop policy if exists "Style admins view collection media files" on storage.objects;
create policy "Style admins view collection media files"
  on storage.objects for select to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins upload collection media files" on storage.objects;
create policy "Style admins upload collection media files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins update collection media files" on storage.objects;
create policy "Style admins update collection media files"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()))
  with check (bucket_id = 'product-media' and (select public.is_style_admin()));

drop policy if exists "Style admins delete collection media files" on storage.objects;
create policy "Style admins delete collection media files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and (select public.is_style_admin()));
