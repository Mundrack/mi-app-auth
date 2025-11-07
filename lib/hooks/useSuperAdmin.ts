import { useState, useEffect } from 'react'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface OrganizationStats {
  id: string
  name: string
  slug: string
  is_active: boolean
  created_at: string
  total_members: number
  owners: number
  admins: number
  members: number
  pending_requests: number
}

interface GlobalStats {
  total_organizations: number
  active_organizations: number
  total_users: number
  active_users: number
  total_requests: number
  pending_requests: number
}

export function useSuperAdmin() {
  const [organizations, setOrganizations] = useState<OrganizationStats[]>([])
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // 1. Cargar todas las organizaciones con stats
      const { data: orgs } = await supabaseAdmin
        .from('dim_organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (orgs) {
        // Obtener stats de cada organización
        const orgsWithStats = await Promise.all(
          orgs.map(async (org) => {
            const { data: members } = await supabaseAdmin
              .from('fact_memberships')
              .select('role')
              .eq('organization_id', org.id)
              .eq('is_active', true)

            const { count: pendingCount } = await supabaseAdmin
              .from('fact_join_requests')
              .select('*', { count: 'exact', head: true })
              .eq('organization_id', org.id)
              .eq('status', 'pending')

            const owners = members?.filter(m => m.role === 'owner').length || 0
            const admins = members?.filter(m => m.role === 'admin').length || 0
            const regularMembers = members?.filter(m => m.role === 'member').length || 0

            return {
              ...org,
              total_members: members?.length || 0,
              owners,
              admins,
              members: regularMembers,
              pending_requests: pendingCount || 0
            }
          })
        )

        setOrganizations(orgsWithStats)

        // 2. Calcular estadísticas globales
        const { count: totalUsers } = await supabaseAdmin
          .from('dim_users')
          .select('*', { count: 'exact', head: true })

        const { count: activeUsers } = await supabaseAdmin
          .from('dim_users')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        const { count: totalRequests } = await supabaseAdmin
          .from('fact_join_requests')
          .select('*', { count: 'exact', head: true })

        const { count: pendingRequests } = await supabaseAdmin
          .from('fact_join_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        setGlobalStats({
          total_organizations: orgs.length,
          active_organizations: orgs.filter(o => o.is_active).length,
          total_users: totalUsers || 0,
          active_users: activeUsers || 0,
          total_requests: totalRequests || 0,
          pending_requests: pendingRequests || 0
        })
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOrganizationStatus = async (orgId: string, isActive: boolean) => {
    try {
      const { error } = await supabaseAdmin
        .from('dim_organizations')
        .update({ is_active: !isActive })
        .eq('id', orgId)

      if (!error) {
        await loadAdminData()
      }
    } catch (error) {
      console.error('Error toggling organization:', error)
    }
  }

  return {
    organizations,
    globalStats,
    loading,
    refresh: loadAdminData,
    toggleOrganizationStatus
  }
}