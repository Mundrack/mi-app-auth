'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface User {
  id: string
  email: string
  full_name: string
  phone: string | null
  is_active: boolean
  created_at: string
  last_login: string | null
}

interface UserWithOrgs extends User {
  organizations?: {
    organization_name: string
    role: string
  }[]
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithOrgs[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadUsers()
  }, [filter])

  async function loadUsers() {
    setLoading(true)

    let query = supabaseAdmin
      .from('dim_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter === 'active') {
      query = query.eq('is_active', true)
    } else if (filter === 'inactive') {
      query = query.eq('is_active', false)
    }

    const { data, error } = await query

    if (!error && data) {
      // Cargar organizaciones de cada usuario
      const usersWithOrgs = await Promise.all(
        data.map(async (user) => {
          const { data: orgs } = await supabaseAdmin
            .from('v_user_memberships')
            .select('organization_name, role')
            .eq('user_id', user.id)
            .eq('is_active', true)

          return {
            ...user,
            organizations: orgs || [],
          }
        })
      )

      setUsers(usersWithOrgs as any)
    }

    setLoading(false)
  }

  async function toggleUserStatus(userId: string, currentStatus: boolean) {
    if (!confirm(`¿${currentStatus ? 'Desactivar' : 'Activar'} este usuario?`)) return

    setProcessing(userId)
    try {
      const { error } = await supabaseAdmin
        .from('dim_users')
        .update({ is_active: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      alert('Usuario actualizado')
      loadUsers()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando usuarios...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-2">
            {users.length} usuarios en el sistema
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'active'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Activos
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              filter === 'inactive'
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Inactivos
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Organizaciones
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Registro
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-400">{user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.organizations && user.organizations.length > 0 ? (
                        <div className="space-y-1">
                          {user.organizations.map((org, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="text-gray-900">{org.organization_name}</span>
                              <span className="text-gray-500 ml-2">
                                ({org.role === 'owner' ? 'Propietario' : org.role === 'admin' ? 'Admin' : 'Miembro'})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin organizaciones</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        disabled={processing === user.id}
                        className={`px-3 py-1 font-medium rounded ${
                          user.is_active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        } disabled:opacity-50`}
                      >
                        {processing === user.id
                          ? 'Procesando...'
                          : user.is_active
                          ? 'Desactivar'
                          : 'Activar'}
                      </button>
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