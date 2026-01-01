import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  tag?: string
  views: number
  likes: number
  comments_count: number
  created_at: string
  updated_at: string
  users?: User
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  likes: number
  created_at: string
  users?: User
}

export interface Like {
  id: string
  user_id: string
  post_id: string
  created_at: string
}
