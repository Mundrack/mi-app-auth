import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, password, phone, requests } = body

    if (!email || !full_name || !password || !requests || requests.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // 1. Crear usuario en Auth (CON confirmación de email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // ← Requiere confirmación
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
      // 2. Crear perfil en dim_users (INACTIVO)
      const { error: userError } = await supabaseAdmin
        .from('dim_users')
        .insert({
          id: userId,
          email,
          full_name,
          phone: phone || null,
          is_active: false,
        })

      if (userError) {
        console.error('Error creating user profile:', userError)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw userError
      }

      // 3. Crear solicitudes
      const joinRequests = requests.map((r: any) => ({
        user_id: userId,
        organization_id: r.organization_id,
        position_id: r.position_id,
        message: r.message || null,
        status: 'pending'
      }))

      const { error: requestsError } = await supabaseAdmin
        .from('fact_join_requests')
        .insert(joinRequests)

      if (requestsError) {
        console.error('Error creating requests:', requestsError)
        await supabaseAdmin.from('dim_users').delete().eq('id', userId)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw requestsError
      }

      // 4. Enviar email de confirmación al usuario
      const { error: emailError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      })

      if (emailError) {
        console.error('Error sending confirmation email:', emailError)
      }

      // 5. Enviar notificación a los Owners de las organizaciones
      for (const request of requests) {
        // Obtener emails de los owners de esta organización
        const { data: owners } = await supabaseAdmin
          .from('fact_memberships')
          .select(`
            dim_users!inner(email, full_name)
          `)
          .eq('organization_id', request.organization_id)
          .eq('role', 'owner')
          .eq('is_active', true)

        if (owners && owners.length > 0) {
          // Obtener info de la organización
          const { data: orgData } = await supabaseAdmin
            .from('dim_organizations')
            .select('name')
            .eq('id', request.organization_id)
            .single()

          // Aquí enviarías el email a cada owner
          // Por ahora solo lo logueamos
          console.log(`📧 Notificar a owners de ${orgData?.name}:`, owners.map((o: any) => o.dim_users.email))
          
          // TODO: Implementar envío de email real usando servicio de email
          // Ejemplo: SendGrid, Resend, etc.
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Cuenta creada. Revisa tu email para confirmar tu cuenta.',
        user_id: userId
      })

    } catch (error: any) {
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw error
    }

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Error al enviar solicitudes: ' + error.message },
      { status: 500 }
    )
  }
}