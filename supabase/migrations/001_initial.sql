-- MBTI Shadow Friend - Initial Schema

-- profiles (auth.usersと1:1)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  created_at timestamptz default now()
);

-- diagnosis_results
create table public.diagnosis_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  mbti_type text not null check (mbti_type ~ '^[EI][SN][TF][JP]$'),
  answered_at timestamptz default now()
);

-- Indexes
create index idx_diagnosis_user on diagnosis_results (user_id, answered_at desc);

-- RLS有効化
alter table public.profiles enable row level security;
alter table public.diagnosis_results enable row level security;

-- profiles: 自分のみアクセス可能
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- diagnosis_results: 自分のみアクセス可能
create policy "Users can manage own diagnosis" on public.diagnosis_results for all using (auth.uid() = user_id);

-- auth.users作成時にprofiles自動作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'ユーザー')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
