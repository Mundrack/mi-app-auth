'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

interface Stats {
  totalOrganizations: number
  activeOrganizations: number
  totalUsers: number
  activeUsers: number
  totalMemberships: number
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalMemberships: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Obtener estadísticas
      const [orgsRes, usersRes, membershipsRes] = await Promise.all([
        supabase.from('dim_organizations').select('is_active', { count: 'exact' }),
        supabase.from('dim_users').select('is_active', { count: 'exact' }),
        supabase.from('fact_memberships').select('id', { count: 'exact' }).eq('is_active', true),
      ])

      const activeOrgs = orgsRes.data?.filter(o => o.is_active).length || 0
      const activeUsers = usersRes.data?.filter(u => u.is_active).length || 0

      setStats({
        totalOrganizations: orgsRes.count || 0,
        activeOrganizations: activeOrgs,
        totalUsers: usersRes.count || 0,
        activeUsers: activeUsers,
        totalMemberships: membershipsRes.count || 0,
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
          Panel de Super Administrador
        </h1>
        <p className="text-gray-600 mt-2">
          Vista general del sistema multi-tenant
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Organizations */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Organizaciones</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrganizations}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.activeOrganizations} activas
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl">
              🏢
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats.activeUsers} activos
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-2xl">
              👥
            </div>
          </div>
        </div>

        {/* Total Memberships */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Membresías Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMemberships}</p>
              <p className="text-sm text-gray-500 mt-1">
                Total de empleados
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-2xl">
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/super-admin/organizations"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">🏢</div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver Organizaciones</h3>
            <p className="text-sm text-gray-600">
              Gestionar todas las organizaciones del sistema
            </p>
          </Link>

          <Link
            href="/super-admin/users"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver Usuarios</h3>
            <p className="text-sm text-gray-600">
              Administrar todos los usuarios registrados
            </p>
          </Link>

          <Link
            href="/super-admin/activity"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Actividad Reciente</h3>
            <p className="text-sm text-gray-600">
              Ver logs y actividad del sistema
            </p>
          </Link>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Información del Sistema</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• Sistema Multi-Tenant con Row Level Security (RLS)</p>
          <p>• Autenticación vía Supabase Auth</p>
          <p>• Base de datos: Snowflake Schema</p>
          <p>• Roles: Super Admin, Owner, Admin, Member</p>
        </div>
      </div>
    </div>
  )
}