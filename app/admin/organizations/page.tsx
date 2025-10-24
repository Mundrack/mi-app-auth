'use client'

import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface Organization {
  id: string
  name: string
  slug: string
  is_active: boolean
  industry_name: string | null
  city: string | null
  country: string | null
  member_count: number
  created_at: string
}

interface Member {
  user_id: string
  full_name: string
  email: string
  role: string
  position_title: string | null
}

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null)
  const [members, setMembers] = useState<Record<string, Member[]>>({})
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadOrganizations()
  }, [])

  async function loadOrganizations() {
    const { data, error } = await supabaseAdmin
      .from('v_organizations_full')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrganizations(data as any)
    }
    setLoading(false)
  }

  async function loadMembers(orgId: string) {
    if (members[orgId]) {
      setExpandedOrg(expandedOrg === orgId ? null : orgId)
      return
    }

    const { data } = await supabaseAdmin
      .from('v_user_memberships')
      .select('*')
      .eq('organization_id', orgId)
      .eq('is_active', true)

    if (data) {
      setMembers({ ...members, [orgId]: data as any })
      setExpandedOrg(orgId)
    }
  }

  async function toggleOrganization(orgId: string, currentStatus: boolean) {
    if (!confirm(`¿${currentStatus ? 'Desactivar' : 'Activar'} esta organización?`)) return

    setProcessing(orgId)
    try {
      const { error } = await supabaseAdmin
        .from('dim_organizations')
        .update({ is_active: !currentStatus })
        .eq('id', orgId)

      if (error) throw error

      alert('Organización actualizada')
      loadOrganizations()
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando organizaciones...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizaciones</h1>
          <p className="text-gray-600 mt-2">
            {organizations.length} organizaciones en el sistema
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {organizations.map((org) => (
          <div
            key={org.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {org.name}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        org.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {org.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {org.industry_name && (
                      <div>
                        <span className="text-gray-600">Industria:</span>
                        <span className="ml-2 text-gray-900">{org.industry_name}</span>
                      </div>
                    )}
                    {(org.city || org.country) && (
                      <div>
                        <span className="text-gray-600">Ubicación:</span>
                        <span className="ml-2 text-gray-900">
                          {org.city}{org.city && org.country && ', '}{org.country}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Empleados:</span>
                      <span className="ml-2 text-gray-900">{org.member_count}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Creada: {new Date(org.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => loadMembers(org.id)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {expandedOrg === org.id ? 'Ocultar' : 'Ver'} Empleados
                  </button>
                  <button
                    onClick={() => toggleOrganization(org.id, org.is_active)}
                    disabled={processing === org.id}
                    className={`px-4 py-2 text-sm font-medium rounded ${
                      org.is_active
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    } disabled:opacity-50`}
                  >
                    {processing === org.id
                      ? 'Procesando...'
                      : org.is_active
                      ? 'Desactivar'
                      : 'Activar'}
                  </button>
                </div>
              </div>
            </div>

            {expandedOrg === org.id && members[org.id] && (
              <div className="border-t border-gray-200 bg-gray-50 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Empleados ({members[org.id].length})
                </h4>
                {members[org.id].length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay empleados</p>
                ) : (
                  <div className="space-y-3">
                    {members[org.id].map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.full_name}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                          {member.position_title && (
                            <div className="text-xs text-gray-500 mt-1">
                              {member.position_title}
                            </div>
                          )}
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                            member.role === 'owner'
                              ? 'bg-purple-100 text-purple-800'
                              : member.role === 'admin'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {member.role === 'owner'
                            ? 'Propietario'
                            : member.role === 'admin'
                            ? 'Admin'
                            : 'Miembro'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}