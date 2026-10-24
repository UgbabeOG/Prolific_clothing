create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_email text,
  customer_phone text not null,
  customer_address text,
  customer_city text,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_order_number_idx on public.orders (order_number);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

grant select on public.orders to anon, authenticated;
grant insert, update, delete on public.orders to authenticated;

drop policy if exists "No public access to orders" on public.orders;
create policy "No public access to orders"
  on public.orders for select to anon, authenticated
  using (false);

drop policy if exists "Style admins view all orders" on public.orders;
create policy "Style admins view all orders"
  on public.orders for select to authenticated
  using ((select public.is_style_admin()));

drop policy if exists "Style admins manage orders" on public.orders;
create policy "Style admins manage orders"
  on public.orders for all to authenticated
  using ((select public.is_style_admin()))
  with check ((select public.is_style_admin()));
