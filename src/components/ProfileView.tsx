'use client'

import { useState } from 'react'
import { useStore, ThemeMode, Language } from '@/store'
import { translations } from '@/i18n'

export default function ProfileView() {
  const { 
    user, setUser, updateUser, posts, 
    theme, setTheme, 
    language, setLanguage 
  } = useStore()
  const t = translations[language]
  const [showEditModal, setShowEditModal] = useState(false)
  const [editNickname, setEditNickname] = useState('')

  if (!user) return null

  const userPosts = posts.filter((p) => p.authorId === user.credential)
  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0)

  const handleLogout = () => {
    if (confirm(language === 'zh' 
      ? '确定要退出吗？请确保你已保存好凭证，否则将无法找回账号。'
      : 'Are you sure you want to logout? Make sure you have saved your credential.'
    )) {
      setUser(null)
    }
  }

  // 获取验证状态显示
  const getVerifyStatusDisplay = () => {
    if (user.verifyStatus === 'verified') {
      return { text: t.status.verified, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
    } else if (user.verifyStatus === 'rejected') {
      return { text: t.status.rejected, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    }
    return { text: t.status.pending, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' }
  }

  const verifyStatus = getVerifyStatusDisplay()

  // 主题选项
  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: t.profile.lightMode, icon: '☀️' },
    { value: 'dark', label: t.profile.darkMode, icon: '🌙' },
    { value: 'system', label: t.profile.systemMode, icon: '💻' },
  ]

  // 语言选项
  const languageOptions: { value: Language; label: string; flag: string }[] = [
    { value: 'zh', label: '中文', flag: '🇨🇳' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ]

  return (
    <div className="fade-in space-y-4">
      {/* 待审核提示 */}
      {user.verifyStatus === 'pending' && (
        <div className="glass-light rounded-2xl p-4 border-l-4 border-amber-400">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⏳</span>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{t.profile.pendingReview}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.profile.pendingReviewDesc}</p>
            </div>
          </div>
        </div>
      )}

      {/* 个人信息卡 */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
            }}
          >
            {user.nickname.charAt(0)}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.nickname}</h2>
              <button
                onClick={() => {
                  setEditNickname(user.nickname)
                  setShowEditModal(true)
                }}
                className="text-secondary hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                user.role === 'teacher' 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : user.role === 'alumni'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : user.role === 'pending'
                  ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {t.role[user.role]}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${verifyStatus.color}`}>
                {verifyStatus.text}
              </span>
            </div>
          </div>
        </div>

        {/* 身份信息 */}
        <div className="glass-light rounded-xl p-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {user.studentId && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.profile.studentId}：</span>
                <span className="text-gray-700 dark:text-gray-300">{user.studentId}</span>
              </div>
            )}
            {user.enrollYear && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.profile.enrollYear}：</span>
                <span className="text-gray-700 dark:text-gray-300">{user.enrollYear}{language === 'zh' ? '级' : ''}</span>
              </div>
            )}
            {user.graduateYear && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t.profile.graduateYear}：</span>
                <span className="text-gray-700 dark:text-gray-300">{user.graduateYear}{language === 'zh' ? '届' : ''}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t.profile.phone}：</span>
              <span className="text-gray-700 dark:text-gray-300">
                {user.phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') || t.profile.notBound}
              </span>
            </div>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-light rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{userPosts.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.profile.posts}</div>
          </div>
          <div className="glass-light rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">{totalLikes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.profile.likes}</div>
          </div>
          <div className="glass-light rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {userPosts.reduce((sum, p) => sum + p.comments.length, 0)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{t.profile.comments}</div>
          </div>
        </div>
      </div>

      {/* 设置 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t.profile.settings}</h3>
        
        {/* 主题设置 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.profile.theme}</div>
          <div className="flex gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
                  theme === option.value
                    ? 'glass-dark text-white'
                    : 'glass-light text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 语言设置 */}
        <div className="mb-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t.profile.language}</div>
          <div className="flex gap-2">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLanguage(option.value)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm transition-all ${
                  language === option.value
                    ? 'glass-dark text-white'
                    : 'glass-light text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                <span className="mr-1">{option.flag}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 凭证 */}
        <div className="glass-light rounded-xl p-4 mb-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.profile.yourCredential}</div>
          <div className="font-mono text-lg text-center text-gray-800 dark:text-white tracking-wider">
            {user.credential}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl text-red-500 dark:text-red-400 glass-light hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium"
        >
          {t.profile.logout}
        </button>
      </div>

      {/* 关于 */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t.about.title}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
          <p>
            <strong>🔒 {t.about.anonymous}</strong><br />
            {t.about.anonymousDesc}
          </p>
          <p>
            <strong>⚠️ {t.about.saveCredential}</strong><br />
            {t.about.saveCredentialDesc}
          </p>
          <p>
            <strong>💬 {t.about.beKind}</strong><br />
            {t.about.beKindDesc}
          </p>
        </div>
        <div className="divider" />
        <div className="text-center text-xs text-gray-400">
          {t.app.name} v0.1.0 · {t.app.subtitle}
        </div>
      </div>

      {/* 编辑昵称弹窗 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-primary mb-4">
              {language === 'zh' ? '编辑昵称' : 'Edit Nickname'}
            </h3>
            <input
              type="text"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              className="input-glass w-full mb-4"
              placeholder={language === 'zh' ? '输入新昵称' : 'Enter new nickname'}
              maxLength={20}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 btn-glass py-2"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (editNickname.trim()) {
                    updateUser({ nickname: editNickname.trim() })
                    setShowEditModal(false)
                  }
                }}
                disabled={!editNickname.trim()}
                className="flex-1 btn-primary py-2 disabled:opacity-50"
              >
                {language === 'zh' ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
