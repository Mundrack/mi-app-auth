'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { 
  Users, 
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Search,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  AlertCircle
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  phone: string | null
  is_active: boolean
  is_super_admin: boolean
  created_at: string
  fact_memberships: Array<{
    role: string
    is_active: boolean
    dim_organizations: {
      id: string
      name: string
    } | null
    dim_positions: {
      title: string
    } | null
  }>
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'owner' | 'admin' | 'member'>('all')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/super-admin/users')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar usuarios')
      }

      setUsers(data.users)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-400" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-400" />
      default:
        return <Briefcase className="w-4 h-4 text-slate-400" />
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      admin: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      member: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
    const labels = {
      owner: 'Owner',
      admin: 'Admin',
      member: 'Member'
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {getRoleIcon(role)}
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || 
                        user.fact_memberships.some(m => m.role === filterRole)
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    superAdmins: users.filter(u => u.is_super_admin).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/super-admin"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <Logo size="md" showText={false} />
            <div>
              <h1 className="text-xl font-bold text-white">Usuarios</h1>
              <p className="text-sm text-purple-200">Gestión de usuarios del sistema</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-300" />
              </div>
            </div>
            <p className="text-blue-200 text-sm mb-1">Total Usuarios</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-300" />
              </div>
            </div>
            <p className="text-green-200 text-sm mb-1">Usuarios Activos</p>
            <p className="text-3xl font-bold text-white">{stats.active}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500/30 rounded-lg">
                <Shield className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
            <p className="text-yellow-200 text-sm mb-1">Super Admins</p>
            <p className="text-3xl font-bold text-white">{stats.superAdmins}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterRole === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterRole('owner')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterRole === 'owner'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Owners
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterRole === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setFilterRole('member')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterRole === 'member'
                    ? 'bg-slate-600 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Members
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-12 text-center">
            <Users className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Usuario</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Organización</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Puesto</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase">Estado</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase">Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => {
                    const membership = user.fact_memberships[0]
                    return (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.full_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-white">{user.full_name}</p>
                                {user.is_super_admin && (
                                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                                    SUPER
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/50 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-xs text-white/50 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {membership?.dim_organizations ? (
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-purple-400" />
                              <span className="text-white/80 text-sm">{membership.dim_organizations.name}</span>
                            </div>
                          ) : (
                            <span className="text-white/40 text-sm">Sin organización</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {membership && getRoleBadge(membership.role)}
                        </td>
                        <td className="px-6 py-4">
                          {membership?.dim_positions ? (
                            <span className="text-white/70 text-sm">{membership.dim_positions.title}</span>
                          ) : (
                            <span className="text-white/40 text-sm">Sin asignar</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            user.is_active
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {user.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1 text-xs text-white/60">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.created_at).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}