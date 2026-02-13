-- Run this in your Supabase SQL Editor to fix the "new row violates row-level security policy" error.

-- 1. Enable RLS (if not already enabled)
alter table workouts enable row level security;
alter table weekly_weights enable row level security;

-- 2. Drop existing policies to avoid conflicts
drop policy if exists "Users can view their own workouts" on workouts;
drop policy if exists "Users can insert their own workouts" on workouts;
drop policy if exists "Users can update their own workouts" on workouts;
drop policy if exists "Users can view their own weights" on weekly_weights;
drop policy if exists "Users can insert their own weights" on weekly_weights;
drop policy if exists "Users can update their own weights" on weekly_weights;

-- 3. Create policies for 'workouts' table
-- Allow users to view their own data
create policy "Users can view their own workouts"
on workouts for select
using ( auth.uid() = user_id );

-- Allow users to insert their own data
create policy "Users can insert their own workouts"
on workouts for insert
with check ( auth.uid() = user_id );

-- Allow users to update their own data
create policy "Users can update their own workouts"
on workouts for update
using ( auth.uid() = user_id );

-- Allow users to delete their own data
drop policy if exists "Users can delete their own workouts" on workouts;
create policy "Users can delete their own workouts"
on workouts for delete
using ( auth.uid() = user_id );

-- 4. Create policies for 'weekly_weights' table
create policy "Users can view their own weights"
on weekly_weights for select
using ( auth.uid() = user_id );

create policy "Users can insert their own weights"
on weekly_weights for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own weights"
on weekly_weights for update
using ( auth.uid() = user_id );
