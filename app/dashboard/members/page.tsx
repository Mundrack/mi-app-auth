'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { useOrganization } from '@/lib/hooks/useOrganization'
import { supabase } from '@/lib/supabase/client'

export default function MembersPage() {
  const { userWithOrg, role } = useUser()
  const { members, refresh } = useOrganization(userWithOrg?.organization?.id || null)
  const [changing, setChanging] = useState<string | null>(null)

  const handleChangeRole = async (userId: string, newRole: 'admin' | 'member') => {
    if (!confirm(`¿Cambiar rol a ${newRole}?`)) return

    setChanging(userId)
    try {
      const { error } = await supabase
        .from('fact_memberships')
        .update({ role: newRole })
        .eq('user_id', userId)
        .eq('organization_id', userWithOrg?.organization?.id)
        .eq('is_active', true)

      if (error) throw error

      alert('Rol actualizado correctamente')
      refresh()
    } catch (err: any) {
      alert('Error al cambiar rol: ' + err.message)
    } finally {
      setChanging(null)
    }
  }

  const handleRemoveMember = async (userId: string, userName: string) => {
    if (!confirm(`¿Remover a ${userName} de la organización?`)) return

    setChanging(userId)
    try {
      const { error } = await supabase
        .from('fact_memberships')
        .update({
          is_active: false,
          end_date: new Date().toISOString().split('T')[0],
        })
        .eq('user_id', userId)
        .eq('organization_id', userWithOrg?.organization?.id)
        .eq('is_active', true)

      if (error) throw error

      alert('Empleado removido correctamente')
      refresh()
    } catch (err: any) {
      alert('Error al remover empleado: ' + err.message)
    } finally {
      setChanging(null)
    }
  }

  if (!userWithOrg?.organization) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No perteneces a ninguna organización</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los miembros de tu organización
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{members.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Administradores</p>
          <p className="text-2xl font-bold text-gray-900">
            {members.filter(m => m.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Miembros</p>
          <p className="text-2xl font-bold text-gray-900">
            {members.filter(m => m.role === 'member').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desde
                </th>
                {role === 'owner' && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={role === 'owner' ? 5 : 4} className="px-6 py-8 text-center text-gray-500">
                    No hay empleados registrados
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {member.full_name}
                        </div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {member.position_title || '-'}
                      </div>
                      {member.department && (
                        <div className="text-xs text-gray-500">{member.department}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        member.role === 'owner'
                          ? 'bg-purple-100 text-purple-800'
                          : member.role === 'admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'owner' ? 'Propietario' :
                         member.role === 'admin' ? 'Admin' : 'Miembro'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(member.start_date).toLocaleDateString('es-ES')}
                    </td>
                    {role === 'owner' && (
                      <td className="px-6 py-4 text-right text-sm">
                        {member.role === 'owner' ? (
                          <span className="text-gray-400">-</span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {member.role === 'member' ? (
                              <button
                                onClick={() => handleChangeRole(member.user_id, 'admin')}
                                disabled={changing === member.user_id}
                                className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                              >
                                Promover
                              </button>
                            ) : (
                              <button
                                onClick={() => handleChangeRole(member.user_id, 'member')}
                                disabled={changing === member.user_id}
                                className="text-orange-600 hover:text-orange-800 font-medium disabled:opacity-50"
                              >
                                Degradar
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveMember(member.user_id, member.full_name)}
                              disabled={changing === member.user_id}
                              className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                            >
                              Remover
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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