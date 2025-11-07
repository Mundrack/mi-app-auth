import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, password, phone } = body

    if (!email || !full_name || !password) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
      }
    })

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: 'Error al crear usuario: ' + (authError?.message || 'Unknown') },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    try {
      // Crear perfil en dim_users (INACTIVO hasta que sea invitado)
      const { error: userError } = await supabaseAdmin
        .from('dim_users')
        .insert({
          id: userId,
          email,
          full_name,
          phone: phone || null,
          is_active: false, // Inactivo hasta que reciba invitación
        })

      if (userError) {
        console.error('Error creating user profile:', userError)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw userError
      }

      return NextResponse.json({
        success: true,
        message: 'Cuenta creada exitosamente',
        user_id: userId
      })

    } catch (error: any) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw error
    }

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Error al crear cuenta: ' + error.message },
      { status: 500 }
    )
  }
}