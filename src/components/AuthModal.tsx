'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth'

interface AuthModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [studentId, setStudentId] = useState('')
  const [studentCardImage, setStudentCardImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        if (!username.trim()) {
          setError('请输入用户名')
          return
        }
        if (!phone.trim()) {
          setError('请输入手机号')
          return
        }
        if (!studentId.trim()) {
          setError('请输入学号')
          return
        }
        await signUp(email, password, username, phone, studentId, studentCardImage || undefined)
        alert('注册成功!请查收邮箱验证邮件,验证后即可登录')
        setMode('login')
      } else {
        await signIn(email, password)
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass rounded-3xl p-8 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {mode === 'login' ? '登录' : '注册'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  用户名 *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
                  placeholder="请输入用户名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  手机号 *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
                  placeholder="请输入手机号"
                  pattern="[0-9]{11}"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  学号 *
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
                  placeholder="请输入学号"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  学生证照片链接(可选)
                </label>
                <input
                  type="url"
                  value={studentCardImage}
                  onChange={(e) => setStudentCardImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
                  placeholder="请输入学生证图片URL"
                />
                <p className="text-xs text-gray-500 mt-1">可以上传到图床后粘贴链接,用于身份审核</p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              邮箱 *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
              placeholder="请输入邮箱"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              密码 *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-light border border-white/20 focus:border-purple-500 outline-none text-primary"
              placeholder="请输入密码"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-100 dark:bg-red-900/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            {mode === 'login' ? '没有账号? 立即注册' : '已有账号? 立即登录'}
          </button>
        </div>
      </div>
    </div>
  )
}
