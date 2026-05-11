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

-- conversations
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  character_id text not null check (character_id ~ '^[EI][SN][TF][JP]$'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_messages_conv_created on messages (conversation_id, created_at desc);
create index idx_diagnosis_user on diagnosis_results (user_id, answered_at desc);
create index idx_conversations_user on conversations (user_id, character_id);

-- updated_at自動更新トリガー
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger conversations_updated_at
  before update on conversations
  for each row execute function update_updated_at();

-- メッセージ50件制限: 古いメッセージを自動削除
create or replace function cleanup_old_messages()
returns void as $$
declare
  conv_record record;
  msg_count int;
begin
  for conv_record in select id from conversations loop
    select count(*) into msg_count from messages where conversation_id = conv_record.id;
    if msg_count > 50 then
      delete from messages
      where conversation_id = conv_record.id
      and created_at not in (
        select created_at from messages
        where conversation_id = conv_record.id
        order by created_at desc
        limit 50
      );
    end if;
  end loop;
end;
$$ language plpgsql;

-- RLS有効化
alter table public.profiles enable row level security;
alter table public.diagnosis_results enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- profiles: 自分のみアクセス可能
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- diagnosis_results: 自分のみアクセス可能
create policy "Users can manage own diagnosis" on public.diagnosis_results for all using (auth.uid() = user_id);

-- conversations: 自分のみアクセス可能
create policy "Users can manage own conversations" on public.conversations for all using (auth.uid() = user_id);

-- messages: 自分の会話のメッセージのみアクセス可能
create policy "Users can manage own messages" on public.messages for all using (
  conversation_id in (select id from public.conversations where user_id = auth.uid())
);

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
