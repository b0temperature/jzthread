import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - 点赞/取消点赞帖子
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    // 检查是否已点赞
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', params.id)
      .eq('user_id', user_id)
      .single()

    if (existingLike) {
      // 取消点赞
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', params.id)
        .eq('user_id', user_id)

      // 减少帖子点赞数
      const { data: post } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', params.id)
        .single()

      const newLikes = Math.max((post?.likes || 0) - 1, 0)
      if (post) {
        await supabase
          .from('posts')
          .update({ likes: newLikes })
          .eq('id', params.id)
      }

      return NextResponse.json({ liked: false, likes: newLikes })
    } else {
      // 添加点赞
      await supabase
        .from('likes')
        .insert([{ post_id: params.id, user_id }])

      // 增加帖子点赞数
      const { data: post } = await supabase
        .from('posts')
        .select('likes')
        .eq('id', params.id)
        .single()

      const newLikes = (post?.likes || 0) + 1
      if (post) {
        await supabase
          .from('posts')
          .update({ likes: newLikes })
          .eq('id', params.id)
      }

      return NextResponse.json({ liked: true, likes: newLikes })
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

// GET - 检查用户是否已点赞
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'Missing user_id' },
        { status: 400 }
      )
    }

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', params.id)
      .eq('user_id', user_id)
      .single()

    return NextResponse.json({ liked: !!data })
  } catch (error: any) {
    return NextResponse.json({ liked: false })
  }
}
