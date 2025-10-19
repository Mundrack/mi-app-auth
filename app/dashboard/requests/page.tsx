'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { supabase } from '@/lib/supabase/client'

interface Request {
  id: string
  user_id: string
  user_email: string
  user_name: string
  user_position: string
  position_title: string | null
  message: string | null
  created_at: string
}

export default function RequestsPage() {
  const { userWithOrg, role } = useUser()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (role && role !== 'owner') {
      router.push('/dashboard')
      return
    }
    loadRequests()
  }, [role, userWithOrg])

  async function loadRequests() {
    if (!userWithOrg?.organization?.id) return

    const { data, error } = await supabase
      .from('fact_join_requests')
      .select(`
        id,
        user_id,
        message,
        created_at,
        dim_users!inner(email, full_name),
        dim_positions(title)
      `)
      .eq('organization_id', userWithOrg.organization.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const formattedRequests = data.map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        user_email: r.dim_users.email,
        user_name: r.dim_users.full_name,
        position_title: r.dim_positions?.title || null,
        message: r.message,
        created_at: r.created_at,
      }))
      setRequests(formattedRequests)
    }

    setLoading(false)
  }

  async function handleApprove(request: Request) {
    if (!confirm(`¿Aprobar la solicitud de ${request.user_name}?`)) return

    setProcessing(request.id)
    try {
      const response = await fetch('/api/requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ Solicitud aprobada. Usuario creado: ${request.user_email}`)
        loadRequests()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert('❌ Error al procesar la solicitud')
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(request: Request) {
    if (!confirm(`¿Rechazar la solicitud de ${request.user_name}?`)) return

    setProcessing(request.id)
    try {
      const response = await fetch('/api/requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`✅ Solicitud rechazada`)
        loadRequests()
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert('❌ Error al procesar la solicitud')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Cargando solicitudes...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Solicitudes Pendientes
        </h1>
        <p className="text-gray-600 mt-2">
          Revisa y gestiona las solicitudes de acceso
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">
            No hay solicitudes pendientes
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {request.user_name}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Email:</span>{' '}
                      {request.user_email}
                    </p>
                    {request.position_title && (
                      <p>
                        <span className="font-medium">Puesto deseado:</span>{' '}
                        {request.position_title}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Fecha:</span>{' '}
                      {new Date(request.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>

              {request.message && (
                <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Mensaje:
                  </p>
                  <p className="text-sm text-gray-600">{request.message}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(request)}
                  disabled={processing === request.id}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                >
                  {processing === request.id ? 'Procesando...' : '✓ Aprobar'}
                </button>
                <button
                  onClick={() => handleReject(request)}
                  disabled={processing === request.id}
                  className="flex-1 bg-white text-gray-900 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                >
                  {processing === request.id ? 'Procesando...' : '✗ Rechazar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}