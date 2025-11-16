import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xgciauqejlrrqibnpxnh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnY2lhdXFlamxycnFpYm5weG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMDE0NTYsImV4cCI6MjA3ODg3NzQ1Nn0.9Qld9Likgv3y_TYznPbxVnwl2OSW2g4c3zzihVaEGZY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
