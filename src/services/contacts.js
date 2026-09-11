import { demoContacts } from '../data/demoContacts'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function getContacts() {
  if (!isSupabaseConfigured) return demoContacts

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // During the hackathon, fall back to seeded contacts until auth is wired up.
  if (!user) return demoContacts

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) {
    console.warn('Supabase contacts query failed; using demo contacts.', error)
    return demoContacts
  }

  return data?.length ? data : demoContacts
}
