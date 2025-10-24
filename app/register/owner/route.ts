import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateSlug } from '@/lib/utils/formatters'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      full_name,
      email,
      password,
      phone,
      organization_name,
      industry_id,
      size,
      city,
      country,
      website,
      description
    } = body

    // Validaciones básicas
    if (!email || !password || !full_name || !organization_name) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // 1. Crear usuario en Auth usando admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        full_name,
      }
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: 'Error al crear usuario: ' + (authError?.message || 'Unknown') },
        { status: 500 }
      )
    }

    const userId = authData.user.id

    try {
      // 2. Crear organización
      const orgSlug = generateSlug(organization_name)
      const { data: orgData, error: orgError } = await supabaseAdmin
        .from('dim_organizations')
        .insert({
          name: organization_name,
          slug: orgSlug,
        })
        .select()
        .single()

      if (orgError) throw orgError

      // 3. Crear ubicación
      const { data: locationData, error: locationError } = await supabaseAdmin
        .from('dim_locations')
        .insert({
          city,
          country,
        })
        .select()
        .single()

      if (locationError) throw locationError

      // 4. Crear detalles de organización
      const { error: detailsError } = await supabaseAdmin
        .from('fact_organization_details')
        .insert({
          organization_id: orgData.id,
          industry_id: industry_id || null,
          location_id: locationData.id,
          size,
          website: website || null,
          description: description || null,
        })

      if (detailsError) throw detailsError

      // 5. Crear perfil de usuario
      const { error: profileError } = await supabaseAdmin
        .from('dim_users')
        .insert({
          id: userId,
          email,
          full_name,
          phone: phone || null,
        })

      if (profileError) throw profileError

      // 6. Crear membresía (Owner) - ESTA ES LA QUE CAUSABA EL ERROR
      const { error: membershipError } = await supabaseAdmin
        .from('fact_memberships')
        .insert({
          user_id: userId,
          organization_id: orgData.id,
          role: 'owner',
        })

      if (membershipError) throw membershipError

      return NextResponse.json({
        success: true,
        message: 'Organización creada exitosamente',
        user: {
          id: userId,
          email,
        }
      })

    } catch (error: any) {
      // Si algo falla, eliminar el usuario de Auth
      console.error('Registration error, rolling back:', error)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      
      return NextResponse.json(
        { error: 'Error al crear la organización: ' + error.message },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}