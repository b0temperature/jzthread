import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - 获取单个帖子详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          avatar,
          bio
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) throw error

    // 增加浏览量
    await supabase
      .from('posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', params.id)

    return NextResponse.json({ post: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Post not found' },
      { status: 404 }
    )
  }
}

// DELETE - 删除帖子
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    )
  }
}
