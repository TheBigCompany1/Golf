-- Add dynamic hole data to courses
ALTER TABLE public.courses
ADD COLUMN holes_count INTEGER DEFAULT 18,
ADD COLUMN par_scores JSONB DEFAULT '[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]'::jsonb,
ADD COLUMN handicaps JSONB DEFAULT '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]'::jsonb;

-- Add hole_scores to scorecards and make total_score default to 0
ALTER TABLE public.scorecards
ADD COLUMN hole_scores JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.scorecards
ALTER COLUMN total_score SET DEFAULT 0;
