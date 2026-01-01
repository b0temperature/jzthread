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
      {/* 全局主题切换按钮 - 固定在右上角 */}
      <button
        onClick={() => setShowThemeSelector(!showThemeSelector)}
        className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl hover:scale-110 transition-transform shadow-lg"
        title="切换背景主题"
      >
        🎨
      </button>

      {/* 主题选择器 */}
      {showThemeSelector && (
        <div className="fixed top-20 right-4 z-50 glass rounded-2xl p-4 shadow-2xl fade-in">
          <div className="text-sm font-medium text-primary mb-3">选择背景主题</div>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            {Object.entries(BACKGROUND_THEMES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setBackgroundTheme(key as BackgroundTheme)
                  setShowThemeSelector(false)
                }}
                className={`p-3 rounded-xl text-sm transition-all ${
                  backgroundTheme === key
                    ? 'glass-dark text-white ring-2 ring-white/50'
                    : 'glass-light text-secondary hover:bg-white/30 dark:hover:bg-white/10'
                }`}
                style={{
                  background: backgroundTheme === key 
                    ? `linear-gradient(135deg, ${config.c1}, ${config.c2})`
                    : undefined
                }}
              >
                <div className="text-xs font-medium">{config.nameZh}</div>
              </button>
            ))}
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
