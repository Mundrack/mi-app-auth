import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // Buscar invitación
    const { data: invitation, error } = await supabaseAdmin
      .from('invitation_tokens')
      .select(`
        *,
        dim_organizations!inner(id, name, logo_url),
        dim_positions(id, title)
      `)
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invitación no válida o expirada' },
        { status: 404 }
      )
    }

    // Verificar expiración
    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)

    if (now > expiresAt) {
      await supabaseAdmin
        .from('invitation_tokens')
        .update({ status: 'expired' })
        .eq('id', invitation.id)

      return NextResponse.json(
        { error: 'La invitación ha expirado' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      valid: true,
      invitation: {
        email: invitation.email,
        organization: invitation.dim_organizations,
        position: invitation.dim_positions
      }
    })

  } catch (error: any) {
    console.error('Validation error:', error)
    return NextResponse.json(
      { error: 'Error al validar invitación' },
      { status: 500 }
    )
  }
}