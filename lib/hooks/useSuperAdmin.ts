import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase/client'

/**
 * Hook para verificar si el usuario actual es Super Admin
 * Lee el campo is_super_admin de la tabla dim_users
 */
export function useSuperAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSuperAdmin() {
      if (!user) {
        setIsSuperAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Verificar en la base de datos si es super admin
        const { data, error } = await supabase
          .from('dim_users')
          .select('is_super_admin')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setIsSuperAdmin(data?.is_super_admin || false)
      } catch (error) {
        console.error('Error checking super admin status:', error)
        setIsSuperAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkSuperAdmin()
    }
  }, [user, authLoading])

  return { isSuperAdmin, loading: loading || authLoading }
}