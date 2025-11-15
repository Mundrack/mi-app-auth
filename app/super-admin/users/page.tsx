'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface User {
  id: string
  full_name: string
  email: string
  is_active: boolean
  is_super_admin: boolean
  created_at: string
  last_login: string | null
  organization_count: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      // Obtener todos los usuarios
      const { data: usersData, error: usersError } = await supabase
        .from('dim_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Para cada usuario, contar organizaciones
      const usersWithDetails = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count } = await supabase
            .from('fact_memberships')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('is_active', true)

          return {
            ...user,
            organization_count: count || 0,
          }
        })
      )

      setUsers(usersWithDetails as User[])
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <p className="text-gray-600 mt-2">
          Administrar todos los usuarios del sistema
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => u.is_active).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Super Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.is_super_admin).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Inactivos</p>
          <p className="text-2xl font-bold text-gray-400">
            {users.filter(u => !u.is_active).length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Organizaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rol Especial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Fecha Registro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {user.organization_count} {user.organization_count === 1 ? 'org' : 'orgs'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_super_admin ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                          ⭐ Super Admin
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : 'Nunca'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}