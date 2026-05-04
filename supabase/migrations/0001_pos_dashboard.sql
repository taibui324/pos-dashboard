create extension if not exists "pgcrypto";
create extension if not exists "pgmq";

create type account_role as enum ('daspace_admin', 'brand_user');
create type account_status as enum ('active', 'disabled', 'invited');
create type brand_status as enum ('active', 'inactive');
create type mapping_status as enum ('draft', 'approved', 'retired');
create type sale_event_type as enum ('sale', 'refund', 'cancel');
create type order_state as enum ('completed', 'pending', 'cancelled', 'refunded');

create table brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status brand_status not null default 'active',
  created_at timestamptz not null default now()
);

create table account_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  role account_role not null,
  status account_status not null default 'invited',
  brand_id uuid references brands(id),
  created_by_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint brand_user_has_one_brand check (
    role != 'brand_user' or brand_id is not null
  )
);

create table account_audits (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  target_user_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create table sapo_sources (
  id uuid primary key default gen_random_uuid(),
  store_url text not null,
  status text not null default 'configured',
  last_successful_sync_at timestamptz,
  created_at timestamptz not null default now()
);

create table reporting_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table brand_mappings (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id),
  sku text not null,
  sapo_product_id text,
  reporting_category_id uuid references reporting_categories(id),
  effective_from timestamptz not null,
  effective_to timestamptz,
  status mapping_status not null default 'draft',
  approved_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mapping_date_order check (effective_to is null or effective_from < effective_to),
  constraint approved_mapping_has_admin check (status != 'approved' or approved_by is not null)
);

create table mapping_audits (
  id uuid primary key default gen_random_uuid(),
  mapping_id uuid not null references brand_mappings(id),
  actor_user_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create table pos_sale_lines (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sapo_sources(id),
  sapo_order_id text not null,
  order_code text not null,
  event_at timestamptz not null,
  event_type sale_event_type not null,
  state order_state not null,
  location_id text,
  location_name text,
  sku text not null,
  barcode text,
  product_name text not null,
  brand_id uuid references brands(id),
  quantity integer not null,
  unit_price_cents integer not null,
  discount_cents integer not null default 0,
  tax_cents integer not null default 0,
  net_sales_cents integer not null,
  raw jsonb,
  created_at timestamptz not null default now()
);

create table inventory_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sapo_sources(id),
  sku text not null,
  barcode text,
  product_name text not null,
  reporting_category_id uuid references reporting_categories(id),
  brand_id uuid references brands(id),
  location_id text,
  location_name text,
  available integer not null default 0,
  sapo_created_at timestamptz,
  updated_at timestamptz not null default now()
);

create table sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sapo_sources(id),
  job_type text not null,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error_code text,
  error_message text
);

create table export_audits (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null,
  brand_id uuid,
  export_type text not null,
  filters jsonb,
  row_count integer not null,
  created_at timestamptz not null default now()
);

create table impersonation_audits (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  brand_id uuid not null references brands(id),
  reason text not null,
  actions jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table dashboard_freshness (
  id uuid primary key default gen_random_uuid(),
  surface text not null,
  brand_id uuid,
  last_successful_sync_at timestamptz,
  status text not null default 'fresh',
  updated_at timestamptz not null default now()
);

create index account_profiles_brand_idx on account_profiles(brand_id);
create index brand_mappings_sku_date_idx on brand_mappings(sku, effective_from, effective_to);
create index brand_mappings_brand_idx on brand_mappings(brand_id);
create index pos_sale_lines_brand_date_idx on pos_sale_lines(brand_id, event_at);
create index pos_sale_lines_sku_date_idx on pos_sale_lines(sku, event_at);
create index pos_sale_lines_order_idx on pos_sale_lines(order_code);
create index inventory_items_brand_sku_idx on inventory_items(brand_id, sku);
create index inventory_items_available_idx on inventory_items(available);

select pgmq.create('sapo-webhooks');
select pgmq.create('sapo-backfill');
select pgmq.create('dashboard-recompute');

alter table brands enable row level security;
alter table account_profiles enable row level security;
alter table brand_mappings enable row level security;
alter table pos_sale_lines enable row level security;
alter table inventory_items enable row level security;
alter table export_audits enable row level security;
alter table dashboard_freshness enable row level security;

create or replace function is_daspace_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from account_profiles
    where user_id = auth.uid()
      and role = 'daspace_admin'
      and status = 'active'
  );
$$;

create or replace function current_brand_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select brand_id
  from account_profiles
  where user_id = auth.uid()
    and role = 'brand_user'
    and status = 'active'
    and created_by_admin = true;
$$;

create policy "admins can read brands" on brands
  for select using (is_daspace_admin());

create policy "brand users can read own brand" on brands
  for select using (id = current_brand_id());

create policy "profiles can read self or admin" on account_profiles
  for select using (user_id = auth.uid() or is_daspace_admin());

create policy "admins manage profiles" on account_profiles
  for all using (is_daspace_admin()) with check (is_daspace_admin());

create policy "admins read mappings" on brand_mappings
  for select using (is_daspace_admin());

create policy "brand users read own approved mappings" on brand_mappings
  for select using (brand_id = current_brand_id() and status = 'approved');

create policy "admins manage mappings" on brand_mappings
  for all using (is_daspace_admin()) with check (is_daspace_admin());

create policy "brand users read own sale lines only" on pos_sale_lines
  for select using (brand_id = current_brand_id());

create policy "admins read sale lines" on pos_sale_lines
  for select using (is_daspace_admin());

create policy "brand users read own inventory only" on inventory_items
  for select using (brand_id = current_brand_id());

create policy "admins read inventory" on inventory_items
  for select using (is_daspace_admin());

create policy "admins read export audits" on export_audits
  for select using (is_daspace_admin());

create policy "brand users read own freshness" on dashboard_freshness
  for select using (brand_id = current_brand_id() or brand_id is null);

create policy "admins read freshness" on dashboard_freshness
  for select using (is_daspace_admin());
