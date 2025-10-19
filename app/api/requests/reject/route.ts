import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID requerido' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    // 1. Verificar que el usuario actual sea owner
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar rol de owner
    const { data: currentMembership } = await supabase
      .from('fact_memberships')
      .select('role, organization_id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!currentMembership || currentMembership.role !== 'owner') {
      return NextResponse.json(
        { error: 'No tienes permisos para rechazar solicitudes' },
        { status: 403 }
      )
    }

    // 2. Verificar que la solicitud existe y está pendiente
    const { data: requestData, error: requestError } = await supabase
      .from('fact_join_requests')
      .select('*')
      .eq('id', requestId)
      .eq('organization_id', currentMembership.organization_id)
      .eq('status', 'pending')
      .single()

    if (requestError || !requestData) {
      return NextResponse.json(
        { error: 'Solicitud no encontrada' },
        { status: 404 }
      )
    }

    // 3. Actualizar estado a rechazada
    const { error: updateError } = await supabaseAdmin
      .from('fact_join_requests')
      .update({ 
        status: 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Error updating request:', updateError)
      return NextResponse.json(
        { error: 'Error al actualizar la solicitud' },
        { status: 500 }
      )
    }

    // 4. (Opcional) Enviar email de notificación
    // TODO: Implementar email de rechazo

    return NextResponse.json({
      success: true,
      message: 'Solicitud rechazada exitosamente'
    })

  } catch (error) {
    console.error('Error in reject endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}