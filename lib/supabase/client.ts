import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database'

/**
 * Cliente de Supabase para uso en el navegador
 * Usar en componentes con 'use client'
 * 
 * Ejemplo:
 * const supabase = createClient()
 * const { data } = await supabase.from('dim_users').select('*')
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export singleton para uso directo
export const supabase = createClient()