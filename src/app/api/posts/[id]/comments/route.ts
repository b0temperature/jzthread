import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - 获取帖子的所有评论
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users (
          id,
          username,
          avatar
        )
      `)
      .eq('post_id', params.id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ comments: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST - 添加评论
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { user_id, content } = body

    if (!user_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: params.id, user_id, content }])
      .select(`
        *,
        users (
          id,
          username,
          avatar
        )
      `)
      .single()

    if (error) throw error

    // 更新帖子的评论数
    const { data: post } = await supabase
      .from('posts')
      .select('comments_count')
      .eq('id', params.id)
      .single()

    if (post) {
      await supabase
        .from('posts')
        .update({ comments_count: (post.comments_count || 0) + 1 })
        .eq('id', params.id)
    }

    return NextResponse.json({ comment: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create comment' },
      { status: 500 }
    )
  }
}
