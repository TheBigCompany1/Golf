-- Ensure extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Courses Table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    county TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Scorecards Table
CREATE TABLE public.scorecards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    played_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set Row Level Security (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;

-- Allow read access to courses for authenticated users
CREATE POLICY "Allow authenticated read access on courses" ON public.courses
    FOR SELECT TO authenticated USING (true);

-- Allow full access to own scorecards for authenticated users
CREATE POLICY "Allow individual read access to own scorecards" ON public.scorecards
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow individual insert access to own scorecards" ON public.scorecards
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual update access to own scorecards" ON public.scorecards
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow individual delete access to own scorecards" ON public.scorecards
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed Data: Public Courses in Ventura, LA, and San Diego Counties
INSERT INTO public.courses (name, location, county) VALUES
-- Ventura County
('Olivas Links', 'Ventura', 'Ventura County'),
('Buenaventura Golf Course', 'Ventura', 'Ventura County'),
('Rustic Canyon Golf Course', 'Moorpark', 'Ventura County'),
('Tierra Rejada Golf Club', 'Moorpark', 'Ventura County'),
('River Ridge Golf Course', 'Oxnard', 'Ventura County'),
('Soule Park Golf Course', 'Ojai', 'Ventura County'),
('Los Robles Greens', 'Thousand Oaks', 'Ventura County'),

-- Los Angeles County
('Griffith Park (Harding)', 'Los Angeles', 'Los Angeles County'),
('Griffith Park (Wilson)', 'Los Angeles', 'Los Angeles County'),
('Rancho Park Golf Course', 'Los Angeles', 'Los Angeles County'),
('Penmar Golf Course', 'Venice', 'Los Angeles County'),
('Chester Washington Golf Course', 'Los Angeles', 'Los Angeles County'),
('Brookside Golf Club', 'Pasadena', 'Los Angeles County'),
('Knollwood Country Club', 'Granada Hills', 'Los Angeles County'),

-- San Diego County
('Torrey Pines (North)', 'La Jolla', 'San Diego County'),
('Torrey Pines (South)', 'La Jolla', 'San Diego County'),
('Coronado Golf Course', 'Coronado', 'San Diego County'),
('Balboa Park Golf Course', 'San Diego', 'San Diego County'),
('Mission Trails Golf Course', 'San Diego', 'San Diego County'),
('Steele Canyon Golf Club', 'Jamul', 'San Diego County'),
('Encinitas Ranch Golf Course', 'Encinitas', 'San Diego County');

-- Create Admin User
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'admin@golftracker.com',
    crypt('AdminGolf2026!', gen_salt('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    '{"name": "Admin"}',
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
);
