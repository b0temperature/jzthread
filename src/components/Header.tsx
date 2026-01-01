'use client'

import { useState } from 'react'
import { useStore, BACKGROUND_THEMES, BackgroundTheme } from '@/store'
import { translations } from '@/i18n'

export default function Header() {
  const { user, setUser, language, setLanguage, backgroundTheme, setBackgroundTheme } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNickname, setEditingNickname] = useState(false)
  const [newNickname, setNewNickname] = useState('')
  const t = translations[language]

  const bgThemes: BackgroundTheme[] = ['moonDesert', 'dawn', 'sunset', 'stone', 'dusk', 'light', 'mango', 'ice']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
  }

  const handleSaveNickname = () => {
    if (user && newNickname.trim()) {
      setUser({ ...user, nickname: newNickname.trim() })
      setEditingNickname(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-3">
      <div className="max-w-lg mx-auto">
        {/* 主导航栏 */}
        <div className="glass rounded-full px-2 py-1.5 flex items-center gap-2">
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'zh' ? '搜索...' : 'Search...'}
                className="w-full bg-white/10 rounded-full pl-9 pr-3 py-1.5 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:bg-white/15 transition-colors"
              />
            </div>
          </form>

          {/* 设置按钮 */}
          <button
            onClick={() => { setShowSettings(!showSettings); setShowProfile(false) }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              showSettings ? 'bg-white/20 text-primary' : 'hover:bg-white/10 text-secondary hover:text-primary'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* 用户头像按钮 */}
          {user && (
            <button
              onClick={() => { setShowProfile(!showProfile); setShowSettings(false) }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-transform ${
                showProfile ? 'scale-110 ring-2 ring-white/50' : ''
              }`}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              {user.nickname.charAt(0)}
            </button>
          )}
        </div>

        {/* 设置面板 - 等宽延伸 */}
        {showSettings && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
            <div className="mt-1 glass rounded-2xl p-3 z-50 relative">
              {/* 背景主题 */}
              <div className="mb-3">
                <div className="text-[11px] text-secondary mb-2 px-1">
                  {language === 'zh' ? '背景主题' : 'Background'}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {bgThemes.map((bg) => {
                    const config = BACKGROUND_THEMES[bg]
                    const isActive = backgroundTheme === bg
                    return (
                      <button
                        key={bg}
                        onClick={() => setBackgroundTheme(bg)}
                        className={`relative flex flex-col items-center transition-all ${
                          isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* 预览圆 */}
                        <div 
                          className={`w-12 h-12 rounded-full overflow-hidden ${
                            isActive ? 'ring-2 ring-white' : ''
                          }`}
                          style={{ background: config.bg }}
                        >
                          <div className="w-full h-full relative" style={{ filter: 'blur(6px)' }}>
                            <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-full" style={{ background: config.c1, opacity: 0.7 }} />
                            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-full" style={{ background: config.c2, opacity: 0.6 }} />
                            <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 rounded-full" style={{ background: config.c4, opacity: 0.5 }} />
                          </div>
                        </div>
                        {/* 名称标签 */}
                        <span className={`text-[10px] mt-1 ${isActive ? 'text-white font-medium' : 'text-white/60'}`}>
                          {language === 'zh' ? config.nameZh : config.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* 语言切换 */}
              <div className="flex items-center gap-2 px-1">
                <span className="text-[11px] text-secondary">{language === 'zh' ? '语言' : 'Lang'}</span>
                <div className="flex gap-1 flex-1">
                  {(['zh', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`flex-1 py-1 rounded-full text-[11px] transition-all ${
                        language === lang
                          ? 'bg-white/20 text-white font-medium'
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      {lang === 'zh' ? '中文' : 'EN'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 用户 Profile 面板 - 等宽延伸 */}
        {showProfile && user && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="mt-1 glass rounded-2xl p-3 z-50 relative">
              <div className="flex items-center gap-3">
                {/* 可点击更换的头像 */}
                <button 
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-medium relative group"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  title={language === 'zh' ? '更换头像' : 'Change avatar'}
                >
                  {user.nickname.charAt(0)}
                  <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                </button>
                
                <div className="flex-1">
                  {/* 昵称编辑 */}
                  {editingNickname ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        className="flex-1 bg-white/10 rounded-lg px-2 py-1 text-sm text-primary focus:outline-none focus:bg-white/15"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNickname()}
                      />
                      <button onClick={handleSaveNickname} className="text-green-400 text-xs">✓</button>
                      <button onClick={() => setEditingNickname(false)} className="text-red-400 text-xs">✕</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-medium">{user.nickname}</span>
                      <button 
                        onClick={() => { setNewNickname(user.nickname); setEditingNickname(true) }}
                        className="text-tertiary hover:text-secondary"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <div className="text-[11px] text-tertiary mt-0.5">
                    {user.role === 'student' ? (language === 'zh' ? '在校学生' : 'Student') :
                     user.role === 'teacher' ? (language === 'zh' ? '教师' : 'Teacher') :
                     user.role === 'alumni' ? (language === 'zh' ? '校友' : 'Alumni') :
                     (language === 'zh' ? '待审核' : 'Pending')}
                  </div>
                </div>
              </div>
              
              {/* 联系信息 */}
              <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-secondary flex flex-wrap gap-x-4 gap-y-1">
                {user.phone && <span>📞 {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>}
                {user.email && <span>✉️ {user.email}</span>}
                {user.studentId && <span>🎓 {user.studentId}</span>}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
