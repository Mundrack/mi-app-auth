import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'

/**
 * Cliente Admin de Supabase con Service Role Key
 * 
 * ⚠️ ADVERTENCIA: Este cliente bypasea RLS (Row Level Security)
 * Solo usar en API Routes para operaciones administrativas
 * NUNCA exponer al cliente
 * 
 * Casos de uso:
 * - Crear usuarios desde el servidor (aprobar solicitudes)
 * - Operaciones de Super Admin
 * - Tareas automatizadas (cron jobs)
 * 
 * Ejemplo:
 * import { supabaseAdmin } from '@/lib/supabase/admin'
 * const { data } = await supabaseAdmin.auth.admin.createUser({...})
 */

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY no está definida en .env.local')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)