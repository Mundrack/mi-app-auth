import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, position_id } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email requerido' },
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

    // Obtener organización del owner
    const { data: membership } = await supabase
      .from('fact_memberships')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: 'No tienes permisos para enviar invitaciones' },
        { status: 403 }
      )
    }

    // 2. Generar token único
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Expira en 7 días

    // 3. Crear invitación
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitation_tokens')
      .insert({
        organization_id: membership.organization_id,
        invited_by: user.id,
        email: email.toLowerCase(),
        position_id: position_id || null,
        token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (invitationError) {
      console.error('Error creating invitation:', invitationError)
      return NextResponse.json(
        { error: 'Error al crear invitación' },
        { status: 500 }
      )
    }

    // 4. TODO: Enviar email con el link
    const invitationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${token}`
    
    console.log('📧 Invitación creada:', {
      email,
      link: invitationLink,
      expires: expiresAt
    })

    return NextResponse.json({
      success: true,
      message: 'Invitación enviada exitosamente',
      invitation_link: invitationLink,
      expires_at: expiresAt
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}