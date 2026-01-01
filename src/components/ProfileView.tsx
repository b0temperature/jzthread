'use client'

import { useStore, ThemeMode, Language } from '@/store'
import { translations } from '@/i18n'
import { AuthUser, signOut } from '@/lib/auth'

interface ProfileViewProps {
  authUser: AuthUser | null
}

export default function ProfileView({ authUser }: ProfileViewProps) {
  const { 
    theme, setTheme, 
    language, setLanguage 
  } = useStore()
  const t = translations[language]

  if (!authUser) return null

  const handleLogout = async () => {
    if (confirm('确定要退出登录吗?')) {
      await signOut()
      window.location.reload()
    }
  }

  // 主题选项
  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: t.profile.lightMode, icon: '☀️' },
    { value: 'dark', label: t.profile.darkMode, icon: '🌙' },
    { value: 'system', label: t.profile.systemMode, icon: '💻' },
  ]

  // 语言选项
  const languageOptions: { value: Language; label: string; flag: string }[] = [
    { value: 'zh', label: '简体中文', flag: '🇨🇳' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ]

  return (
    <div className="space-y-4 fade-in">
      {/* 个人信息卡 */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center mb-6">
          <img
            src={authUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.username}`}
            alt={authUser.username}
            className="w-16 h-16 rounded-full"
          />
          <div className="ml-4 flex-1">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{authUser.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{authUser.email}</p>
            {authUser.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{authUser.bio}</p>
            )}
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
            <strong>💬 {t.about.beKind}</strong><br />
            {t.about.beKindDesc}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10">
          <div className="text-center text-xs text-gray-400">
            {t.app.name} v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}
