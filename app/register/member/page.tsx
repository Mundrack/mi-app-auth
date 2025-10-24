'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import type { Organization, Position } from '@/lib/types'

export default function RegisterMemberPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [error, setError] = useState('')
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([])
  const router = useRouter()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    requests: [] as Array<{
      organization_id: string
      position_id: string
      message: string
    }>
  })

  // Cargar organizaciones y puestos
  useEffect(() => {
    async function loadData() {
      try {
        // Cargar organizaciones desde API público
        const orgsResponse = await fetch('/api/organizations/public')
        const orgsData = await orgsResponse.json()
        
        // Cargar posiciones desde API público
        const positionsResponse = await fetch('/api/positions/public')
        const positionsData = await positionsResponse.json()
        
        if (orgsData.success && orgsData.organizations) {
          setOrganizations(orgsData.organizations)
          console.log('✅ Organizations loaded:', orgsData.organizations.length)
        } else {
          console.error('❌ Error loading organizations:', orgsData.error)
          setError('No se pudieron cargar las organizaciones')
        }

        if (positionsData.success && positionsData.positions) {
          setPositions(positionsData.positions)
          console.log('✅ Positions loaded:', positionsData.positions.length)
        } else {
          console.error('❌ Error loading positions:', positionsData.error)
        }
      } catch (error) {
        console.error('❌ Load data error:', error)
        setError('Error al cargar los datos')
      }
    }
    loadData()
  }, [])

  const toggleOrganization = (orgId: string) => {
    if (selectedOrgs.includes(orgId)) {
      setSelectedOrgs(selectedOrgs.filter(id => id !== orgId))
      setFormData({
        ...formData,
        requests: formData.requests.filter(r => r.organization_id !== orgId)
      })
    } else {
      setSelectedOrgs([...selectedOrgs, orgId])
      setFormData({
        ...formData,
        requests: [...formData.requests, {
          organization_id: orgId,
          position_id: '',
          message: ''
        }]
      })
    }
  }

  const updateRequest = (orgId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      requests: formData.requests.map(r =>
        r.organization_id === orgId ? { ...r, [field]: value } : r
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!formData.full_name || !formData.email) {
        setError('Por favor completa todos los campos requeridos')
        return
      }
      setStep(2)
      setError('')
      return
    }

    if (step === 2) {
      if (selectedOrgs.length === 0) {
        setError('Selecciona al menos una organización')
        return
      }
      setStep(3)
      setError('')
      return
    }

    // Paso 3: Enviar solicitudes usando API route
    setLoading(true)
    setError('')

    try {
      // Validar que todas las solicitudes tengan position_id
      const invalidRequests = formData.requests.filter(r => !r.position_id)
      if (invalidRequests.length > 0) {
        throw new Error('Por favor selecciona un puesto para cada organización')
      }

      // Llamar al API route
      const response = await fetch('/api/register/member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar solicitudes')
      }

      // Redirigir a página de confirmación
      router.push('/request-sent')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Error al enviar solicitudes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-semibold text-gray-900">
            Mi App
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>1</div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>2</div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-gray-900' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>3</div>
          </div>
          <p className="text-center text-sm text-gray-600">
            {step === 1 && 'Datos Personales'}
            {step === 2 && 'Seleccionar Organizaciones'}
            {step === 3 && 'Detalles de Solicitudes'}
          </p>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Unirse a una Organización
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Solicita acceso a una o más empresas
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Paso 1: Datos personales */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Continuar
              </button>
            </>
          )}

          {/* Paso 2: Seleccionar organizaciones */}
          {step === 2 && (
            <>
              <p className="text-sm text-gray-600">Selecciona las organizaciones a las que deseas unirte:</p>
              <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {organizations.map((org) => (
                  <label
                    key={org.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOrgs.includes(org.id)}
                      onChange={() => toggleOrganization(org.id)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-900">{org.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                  Atrás
                </button>
                <button type="submit" className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800">
                  Continuar
                </button>
              </div>
            </>
          )}

          {/* Paso 3: Detalles por organización */}
          {step === 3 && (
            <>
              <div className="space-y-6">
                {formData.requests.map((request) => {
                  const org = organizations.find(o => o.id === request.organization_id)
                  return (
                    <div key={request.organization_id} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">{org?.name}</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Puesto Deseado *</label>
                          <select
                            required
                            value={request.position_id}
                            onChange={(e) => updateRequest(request.organization_id, 'position_id', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Seleccionar...</option>
                            {positions.map((pos) => (
                              <option key={pos.id} value={pos.id}>{pos.title}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (opcional)</label>
                          <textarea
                            rows={3}
                            value={request.message}
                            onChange={(e) => updateRequest(request.organization_id, 'message', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            placeholder="¿Por qué quieres unirte?"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50">
                  Atrás
                </button>
                <button type="submit" disabled={loading} className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
                  {loading ? 'Enviando...' : 'Enviar Solicitudes'}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </div>
  )
}