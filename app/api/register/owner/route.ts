import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

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

    if (!email || !password || !full_name || !organization_name) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // 1. Crear usuario en Auth
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
      // 2. Crear organización
      const slug = organization_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const { data: orgData, error: orgError } = await supabaseAdmin
        .from('dim_organizations')
        .insert({
          name: organization_name,
          slug: slug,
          is_active: true,
        })
        .select()
        .single()

      if (orgError) {
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw orgError
      }

      // 3. Crear ubicación (si se proporcionó)
      let locationId = null
      if (city && country) {
        const { data: locationData, error: locationError } = await supabaseAdmin
          .from('dim_locations')
          .insert({
            city,
            country,
          })
          .select()
          .single()

        if (!locationError && locationData) {
          locationId = locationData.id
        }
      }

      // 4. Crear detalles de organización
      const { error: detailsError } = await supabaseAdmin
        .from('dim_organization_details')
        .insert({
          organization_id: orgData.id,
          industry_id: industry_id || null,
          location_id: locationId,
          size: size || null,
          website: website || null,
          description: description || null,
        })

      if (detailsError) {
        console.error('Error creating org details:', detailsError)
      }

      // 5. Crear perfil de usuario
      const { error: profileError } = await supabaseAdmin
        .from('dim_users')
        .insert({
          id: userId,
          email,
          full_name,
          phone: phone || null,
          is_active: true,
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw profileError
      }

      // 6. Crear membresía (Owner)
      const { error: membershipError } = await supabaseAdmin
        .from('fact_memberships')
        .insert({
          user_id: userId,
          organization_id: orgData.id,
          role: 'owner',
        })

      if (membershipError) {
        console.error('Error creating membership:', membershipError)
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw membershipError
      }

      return NextResponse.json({
        success: true,
        message: 'Organización creada exitosamente',
        user_id: userId,
        organization_id: orgData.id
      })

    } catch (error: any) {
      // Rollback: eliminar usuario de auth
      await supabaseAdmin.auth.admin.deleteUser(userId)
      throw error
    }

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Error al crear organización: ' + error.message },
      { status: 500 }
    )
  }
}