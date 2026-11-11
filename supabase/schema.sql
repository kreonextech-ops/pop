-- ============================================================================
-- Pop Culture D2C + Shiprocket Checkout + Game Loyalty Schema (Supabase Postgres)
-- Run this inside Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  loyalty_points integer not null default 0,
  game_high_score integer not null default 0,
  total_runs integer not null default 0,
  total_distance integer not null default 0,
  saved_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatically create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, loyalty_points)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'Snacker'), '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    50 -- Welcome bonus 50 Crunch Points
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. COLLECTIONS
create table if not exists public.collections (
  id bigint primary key,
  title text not null,
  handle text unique not null,
  body_html text not null default '',
  image text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. PRODUCTS
create table if not exists public.products (
  id bigint primary key,
  slug text unique not null,
  title text not null,
  body_html text not null default '',
  vendor text not null default 'Pop Culture',
  product_type text not null default 'Roasted Foxnuts',
  handle text not null,
  tags text not null default '',
  status text not null default 'active' check (status in ('active', 'draft')),
  image text not null default '',
  secondary_image text,
  badge text not null default '',
  emoji text not null default '🍿',
  tagline text not null default '',
  theme_color text not null default '#D73B3A',
  accent_bg text not null default '#ED0006',
  is_combo boolean not null default false,
  included_flavours jsonb default '[]'::jsonb,
  pack_count_text text,
  options jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. PRODUCT VARIANTS (Shiprocket requires unique bigint variant IDs)
create table if not exists public.product_variants (
  id bigint primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  title text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2) not null,
  sku text not null,
  quantity integer not null default 100,
  grams integer not null default 20,
  weight numeric(10, 2) not null default 20,
  weight_unit text not null default 'g',
  taxable boolean not null default true,
  option_values jsonb not null default '{}'::jsonb,
  image text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. PRODUCT <-> COLLECTION MAPPING
create table if not exists public.product_collections (
  product_id bigint not null references public.products(id) on delete cascade,
  collection_id bigint not null references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- 6. ORDERS (Synced from Shiprocket Checkout & Webhooks)
create table if not exists public.orders (
  order_id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  fastrr_order_id text,
  platform_order_id text,
  cart_id text,
  status text not null default 'INITIATED',
  source text,
  payment_type text,
  payment_status text,
  phone text,
  email text,
  shipping_plan text,
  shipping_charges numeric(10, 2) default 0,
  subtotal_price numeric(10, 2),
  coupon_codes jsonb default '[]'::jsonb,
  coupon_discount numeric(10, 2) default 0,
  prepaid_discount numeric(10, 2) default 0,
  total_discount numeric(10, 2) default 0,
  total_amount_payable numeric(10, 2),
  rto_prediction text,
  edd text,
  shipping_address jsonb,
  billing_address jsonb,
  payments jsonb default '[]'::jsonb,
  cart_data jsonb not null default '{"items":[]}'::jsonb,
  redirect_url text,
  is_demo boolean not null default false,
  stock_deducted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_email on public.orders(email);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- 7. ORDER REFUNDS
create table if not exists public.order_refunds (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(order_id) on delete cascade,
  ref_id text,
  amount numeric(10, 2) not null,
  status text not null default 'INITIATED',
  message text,
  created_at timestamptz not null default now()
);

-- 8. COUPONS
create table if not exists public.coupons (
  code text primary key,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  value numeric(10, 2) not null,
  min_order numeric(10, 2) not null default 0,
  max_discount numeric(10, 2),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 9. GAME RUNS (Fox Runner tied to logged-in user)
create table if not exists public.game_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  distance integer not null,
  points_earned integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_runs_user_id on public.game_runs(user_id);

-- 10. STORE SETTINGS & WEBHOOK LOGS
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  environment text not null default 'staging' check (environment in ('staging', 'production')),
  api_key text not null default '',
  api_secret text not null default '',
  seller_domain text not null default 'localhost:3001',
  redirect_base_url text not null default '',
  loyalty_enabled boolean not null default true,
  gmail_user text not null default '',
  admin_notify_email text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.webhook_logs (
  id uuid primary key default gen_random_uuid(),
  direction text not null,
  event text not null,
  endpoint text not null,
  http_status integer not null default 200,
  ok boolean not null default true,
  summary text not null default '',
  created_at timestamptz not null default now()
);

-- 11. ATOMIC STOCK DECREMENT FUNCTION
create or replace function public.decrement_variant_stock(p_variant_id bigint, p_qty integer)
returns void
language plpgsql
security definer
as $$
begin
  update public.product_variants
  set quantity = greatest(0, quantity - p_qty),
      updated_at = now()
  where id = p_variant_id;
end;
$$;

-- 12. ROW LEVEL SECURITY POLICIES
alter table public.profiles enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_collections enable row level security;
alter table public.orders enable row level security;
alter table public.order_refunds enable row level security;
alter table public.coupons enable row level security;
alter table public.game_runs enable row level security;
alter table public.store_settings enable row level security;
alter table public.webhook_logs enable row level security;

-- Public read access for catalog & active coupons
create policy "Public can read collections" on public.collections for select using (true);
create policy "Public can read active products" on public.products for select using (status = 'active');
create policy "Public can read variants" on public.product_variants for select using (true);
create policy "Public can read product_collections" on public.product_collections for select using (true);
create policy "Public can read active coupons" on public.coupons for select using (active = true);

-- Users can read/update their own profile, orders & game runs
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users read own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users read own game runs" on public.game_runs for select using (auth.uid() = user_id);

-- Storage bucket for uploaded product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');

-- 13. INITIAL SEED DATA
insert into public.collections (id, title, handle, body_html, image) values
  (200001, 'Signature Flavours', 'signature-flavours', '<p>Slow-roasted jumbo foxnuts tossed in bold signature seasonings.</p>', '/packets/peri peri.svg'),
  (200002, 'Combo Bundles', 'combo-bundles', '<p>Value-packed Pop Culture makhana variety boxes and party stashes.</p>', '/packets/cheese.svg')
on conflict (id) do nothing;

insert into public.coupons (code, discount_type, value, min_order, max_discount, active) values
  ('POP10', 'percent', 10, 0, 200, true),
  ('FIRST50', 'fixed', 50, 200, null, true)
on conflict (code) do nothing;

insert into public.store_settings (id, environment) values (1, 'staging')
on conflict (id) do nothing;
