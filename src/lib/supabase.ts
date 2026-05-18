import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

export type Course = {
  id: string;
  name: string;
  location: string;
  county: string;
  created_at: string;
};

export type Scorecard = {
  id: string;
  user_id: string;
  course_id: string;
  total_score: number;
  played_date: string;
  created_at: string;
  courses?: Course; // Joined table data
};
