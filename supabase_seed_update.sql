-- 1. Olivas Links
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 5, 4, 5, 3, 4, 4, 3, 4, 4, 4, 4, 3, 5, 4, 4, 3, 5]'::jsonb,
  handicaps = '[18, 4, 6, 8, 12, 2, 14, 10, 16, 11, 5, 9, 7, 3, 13, 1, 17, 15]'::jsonb
WHERE name = 'Olivas Links';

-- 2. Buenaventura Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 4, 5, 3, 4, 3, 4, 4, 5, 3, 4, 4, 3, 4, 4, 3, 5]'::jsonb,
  handicaps = '[2, 12, 8, 14, 4, 18, 6, 16, 10, 3, 15, 9, 5, 11, 7, 1, 17, 13]'::jsonb
WHERE name = 'Buenaventura Golf Course';

-- 3. Rustic Canyon Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[5, 4, 4, 3, 5, 3, 4, 3, 5, 5, 4, 4, 5, 4, 3, 4, 3, 4]'::jsonb,
  handicaps = '[13, 3, 15, 11, 5, 1, 7, 17, 9, 10, 4, 14, 18, 8, 12, 2, 16, 6]'::jsonb
WHERE name = 'Rustic Canyon Golf Course';

-- 4. Tierra Rejada Golf Club
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[5, 3, 4, 5, 4, 4, 3, 4, 5, 4, 3, 5, 4, 3, 4, 5, 3, 4]'::jsonb,
  handicaps = '[5, 15, 1, 7, 15, 13, 17, 3, 9, 6, 10, 18, 2, 8, 12, 16, 14, 4]'::jsonb
WHERE name = 'Tierra Rejada Golf Club';

-- 5. Soule Park Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 3, 5, 5, 3, 4, 4, 4, 3, 5, 4, 4, 4, 4, 3, 4, 5]'::jsonb,
  handicaps = '[7, 9, 11, 13, 15, 5, 3, 1, 17, 12, 14, 8, 18, 2, 4, 10, 6, 16]'::jsonb
WHERE name = 'Soule Park Golf Course';

-- 6. Los Robles Greens
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[5, 3, 4, 4, 4, 3, 4, 3, 4, 4, 3, 5, 4, 5, 4, 3, 4, 4]'::jsonb,
  handicaps = '[10, 18, 4, 8, 6, 14, 2, 16, 12, 1, 11, 17, 13, 7, 5, 15, 3, 9]'::jsonb
WHERE name = 'Los Robles Greens';

-- 7. Griffith Park (Harding)
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 4, 4, 3, 5, 5, 4, 4, 4, 4, 4, 3, 4, 3, 4, 4, 5]'::jsonb,
  handicaps = '[5, 17, 1, 11, 13, 15, 9, 7, 3, 8, 2, 12, 4, 18, 10, 6, 16, 14]'::jsonb
WHERE name = 'Griffith Park (Harding)';

-- 8. Rancho Park Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 3, 5, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 3, 5, 5]'::jsonb,
  handicaps = '[7, 1, 15, 17, 5, 13, 9, 11, 3, 6, 4, 10, 12, 8, 2, 18, 16, 14]'::jsonb
WHERE name = 'Rancho Park Golf Course';

-- 9. Penmar Golf Course (9 Holes)
UPDATE public.courses
SET 
  holes_count = 9,
  par_scores = '[4, 4, 3, 4, 3, 4, 4, 3, 4]'::jsonb,
  handicaps = '[11, 5, 15, 17, 3, 1, 9, 13, 7]'::jsonb
WHERE name = 'Penmar Golf Course';

-- 10. Torrey Pines (North)
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 3, 4, 5, 4, 4, 3, 5, 5, 4, 3, 4, 4, 3, 4, 5, 4]'::jsonb,
  handicaps = '[5, 1, 13, 3, 11, 7, 9, 17, 15, 12, 18, 14, 4, 6, 16, 8, 10, 2]'::jsonb
WHERE name = 'Torrey Pines (North)';

-- 11. Torrey Pines (South)
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 3, 4, 4, 5, 4, 3, 5, 5, 4, 3, 4, 4, 3, 4, 5, 4]'::jsonb,
  handicaps = '[5, 1, 13, 3, 11, 9, 7, 17, 15, 12, 18, 14, 4, 6, 16, 8, 10, 2]'::jsonb
WHERE name = 'Torrey Pines (South)';

-- 12. Coronado Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 5, 4, 5, 3, 4, 4, 4, 3, 4, 3, 4, 5, 4, 3, 4, 4, 5]'::jsonb,
  handicaps = '[5, 15, 9, 1, 17, 7, 11, 3, 13, 6, 18, 16, 2, 8, 12, 10, 4, 14]'::jsonb
WHERE name = 'Coronado Golf Course';

-- 13. Balboa Park Golf Course
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 5, 4, 4, 4, 3, 5, 4, 3, 4, 4, 4, 3, 5, 4, 5, 3, 4]'::jsonb,
  handicaps = '[15, 5, 9, 1, 13, 3, 7, 17, 11, 6, 10, 4, 18, 12, 14, 2, 16, 8]'::jsonb
WHERE name = 'Balboa Park Golf Course';

-- 14. Standard Default for Remaining 8 Courses
UPDATE public.courses
SET 
  holes_count = 18,
  par_scores = '[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]'::jsonb,
  handicaps = '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]'::jsonb
WHERE name IN (
  'River Ridge Golf Course',
  'Griffith Park (Wilson)',
  'Chester Washington Golf Course',
  'Brookside Golf Club',
  'Knollwood Country Club',
  'Mission Trails Golf Course',
  'Steele Canyon Golf Club',
  'Encinitas Ranch Golf Course'
);
