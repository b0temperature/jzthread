import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - 获取所有帖子
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('posts')
      .select(`
        *,
        users (
          id,
          username,
          avatar
        ),
        likes (
          user_id
        )
      `)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (tag) {
      query = query.eq('tag', tag)
    }

    const { data, error } = await query

    if (error) throw error

    // 处理返回数据，添加 likedBy 数组
    const postsWithLikes = data?.map(post => ({
      ...post,
      likedBy: post.likes?.map((like: any) => like.user_id) || []
    })) || []

    return NextResponse.json({ posts: postsWithLikes })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// POST - 创建新帖子
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, content, tag } = body

    if (!user_id || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ user_id, title, content, tag }])
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

    return NextResponse.json({ post: data }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    )
  }
}
