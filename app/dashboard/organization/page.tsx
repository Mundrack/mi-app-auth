'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/lib/hooks/useUser'
import { supabase } from '@/lib/supabase/client'
import type { OrganizationFull } from '@/lib/types'

export default function OrganizationPage() {
  const { userWithOrg } = useUser()
  const [organization, setOrganization] = useState<OrganizationFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrganization() {
      if (!userWithOrg?.organization?.id) return

      const { data } = await supabase
        .from('v_organizations_full')
        .select('*')
        .eq('id', userWithOrg.organization.id)
        .single()

      if (data) setOrganization(data)
      setLoading(false)
    }

    loadOrganization()
  }, [userWithOrg])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando organización...</div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No perteneces a ninguna organización</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mi Organización</h1>
        <p className="text-gray-600 mt-2">Información de tu empresa</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Nombre */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {organization.name}
          </h2>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organization.industry_name && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Industria</p>
              <p className="text-gray-900 font-medium">
                {organization.industry_name}
              </p>
            </div>
          )}

          {organization.size && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Tamaño</p>
              <p className="text-gray-900 font-medium">
                {organization.size} empleados
              </p>
            </div>
          )}

          {(organization.city || organization.country) && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Ubicación</p>
              <p className="text-gray-900 font-medium">
                {organization.city}
                {organization.city && organization.country && ', '}
                {organization.country}
              </p>
            </div>
          )}

          {organization.website && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Sitio Web</p>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 font-medium hover:underline"
              >
                {organization.website}
              </a>
            </div>
          )}

          {organization.phone && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="text-gray-900 font-medium">{organization.phone}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-600 mb-1">Total Empleados</p>
            <p className="text-gray-900 font-medium">
              {organization.member_count}
            </p>
          </div>
        </div>

        {/* Descripción */}
        {organization.description && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Descripción</p>
            <p className="text-gray-900">{organization.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Organización creada el{' '}
            {new Date(organization.created_at).toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  )
}