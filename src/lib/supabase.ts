import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yfrfspkggmvxgfchiwvh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcmZzcGtnZ212eGdmY2hpd3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ5NzUsImV4cCI6MjA3MDM0MDk3NX0.UdJ4CjjR95ebPzy5DdIBHySAL_E9lPBK9DYvJ0N9P6o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
