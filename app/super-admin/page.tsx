'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Mail,
  Activity,
  TrendingUp,
  Shield,
  ArrowUpRight,
  Calendar,
  AlertCircle
} from 'lucide-react'

interface Stats {
  users: {
    total: number
    active: number
    inactive: number
  }
  organizations: {
    total: number
    active: number
    inactive: number
    recent: number
  }
  memberships: {
    total: number
    owners: number
    admins: number
    members: number
  }
  invitations: {
    pending: number
  }
}

export default function SuperAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/super-admin/stats')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar estadísticas')
      }

      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" showText href="/super-admin" />
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" />
              SUPER ADMIN
            </span>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur"
          >
            Ir al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-purple-200">Vista general del sistema</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/30 rounded-xl">
                    <Users className="w-6 h-6 text-blue-300" />
                  </div>
                  <span className="text-xs text-blue-300 font-semibold px-2 py-1 bg-blue-500/20 rounded-full">
                    {stats.users.active} activos
                  </span>
                </div>
                <p className="text-blue-200 text-sm mb-1">Total Usuarios</p>
                <p className="text-4xl font-bold text-white">{stats.users.total}</p>
              </div>

              {/* Total Organizations */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/30 rounded-xl">
                    <Building2 className="w-6 h-6 text-purple-300" />
                  </div>
                  <span className="text-xs text-purple-300 font-semibold px-2 py-1 bg-purple-500/20 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.organizations.recent}
                  </span>
                </div>
                <p className="text-purple-200 text-sm mb-1">Organizaciones</p>
                <p className="text-4xl font-bold text-white">{stats.organizations.total}</p>
              </div>

              {/* Total Memberships */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/30 rounded-xl">
                    <Activity className="w-6 h-6 text-green-300" />
                  </div>
                  <span className="text-xs text-green-300 font-semibold px-2 py-1 bg-green-500/20 rounded-full">
                    membresías
                  </span>
                </div>
                <p className="text-green-200 text-sm mb-1">Total Membresías</p>
                <p className="text-4xl font-bold text-white">{stats.memberships.total}</p>
              </div>

              {/* Pending Invitations */}
              <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/30 rounded-xl">
                    <Mail className="w-6 h-6 text-orange-300" />
                  </div>
                  <span className="text-xs text-orange-300 font-semibold px-2 py-1 bg-orange-500/20 rounded-full">
                    pendientes
                  </span>
                </div>
                <p className="text-orange-200 text-sm mb-1">Invitaciones</p>
                <p className="text-4xl font-bold text-white">{stats.invitations.pending}</p>
              </div>
            </div>

            {/* Roles Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/30 rounded-lg">
                    <Shield className="w-5 h-5 text-yellow-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-200">Propietarios</h3>
                </div>
                <p className="text-5xl font-bold text-white mb-2">{stats.memberships.owners}</p>
                <p className="text-yellow-200/70 text-sm">Owners del sistema</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/30 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-200">Administradores</h3>
                </div>
                <p className="text-5xl font-bold text-white mb-2">{stats.memberships.admins}</p>
                <p className="text-blue-200/70 text-sm">Admins activos</p>
              </div>

              <div className="bg-gradient-to-br from-slate-500/20 to-gray-500/20 backdrop-blur border border-slate-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-500/30 rounded-lg">
                    <Users className="w-5 h-5 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200">Miembros</h3>
                </div>
                <p className="text-5xl font-bold text-white mb-2">{stats.memberships.members}</p>
                <p className="text-slate-200/70 text-sm">Members regulares</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/super-admin/organizations"
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 hover:from-white/20 hover:to-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/30 rounded-xl group-hover:bg-purple-500/50 transition-colors">
                    <Building2 className="w-6 h-6 text-purple-300" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Gestionar Organizaciones</h3>
                <p className="text-white/60 text-sm">Ver y administrar todas las empresas</p>
              </Link>

              <Link
                href="/super-admin/users"
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 hover:from-white/20 hover:to-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/30 rounded-xl group-hover:bg-blue-500/50 transition-colors">
                    <Users className="w-6 h-6 text-blue-300" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Gestionar Usuarios</h3>
                <p className="text-white/60 text-sm">Ver y administrar todos los usuarios</p>
              </Link>

              <Link
                href="/super-admin/activity"
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 hover:from-white/20 hover:to-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/30 rounded-xl group-hover:bg-green-500/50 transition-colors">
                    <Activity className="w-6 h-6 text-green-300" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Log de Actividad</h3>
                <p className="text-white/60 text-sm">Ver actividad del sistema</p>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}