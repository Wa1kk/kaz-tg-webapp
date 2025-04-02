import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bofzcaabnzbturaihlsh.supabase.co'
const SUPABASE_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvZnpjYWFibnpidHVyYWlobHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzI1NjUsImV4cCI6MjA1ODk0ODU2NX0.4xB6Z5y2n8ZRzGuFzqsuDvL4lbSNOswj9wI8esEvLeo'

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)
export default supabase