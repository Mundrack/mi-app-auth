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
        { error: 'No tienes permisos para aprobar solicitudes' },
        { status: 403 }
      )
    }

    // 2. Obtener datos de la solicitud
    const { data: requestData, error: requestError } = await supabaseAdmin
      .from('fact_join_requests')
      .select(`
        *,
        dim_users!inner(id, email, full_name, phone)
      `)
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

    const userData = requestData.dim_users as any

    // 3. Activar usuario
    const { error: updateUserError } = await supabaseAdmin
      .from('dim_users')
      .update({
        is_active: true,
      })
      .eq('id', userData.id)

    if (updateUserError) {
      console.error('Error updating user:', updateUserError)
      return NextResponse.json(
        { error: 'Error al actualizar el usuario' },
        { status: 500 }
      )
    }

    // 4. Crear membresía
    const { error: membershipError } = await supabaseAdmin
      .from('fact_memberships')
      .insert({
        user_id: userData.id,
        organization_id: currentMembership.organization_id,
        position_id: requestData.position_id,
        role: 'member',
      })

    if (membershipError) {
      console.error('Error creating membership:', membershipError)
      return NextResponse.json(
        { error: 'Error al crear la membresía' },
        { status: 500 }
      )
    }

    // 5. Actualizar estado de la solicitud
    const { error: updateError } = await supabaseAdmin
      .from('fact_join_requests')
      .update({ 
        status: 'approved',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (updateError) {
      console.error('Error updating request:', updateError)
    }

    // 6. Obtener nombre de la organización
    const { data: orgData } = await supabaseAdmin
      .from('dim_organizations')
      .select('name')
      .eq('id', currentMembership.organization_id)
      .single()

    // 7. Enviar email de aprobación al usuario
    const { error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      userData.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        data: {
          organization_name: orgData?.name,
          status: 'approved'
        }
      }
    )

    if (emailError) {
      console.error('Error sending approval email:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: `✅ Solicitud aprobada. Email enviado a ${userData.email}`,
      user: {
        id: userData.id,
        email: userData.email,
      }
    })

  } catch (error) {
    console.error('Error in approve endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}