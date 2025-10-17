'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'
import type { User, UserWithOrganization } from '@/lib/types'

/**
 * Hook para obtener datos completos del usuario
 * Incluye perfil, organización y membresías
 * 
 * @example
 * const { profile, organization, membership, loading } = useUser()
 */
export function useUser() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [userWithOrg, setUserWithOrg] = useState<UserWithOrganization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function loadUserData() {
      try {
        // Obtener perfil del usuario
        const { data: profileData, error: profileError } = await supabase
          .from('dim_users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)

        // Obtener membresía activa (primera organización)
        const { data: membershipData, error: membershipError } = await supabase
          .from('v_user_memberships')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1)
          .single()

        if (membershipError && membershipError.code !== 'PGRST116') {
          // PGRST116 = no rows returned (es válido si no tiene org)
          throw membershipError
        }

        setUserWithOrg({
          ...profileData,
          organization: membershipData ? {
            id: membershipData.organization_id,
            name: membershipData.organization_name,
            slug: membershipData.organization_slug,
          } as any : undefined,
          membership: membershipData ? {
            role: membershipData.role,
            start_date: membershipData.start_date,
            is_active: membershipData.is_active,
          } as any : undefined,
          position: membershipData?.position_title ? {
            title: membershipData.position_title,
            level: membershipData.position_level,
            department: membershipData.department,
          } as any : undefined,
        })
      } catch (err) {
        console.error('Error loading user data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, supabase])

  // Refrescar datos
  const refresh = async () => {
    setLoading(true)
    setError(null)
    // El useEffect se re-ejecutará automáticamente
  }

  return {
    profile,
    userWithOrg,
    organization: userWithOrg?.organization,
    membership: userWithOrg?.membership,
    position: userWithOrg?.position,
    role: userWithOrg?.membership?.role,
    loading,
    error,
    refresh,
  }
}