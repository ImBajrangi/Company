import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tilimltxgeucefxzerqi.supabase.co'
const supabaseAnonKey = 'sb_publishable_0YiM-Q8itRORUDdToracaQ_vzcrjUlC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
