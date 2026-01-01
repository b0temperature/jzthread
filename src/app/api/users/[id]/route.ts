import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - 获取用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error

    return NextResponse.json({ user: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'User not found' },
      { status: 404 }
    )
  }
}

// PATCH - 更新用户信息
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { username, avatar, bio } = body

    const updates: any = {}
    if (username) updates.username = username
    if (avatar !== undefined) updates.avatar = avatar
    if (bio !== undefined) updates.bio = bio

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ user: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}
