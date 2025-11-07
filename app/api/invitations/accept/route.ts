import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { token, user_data } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token requerido' },
        { status: 400 }
      )
    }

    // 1. Validar invitación
    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitation_tokens')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (invError || !invitation) {
      return NextResponse.json(
        { error: 'Invitación no válida' },
        { status: 404 }
      )
    }

    // Verificar expiración
    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)
    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'Invitación expirada' },
        { status: 410 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userId: string

    // 2. Si el usuario NO está autenticado, crear cuenta
    if (!user) {
      if (!user_data?.password || !user_data?.full_name) {
        return NextResponse.json(
          { error: 'Datos de usuario requeridos' },
          { status: 400 }
        )
      }

      // Crear usuario en Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: invitation.email,
        password: user_data.password,
        email_confirm: true,
        user_metadata: {
          full_name: user_data.full_name,
        }
      })

      if (authError || !authData.user) {
        console.error('Error creating user:', authError)
        return NextResponse.json(
          { error: 'Error al crear usuario: ' + (authError?.message || 'Unknown') },
          { status: 500 }
        )
      }

      userId = authData.user.id

      // Crear perfil en dim_users
      const { error: profileError } = await supabaseAdmin
        .from('dim_users')
        .insert({
          id: userId,
          email: invitation.email,
          full_name: user_data.full_name,
          phone: user_data.phone || null,
          is_active: true, // Ya está aprobado por la invitación
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw profileError
      }
    } else {
      // Usuario ya autenticado
      userId = user.id

      // Verificar que el email coincida
      if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        return NextResponse.json(
          { error: 'El email no coincide con la invitación' },
          { status: 403 }
        )
      }

      // Actualizar usuario a activo
      await supabaseAdmin
        .from('dim_users')
        .update({ is_active: true })
        .eq('id', userId)
    }

    // 3. Crear membresía
    const { error: membershipError } = await supabaseAdmin
      .from('fact_memberships')
      .insert({
        user_id: userId,
        organization_id: invitation.organization_id,
        position_id: invitation.position_id,
        role: 'member',
      })

    if (membershipError) {
      console.error('Error creating membership:', membershipError)
      return NextResponse.json(
        { error: 'Error al crear membresía' },
        { status: 500 }
      )
    }

    // 4. Marcar invitación como aceptada
    await supabaseAdmin
      .from('invitation_tokens')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id)

    return NextResponse.json({
      success: true,
      message: '¡Bienvenido! Te has unido a la organización.',
      user_id: userId,
      requires_login: !user // Si no estaba logueado, necesita login
    })

  } catch (error: any) {
    console.error('Accept invitation error:', error)
    return NextResponse.json(
      { error: 'Error al aceptar invitación: ' + error.message },
      { status: 500 }
    )
  }
}