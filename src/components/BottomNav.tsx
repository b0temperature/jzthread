'use client'

import { useStore } from '@/store'
import { translations } from '@/i18n'

// 简洁线条 SVG 图标
const ThreadIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ResourceIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

const ProfileIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
)

export default function BottomNav() {
  const { activeTab, setActiveTab, user, language } = useStore()
  const t = translations[language]

  if (!user) return null

  const navItems = [
    { id: 'thread' as const, label: t.nav.thread, Icon: ThreadIcon },
    { id: 'resources' as const, label: t.nav.resources, Icon: ResourceIcon },
    { id: 'profile' as const, label: t.nav.profile, Icon: ProfileIcon },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-3">
      <div className="max-w-lg mx-auto flex justify-center">
        <div className="glass rounded-full px-3 py-1.5 flex gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-12 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-tertiary hover:text-secondary hover:bg-white/10'
                }`}
              >
                {/* 选中态内层高亮 */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 dark:bg-white/15 rounded-full" />
                )}
                <div className="relative z-10">
                  <item.Icon active={isActive} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  )
}
