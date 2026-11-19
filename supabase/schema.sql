-- 호매실연세이비인후과 CMS 스키마 (Supabase SQL Editor에서 실행)
create table if not exists health_posts (
  id bigint generated always as identity primary key,
  slug text unique not null,
  track text not null check (track in ('sleep','dizziness','growth','ent')),
  title text not null,
  summary text not null default '',
  body text not null default '',
  reviewer text not null default '',
  link text,
  published boolean not null default false,
  published_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists notices (
  id bigint generated always as identity primary key,
  category text not null default '진료',
  title text not null,
  body text not null default '',
  published boolean not null default true,
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);
create table if not exists press (
  id bigint generated always as identity primary key,
  outlet text not null,
  title text not null,
  url text not null,
  thumbnail text,
  published boolean not null default true,
  published_at date not null default current_date,
  created_at timestamptz not null default now()
);
alter table health_posts enable row level security;
alter table notices enable row level security;
alter table press enable row level security;
-- 공개 읽기(발행된 글만), 쓰기는 로그인 사용자만
create policy "public read posts" on health_posts for select using (published = true);
create policy "public read notices" on notices for select using (published = true);
create policy "public read press" on press for select using (published = true);
create policy "auth all posts" on health_posts for all to authenticated using (true) with check (true);
create policy "auth all notices" on notices for all to authenticated using (true) with check (true);
create policy "auth all press" on press for all to authenticated using (true) with check (true);
-- 빌드 훅: 글을 저장하면 Vercel Deploy Hook을 호출해 정적 사이트를 다시 빌드합니다 (관리자앱에서 호출).
