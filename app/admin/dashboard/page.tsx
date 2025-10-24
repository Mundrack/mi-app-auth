'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface Stats {
  totalOrganizations: number
  totalUsers: number
  totalMembers: number
  pendingRequests: number
  activeOrganizations: number
  inactiveUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrganizations: 0,
    totalUsers: 0,
    totalMembers: 0,
    pendingRequests: 0,
    activeOrganizations: 0,
    inactiveUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Total organizaciones
      const { count: orgsCount } = await supabaseAdmin
        .from('dim_organizations')
        .select('*', { count: 'exact', head: true })

      // Organizaciones activas
      const { count: activeOrgsCount } = await supabaseAdmin
        .from('dim_organizations')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Total usuarios
      const { count: usersCount } = await supabaseAdmin
        .from('dim_users')
        .select('*', { count: 'exact', head: true })

      // Usuarios inactivos
      const { count: inactiveUsersCount } = await supabaseAdmin
        .from('dim_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', false)

      // Total membresías activas
      const { count: membersCount } = await supabaseAdmin
        .from('fact_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Solicitudes pendientes
      const { count: requestsCount } = await supabaseAdmin
        .from('fact_join_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      setStats({
        totalOrganizations: orgsCount || 0,
        totalUsers: usersCount || 0,
        totalMembers: membersCount || 0,
        pendingRequests: requestsCount || 0,
        activeOrganizations: activeOrgsCount || 0,
        inactiveUsers: inactiveUsersCount || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando estadísticas...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard Super Admin
        </h1>
        <p className="text-gray-600 mt-2">
          Vista global del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🏢</div>
            <Link
              href="/admin/organizations"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todas →
            </Link>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Organizaciones
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalOrganizations}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.activeOrganizations} activas
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👥</div>
            <Link
              href="/admin/users"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todos →
            </Link>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Usuarios
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalUsers}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {stats.inactiveUsers} inactivos
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🤝</div>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Membresías Activas
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalMembers}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Total de empleados
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📋</div>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Solicitudes Pendientes
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.pendingRequests}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Esperando aprobación
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Promedio Empleados
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalOrganizations > 0
              ? Math.round(stats.totalMembers / stats.totalOrganizations)
              : 0}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Por organización
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">✅</div>
          </div>
          <div className="text-gray-600 text-sm font-medium mb-1">
            Tasa de Activación
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalOrganizations > 0
              ? Math.round((stats.activeOrganizations / stats.totalOrganizations) * 100)
              : 0}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Organizaciones activas
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/organizations"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl mb-3">🏢</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Gestionar Organizaciones
            </h3>
            <p className="text-sm text-gray-600">
              Ver, editar o eliminar organizaciones
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            <div className="text-2xl mb-3">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Gestionar Usuarios
            </h3>
            <p className="text-sm text-gray-600">
              Ver, activar o desactivar usuarios
            </p>
          </Link>

          <button
            onClick={loadStats}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors text-left"
          >
            <div className="text-2xl mb-3">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Actualizar Datos
            </h3>
            <p className="text-sm text-gray-600">
              Refrescar estadísticas del sistema
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}