import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, phone, requests } = body

    if (!email || !full_name || !requests || requests.length === 0) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // 1. Crear usuario temporal
    const { data: userData, error: userError } = await supabaseAdmin
      .from('dim_users')
      .insert({
        email,
        full_name,
        phone: phone || null,
        is_active: false,
      })
      .select()
      .single()

    if (userError) throw userError

    // 2. Crear solicitudes
    const joinRequests = requests.map((r: any) => ({
      user_id: userData.id,
      organization_id: r.organization_id,
      position_id: r.position_id,
      message: r.message || null,
      status: 'pending'
    }))

    const { error: requestsError } = await supabaseAdmin
      .from('fact_join_requests')
      .insert(joinRequests)

    if (requestsError) {
      await supabaseAdmin.from('dim_users').delete().eq('id', userData.id)
      throw requestsError
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitudes enviadas',
      user_id: userData.id
    })

  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}