'use client'

import { useEffect } from 'react'
import { useStore, BACKGROUND_THEMES } from '@/store'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import ThreadView from '@/components/ThreadView'
import ResourcesView from '@/components/ResourcesView'
import ProfileView from '@/components/ProfileView'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  const { user, activeTab, backgroundTheme } = useStore()

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
        return <ThreadView />
      case 'resources':
        return <ResourcesView />
      case 'profile':
        return <ProfileView />
      default:
        return <ThreadView />
    }
  }

  return (
    <main className="min-h-screen pb-20">
      {/* 未登录显示登录模态框 */}
      {!user && <LoginModal />}

      {/* 已登录显示内容 */}
      {user && (
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
