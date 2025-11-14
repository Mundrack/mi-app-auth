import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que sea super admin
    const { data: userData } = await supabaseAdmin
      .from('dim_users')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_super_admin) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    // Obtener organizaciones con detalles
    const { data: organizations, error } = await supabaseAdmin
      .from('dim_organizations')
      .select(`
        *,
        dim_organization_details(*),
        dim_industries(name),
        dim_locations(city, country),
        fact_memberships(count)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Contar miembros por organización
    const orgsWithCounts = await Promise.all(
      (organizations || []).map(async (org) => {
        const { count: memberCount } = await supabaseAdmin
          .from('fact_memberships')
          .select('*', { count: 'exact', head: true })
          .eq('organization_id', org.id)

        return {
          ...org,
          member_count: memberCount || 0
        }
      })
    )

    return NextResponse.json({ organizations: orgsWithCounts })

  } catch (error: any) {
    console.error('Error getting organizations:', error)
    return NextResponse.json(
      { error: 'Error al obtener organizaciones' },
      { status: 500 }
    )
  }
}