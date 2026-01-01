'use client'

import { useEffect, useState } from 'react'
import { useStore, BACKGROUND_THEMES, BackgroundTheme } from '@/store'
import { getCurrentUser, AuthUser } from '@/lib/auth'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import ThreadView from '@/components/ThreadView'
import ResourcesView from '@/components/ResourcesView'
import ProfileView from '@/components/ProfileView'
import AuthModal from '@/components/AuthModal'

export default function Home() {
  const { activeTab, backgroundTheme, setBackgroundTheme } = useStore()
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [loading, setLoading] = useState(true)

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        setAuthUser(user)
        if (!user) {
          setShowAuthModal(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setShowAuthModal(true)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // 处理背景主题切换 + 自动设置深浅色模式
  useEffect(() => {
    const config = BACKGROUND_THEMES[backgroundTheme]
    const bg = document.getElementById('animated-bg')
    if (bg) {
      bg.style.setProperty('--bg-color', config.bg)
      bg.style.setProperty('--c1', config.c1)
      bg.style.setProperty('--c2', config.c2)
      bg.style.setProperty('--c3', config.c3)
      bg.style.setProperty('--c4', config.c4)
    }
    
    // 根据背景亮度自动切换深浅色模式
    const root = document.documentElement
    if (config.isLight) {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }, [backgroundTheme])

  // 渲染当前视图
  const renderView = () => {
    switch (activeTab) {
      case 'thread':
        return <ThreadView authUser={authUser} />
      case 'resources':
        return <ResourcesView />
      case 'profile':
        return <ProfileView authUser={authUser} />
      default:
        return <ThreadView authUser={authUser} />
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">加载中...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      {/* 未登录时显示设置按钮 */}
      {!authUser && !loading && (
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full glass flex items-center justify-center hover:scale-110 transition-all shadow-lg"
          title="设置"
        >
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}

      {/* 设置面板 */}
      {showThemeSelector && !authUser && (
        <div className="fixed top-20 right-4 z-50 glass rounded-2xl p-6 shadow-2xl fade-in w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary text-lg">设置</h3>
            <button
              onClick={() => setShowThemeSelector(false)}
              className="text-secondary hover:text-primary transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 背景主题 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-secondary mb-3">背景主题</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(BACKGROUND_THEMES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setBackgroundTheme(key as BackgroundTheme)}
                  className={`p-3 rounded-xl text-sm transition-all ${
                    backgroundTheme === key
                      ? 'ring-2 ring-purple-500'
                      : 'hover:bg-white/30 dark:hover:bg-white/10'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${config.c1}, ${config.c2})`,
                    color: 'white'
                  }}
                >
                  {config.nameZh}
                </button>
              ))}
            </div>
          </div>

          {/* 语言切换 */}
          <div>
            <div className="text-sm font-medium text-secondary mb-3">语言</div>
            <div className="flex gap-2">
              <button
                onClick={() => useStore.getState().setLanguage('zh')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
                  useStore.getState().language === 'zh'
                    ? 'glass-dark text-white'
                    : 'glass-light text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                🇨🇳 简体中文
              </button>
              <button
                onClick={() => useStore.getState().setLanguage('en')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
                  useStore.getState().language === 'en'
                    ? 'glass-dark text-white'
                    : 'glass-light text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                🇺🇸 English
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 未登录显示登录模态框 */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {}}
          onSuccess={() => {
            setShowAuthModal(false)
            window.location.reload()
          }}
        />
      )}

      {/* 已登录显示内容 */}
      {authUser && (
        <>
          <Header />
          
          <div className="max-w-lg mx-auto px-4 py-3">
            {renderView()}
          </div>

          <BottomNav />
        </>
      )}
    </main>
  )
}
