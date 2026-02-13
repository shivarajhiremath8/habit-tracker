-- Create injuries table
create table public.injuries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.injuries enable row level security;

-- Policies
create policy "Users can view their own injuries"
  on public.injuries for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own injuries"
  on public.injuries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own injuries"
  on public.injuries for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own injuries"
  on public.injuries for delete
  using ( auth.uid() = user_id );
