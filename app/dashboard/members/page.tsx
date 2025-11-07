'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { supabase } from '@/lib/supabase/client'
import { Users, Crown, Shield, Briefcase, Search, Filter, Mail, Phone, MoreVertical } from 'lucide-react'

interface Member {
  id: string
  full_name: string
  email: string
  phone: string | null
  role: string
  position_title: string | null
  is_active: boolean
  joined_at: string
}

export default function MembersPage() {
  const { userWithOrg, role } = useUser()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'owner' | 'admin' | 'member'>('all')

  useEffect(() => {
    if (userWithOrg?.organization?.id) {
      loadMembers()
    }
  }, [userWithOrg])

  const loadMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('fact_memberships')
        .select(`
          id,
          role,
          is_active,
          created_at,
          dim_users!inner(
            id,
            full_name,
            email,
            phone
          ),
          dim_positions(
            title
          )
        `)
        .eq('organization_id', userWithOrg?.organization?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedMembers = data.map((m: any) => ({
        id: m.dim_users.id,
        full_name: m.dim_users.full_name,
        email: m.dim_users.email,
        phone: m.dim_users.phone,
        role: m.role,
        position_title: m.dim_positions?.title,
        is_active: m.is_active,
        joined_at: m.created_at
      }))

      setMembers(formattedMembers)
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <Briefcase className="w-4 h-4 text-slate-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    const styles = {
      owner: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      admin: 'bg-blue-100 text-blue-700 border-blue-200',
      member: 'bg-slate-100 text-slate-700 border-slate-200'
    }
    const labels = {
      owner: 'Propietario',
      admin: 'Administrador',
      member: 'Miembro'
    }
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[role as keyof typeof styles]}`}>
        {getRoleIcon(role)}
        {labels[role as keyof typeof labels]}
      </span>
    )
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || member.role === filterRole
    return matchesSearch && matchesRole
  })

  const stats = {
    total: members.length,
    owners: members.filter(m => m.role === 'owner').length,
    admins: members.filter(m => m.role === 'admin').length,
    members: members.filter(m => m.role === 'member').length
  }

  if (role !== 'owner' && role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No tienes permisos para ver esta página</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empleados</h1>
          <p className="text-slate-600 mt-1">Gestiona los miembros de tu equipo</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Propietarios</p>
          <p className="text-3xl font-bold text-slate-900">{stats.owners}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Administradores</p>
          <p className="text-3xl font-bold text-slate-900">{stats.admins}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-slate-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Miembros</p>
          <p className="text-3xl font-bold text-slate-900">{stats.members}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRole === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterRole('owner')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRole === 'owner'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Owners
            </button>
            <button
              onClick={() => setFilterRole('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRole === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setFilterRole('member')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterRole === 'member'
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Miembros
            </button>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Cargando empleados...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No se encontraron empleados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Empleado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Rol</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Puesto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Contacto</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {member.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{member.full_name}</p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="px-6 py-4">
                      {member.position_title ? (
                        <span className="text-sm text-slate-700">{member.position_title}</span>
                      ) : (
                        <span className="text-sm text-slate-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}