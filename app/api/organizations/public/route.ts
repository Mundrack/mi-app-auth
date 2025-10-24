import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('dim_organizations')
      .select('id, name, slug, logo_url, is_active')
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    return NextResponse.json({ 
      organizations: data || [],
      success: true 
    })
  } catch (error: any) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { 
        error: 'Error al cargar organizaciones',
        organizations: [],
        success: false 
      },
      { status: 500 }
    )
  }
}