import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  username: string
  avatar?: string
  bio?: string
}

// 注册新用户
export async function signUp(email: string, password: string, username: string) {
  // 1. 在 Supabase Auth 创建账号
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) throw authError
  if (!authData.user) throw new Error('注册失败')

  // 2. 在 users 表创建用户资料
  const { error: profileError } = await supabase
    .from('users')
    .insert([{
      id: authData.user.id,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    }])

  if (profileError) throw profileError

  return authData.user
}

// 登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data.user
}

// 登出
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 获取当前用户
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // 从 users 表获取完整资料
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    avatar: profile.avatar,
    bio: profile.bio,
  }
}

// 更新用户资料
export async function updateProfile(userId: string, updates: { username?: string; avatar?: string; bio?: string }) {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}
