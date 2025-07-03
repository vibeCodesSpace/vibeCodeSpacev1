-- VibeCode Freemium Model - SQL Migration

-- Step 1: Create a table for user profiles if you don't have one.
-- This table will store public user data and our freemium tracking fields.
-- It is linked 1-to-1 with the private `auth.users` table.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free', -- e.g., 'free', 'pro'
  generations_used INT NOT NULL DEFAULT 0,
  last_generation_at TIMESTAMPTZ
);

-- Step 2: Create a function to atomically increment the generation count.
-- This is more secure and performant than updating the value from the client or API.
CREATE OR REPLACE FUNCTION increment_generations(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    generations_used = generations_used + 1,
    last_generation_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Set up Row-Level Security (RLS) for the profiles table.
-- This ensures users can only see and edit their own profile.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Optional: A function to get the current user's remaining generations
CREATE OR REPLACE FUNCTION get_remaining_generations()
RETURNS INT AS $$
DECLARE
  current_plan TEXT;
  used_generations INT;
  limit INT;
BEGIN
  SELECT plan, generations_used INTO current_plan, used_generations
  FROM profiles WHERE id = auth.uid();

  IF current_plan = 'free' THEN
    limit := 5;
  ELSIF current_plan = 'pro' THEN
    limit := 50;
  ELSE
    limit := 0; -- Or some other default
  END IF;

  RETURN limit - used_generations;
END;
$$ LANGUAGE plpgsql;
