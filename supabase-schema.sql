-- ============================================
-- 牛牛老蘇補給站 — Supabase 資料表與權限
-- 在 Supabase 主控台 → SQL Editor 貼上並執行
-- ============================================

-- 1) 文章資料表
create table if not exists public.posts (
  id         text primary key,
  emoji      text not null default '📝',
  title      text not null,
  html       text not null,
  excerpt    text,
  date       date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) 開啟 Row Level Security（沒開的話金鑰外洩會很危險）
alter table public.posts enable row level security;

-- 3) 所有訪客都能「讀」文章
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts for select
  to anon, authenticated
  using (true);

-- 4) 只有「管理者本人」能新增／修改／刪除
--    ⚠⚠ 下面三段的 email 就是後台管理者 email，需要換帳號時一起改 ⚠⚠
drop policy if exists "posts_admin_insert" on public.posts;
create policy "posts_admin_insert"
  on public.posts for insert to authenticated
  with check ( (auth.jwt() ->> 'email') = 'mindy4400@gmail.com' );

drop policy if exists "posts_admin_update" on public.posts;
create policy "posts_admin_update"
  on public.posts for update to authenticated
  using ( (auth.jwt() ->> 'email') = 'mindy4400@gmail.com' )
  with check ( (auth.jwt() ->> 'email') = 'mindy4400@gmail.com' );

drop policy if exists "posts_admin_delete" on public.posts;
create policy "posts_admin_delete"
  on public.posts for delete to authenticated
  using ( (auth.jwt() ->> 'email') = 'mindy4400@gmail.com' );

-- 完成後，到 Authentication → Users 新增一位管理者（email 要跟上面一致），
-- 並建議在 Authentication → Providers → Email 關閉「Allow new users to sign up」，
-- 避免其他人自行註冊。文章的預設內容可在後台登入後按「匯入預設文章」寫入。
