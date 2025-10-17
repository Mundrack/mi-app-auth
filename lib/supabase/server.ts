import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/types/database'

/**
 * Cliente de Supabase para Server Components y Route Handlers
 * Maneja cookies automáticamente para mantener la sesión
 * 
 * Ejemplo en Server Component:
 * const supabase = createServerSupabaseClient()
 * const { data } = await supabase.from('dim_users').select('*')
 * 
 * Ejemplo en Route Handler:
 * export async function GET() {
 *   const supabase = createServerSupabaseClient()
 *   // ...
 * }
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Error cuando se intenta set cookies desde Server Component
            // Esto es esperado y seguro de ignorar
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Error cuando se intenta remove cookies desde Server Component
            // Esto es esperado y seguro de ignorar
          }
        },
      },
    }
  )
}