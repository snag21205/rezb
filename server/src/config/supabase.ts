import { createClient } from '@supabase/supabase-js'
import { env } from './env'

/**
 * Supabase Admin client (service role)
 * Used server-side to bypass RLS for admin operations
 */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * Create a Supabase client scoped to a specific user
 * Used to respect RLS policies
 */
export function createUserClient(accessToken: string) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  )
}
