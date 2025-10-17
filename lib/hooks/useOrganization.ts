'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { OrganizationFull, Membership } from '@/lib/types'

/**
 * Hook para obtener datos completos de una organización
 * Incluye miembros y estadísticas
 * 
 * @example
 * const { organization, members, stats, loading } = useOrganization(orgId)
 */
export function useOrganization(organizationId: string | null) {
  const [organization, setOrganization] = useState<OrganizationFull | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalMembers: 0,
    owners: 0,
    admins: 0,
    members: 0,
    pendingRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!organizationId) {
      setLoading(false)
      return
    }

    async function loadOrganizationData() {
      try {
        // Obtener datos completos de organización
        const { data: orgData, error: orgError } = await supabase
          .from('v_organizations_full')
          .select('*')
          .eq('id', organizationId)
          .single()

        if (orgError) throw orgError
        setOrganization(orgData)

        // Obtener miembros
        const { data: membersData, error: membersError } = await supabase
          .from('v_user_memberships')
          .select('*')
          .eq('organization_id', organizationId)
          .eq('is_active', true)
          .order('role', { ascending: true })

        if (membersError) throw membersError
        setMembers(membersData || [])

        // Calcular estadísticas
        const membersArray = membersData || []
        const statsData = {
          totalMembers: membersArray.length,
          owners: membersArray.filter(m => m.role === 'owner').length,
          admins: membersArray.filter(m => m.role === 'admin').length,
          members: membersArray.filter(m => m.role === 'member').length,
          pendingRequests: 0, // Se carga por separado si es necesario
        }
        setStats(statsData)

      } catch (err) {
        console.error('Error loading organization data:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    loadOrganizationData()
  }, [organizationId, supabase])

  // Refrescar datos
  const refresh = () => {
    setLoading(true)
    setError(null)
    // El useEffect se re-ejecutará
  }

  return {
    organization,
    members,
    stats,
    loading,
    error,
    refresh,
  }
}