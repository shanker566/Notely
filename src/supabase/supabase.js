import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your project's URL and anon key
const supabaseUrl = 'https://cfiyvsbiznthvokderfu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaXl2c2Jpem50aHZva2RlcmZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTI4ODIsImV4cCI6MjA3Njg4ODg4Mn0.g03SEKh4ngt8v8Cbg6boWSLX50hWrYj4Ay963fxt0c0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);