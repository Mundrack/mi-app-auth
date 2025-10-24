import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('dim_positions')
      .select('*')
      .order('title')

    if (error) throw error

    return NextResponse.json({ 
      positions: data || [],
      success: true 
    })
  } catch (error: any) {
    console.error('Error fetching positions:', error)
    return NextResponse.json(
      { 
        error: 'Error al cargar posiciones',
        positions: [],
        success: false 
      },
      { status: 500 }
    )
  }
}