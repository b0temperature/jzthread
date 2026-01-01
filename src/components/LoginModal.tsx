'use client'

import { useState, useRef } from 'react'
import { useStore, generateCredential, generateNickname, UserRole, ThemeMode, Language } from '@/store'
import { translations } from '@/i18n'

type Step = 'welcome' | 'existing' | 'register-info' | 'register-verify' | 'register-done' | 'pending'

export default function LoginModal({ onClose }: { onClose?: () => void }) {
  const { setUser, user, addPendingUser, theme, setTheme, language, setLanguage } = useStore()
  const t = translations[language]
  const [step, setStep] = useState<Step>('welcome')
  const [showSettings, setShowSettings] = useState(false)
  
  // 登录状态
  const [credential, setCredential] = useState('')
  const [loginError, setLoginError] = useState('')
  
  // 注册状态
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [studentId, setStudentId] = useState('')
  const [enrollYear, setEnrollYear] = useState(new Date().getFullYear())
  const [graduateYear, setGraduateYear] = useState<number | undefined>()
  
  // 验证图片
  const [images, setImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 生成的凭证
  const [newCredential, setNewCredential] = useState('')
  const [nickname, setNickname] = useState('')
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError(language === 'zh' ? '图片大小不能超过5MB' : 'Image size cannot exceed 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  // 删除图片
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // 复制凭证
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newCredential)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = newCredential
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 开始注册流程
  const handleStartRegister = () => {
    setStep('register-info')
  }

  // 提交基本信息，进入验证步骤
  const handleSubmitInfo = () => {
    if (!phone || phone.length !== 11) {
      setError(t.error.phoneInvalid)
      return
    }
    if ((role === 'student' || role === 'alumni') && !studentId) {
      setError(t.error.studentIdRequired)
      return
    }
    setError('')
    setStep('register-verify')
  }

  // 提交验证材料
  const handleSubmitVerify = () => {
    if (images.length === 0) {
      setError(t.error.imageRequired)
      return
    }
    
    // 生成凭证
    const cred = generateCredential()
    const nick = generateNickname()
    setNewCredential(cred)
    setNickname(nick)
    
    // 创建待审核用户
    const newUser = {
      credential: cred,
      nickname: nick,
      phone,
      email: email || undefined,
      studentId: studentId || undefined,
      role,
      enrollYear: role === 'student' ? enrollYear : undefined,
      graduateYear: role === 'alumni' ? graduateYear : undefined,
      verifyStatus: 'pending' as const,
      pendingImages: images, // 待审核图片
      createdAt: Date.now(),
    }
    
    addPendingUser(newUser)
    setStep('register-done')
  }

  // 确认注册完成
  const handleConfirmRegister = () => {
    if (!confirmed) {
      setError(t.error.confirmRequired)
      return
    }
    
    // 设置用户（待验证状态）
    setUser({
      credential: newCredential,
      nickname,
      phone,
      email: email || undefined,
      studentId: studentId || undefined,
      role: 'pending',
      enrollYear: role === 'student' ? enrollYear : undefined,
      graduateYear: role === 'alumni' ? graduateYear : undefined,
      verifyStatus: 'pending',
      createdAt: Date.now(),
    })
    onClose?.()
  }

  // 使用凭证登录
  const handleLogin = () => {
    const formatted = credential.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (formatted.length !== 16) {
      setLoginError(t.error.credentialInvalid)
      return
    }
    
    // TODO: 实际应该从服务器验证
    setUser({
      credential: formatted.match(/.{1,4}/g)?.join('-') || formatted,
      nickname: generateNickname(),
      phone: '',
      role: 'pending',
      verifyStatus: 'pending',
      createdAt: Date.now(),
    })
    onClose?.()
  }

  // 设置面板
  const SettingsPanel = () => (
    <div className="absolute top-0 left-0 right-0 bottom-0 glass rounded-3xl p-6 z-10 fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary">{t.profile.settings}</h3>
        <button 
          onClick={() => setShowSettings(false)}
          className="text-secondary hover:text-primary transition-colors text-sm"
        >
          {t.auth.back}
        </button>
      </div>
      
      {/* 主题 */}
      <div className="mb-5">
        <div className="text-sm text-secondary mb-2">{t.profile.theme}</div>
        <div className="flex gap-2">
          {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all ${
                theme === mode
                  ? 'glass-active text-primary font-medium'
                  : 'glass-light text-secondary hover:text-primary'
              }`}
            >
              {mode === 'light' ? t.profile.light : mode === 'dark' ? t.profile.dark : t.profile.system}
            </button>
          ))}
        </div>
      </div>
      
      {/* 语言 */}
      <div>
        <div className="text-sm text-secondary mb-2">{t.profile.language}</div>
        <div className="flex gap-2">
          {(['zh', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all ${
                language === lang
                  ? 'glass-active text-primary font-medium'
                  : 'glass-light text-secondary hover:text-primary'
              }`}
            >
              {lang === 'zh' ? '中文' : 'English'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (user && !onClose) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="glass relative w-full max-w-md rounded-3xl p-8 slide-up max-h-[90vh] overflow-y-auto">
        
        {/* 设置按钮 - 右上角 */}
        {step === 'welcome' && !showSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-6 right-6 text-sm text-secondary hover:text-primary transition-colors"
          >
            {t.profile.settings}
          </button>
        )}
        
        {/* 设置面板 */}
        {showSettings && <SettingsPanel />}
        
        {/* 欢迎页 */}
        {step === 'welcome' && !showSettings && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">{t.app.name}</h1>
              <p className="text-secondary text-sm">{t.app.subtitle}</p>
            </div>
            
            <div className="glass-light rounded-2xl p-5 mb-6">
              <h3 className="font-medium text-primary mb-3">
                {t.school.title}
              </h3>
              <ul className="text-sm text-secondary space-y-2">
                {t.school.features.map((feature, i) => (
                  <li key={i}>• {feature}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button 
                onClick={handleStartRegister}
                className="btn-primary w-full py-4 text-base"
              >
                {t.auth.register}
              </button>
              <button 
                onClick={() => setStep('existing')}
                className="btn-secondary w-full py-3"
              >
                {t.auth.login}
              </button>
            </div>
          </>
        )}

        {/* 输入凭证登录 */}
        {step === 'existing' && (
          <>
            <button 
              onClick={() => setStep('welcome')}
              className="absolute top-6 left-6 text-secondary hover:text-primary transition-colors text-sm"
            >
              ← {t.auth.back}
            </button>
            
            <div className="text-center mb-6 mt-4">
              <h2 className="text-2xl font-bold text-primary mb-2">{t.auth.welcome}</h2>
              <p className="text-sm text-secondary">{t.auth.enterCredential}</p>
            </div>

            <div className="mb-6">
              <input
                type="text"
                value={credential}
                onChange={(e) => {
                  setCredential(e.target.value)
                  setLoginError('')
                }}
                className="input-glass text-center font-mono text-lg tracking-wider"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                maxLength={19}
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center mb-4">{loginError}</p>
            )}

            <button 
              onClick={handleLogin}
              className="btn-primary w-full py-4"
            >
              {t.auth.enter}
            </button>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-secondary">
                {t.auth.forgotCredential}
              </p>
            </div>
          </>
        )}

        {/* 注册 - 基本信息 */}
        {step === 'register-info' && (
          <>
            <button 
              onClick={() => setStep('welcome')}
              className="absolute top-6 left-6 text-secondary hover:text-primary transition-colors text-sm"
            >
              ← {t.auth.back}
            </button>
            
            <div className="text-center mb-6 mt-4">
              <h2 className="text-2xl font-bold text-primary mb-2">{t.auth.fillInfo}</h2>
              <p className="text-sm text-secondary">{t.auth.infoTip}</p>
            </div>

            {/* 身份选择 */}
            <div className="mb-4">
              <label className="block text-sm text-secondary mb-2">{t.auth.iAm}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'student', label: t.role.student },
                  { value: 'teacher', label: t.role.teacher },
                  { value: 'alumni', label: t.role.alumni },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setRole(item.value as UserRole)}
                    className={`py-3 rounded-xl text-sm font-medium transition-all ${
                      role === item.value
                        ? 'btn-primary'
                        : 'glass-light text-secondary hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 手机号 */}
            <div className="mb-4">
              <label className="block text-sm text-secondary mb-2">
                {t.auth.phone} <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="input-glass"
                placeholder={t.auth.phonePlaceholder}
              />
            </div>

            {/* 邮箱 */}
            <div className="mb-4">
              <label className="block text-sm text-secondary mb-2">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                placeholder={t.auth.emailPlaceholder}
              />
            </div>

            {/* 学号 - 学生/校友 */}
            {(role === 'student' || role === 'alumni') && (
              <div className="mb-4">
                <label className="block text-sm text-secondary mb-2">
                  {t.auth.studentId} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="input-glass"
                  placeholder={t.auth.studentIdPlaceholder}
                />
              </div>
            )}

            {/* 入学年份 - 学生 */}
            {role === 'student' && (
              <div className="mb-4">
                <label className="block text-sm text-secondary mb-2">{t.auth.enrollYear}</label>
                <select
                  value={enrollYear}
                  onChange={(e) => setEnrollYear(Number(e.target.value))}
                  className="input-glass"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}{language === 'zh' ? '级' : ''}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 毕业年份 - 校友 */}
            {role === 'alumni' && (
              <div className="mb-4">
                <label className="block text-sm text-secondary mb-2">{t.auth.graduateYear}</label>
                <select
                  value={graduateYear || new Date().getFullYear()}
                  onChange={(e) => setGraduateYear(Number(e.target.value))}
                  className="input-glass"
                >
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}{language === 'zh' ? '届' : ''}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button 
              onClick={handleSubmitInfo}
              className="btn-primary w-full py-4"
            >
              {t.auth.next}
            </button>
          </>
        )}

        {/* 注册 - 上传验证图片 */}
        {step === 'register-verify' && (
          <>
            <button 
              onClick={() => setStep('register-info')}
              className="absolute top-6 left-6 text-secondary hover:text-primary transition-colors text-sm"
            >
              ← {t.auth.back}
            </button>
            
            <div className="text-center mb-6 mt-4">
              <h2 className="text-2xl font-bold text-primary mb-2">{t.auth.verify}</h2>
              <p className="text-sm text-secondary">{t.auth.verifyTip}</p>
            </div>

            <div className="glass-light rounded-2xl p-4 mb-4">
              <ul className="text-sm text-secondary space-y-2">
                {t.auth.verifyItems.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <p className="text-xs text-tertiary mt-3">
                * {t.auth.verifyNote}
              </p>
            </div>

            {/* 图片上传区域 */}
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 glass-light rounded-2xl hover:glass-active transition-all"
              >
                <div className="text-center">
                  <p className="text-sm text-secondary">{t.auth.uploadImage}</p>
                </div>
              </button>
            </div>

            {/* 已上传图片预览 */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-20 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button 
              onClick={handleSubmitVerify}
              className="btn-primary w-full py-4"
            >
              {t.auth.submit}
            </button>
          </>
        )}

        {/* 注册完成 - 显示凭证 */}
        {step === 'register-done' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">{t.auth.success}</h2>
              <p className="text-sm text-secondary">{t.auth.saveCredential}</p>
            </div>

            <div className="glass-light rounded-2xl p-6 mb-4">
              <div className="text-center">
                <div className="text-xs text-secondary mb-2">{t.auth.yourCredential}</div>
                <div className="font-mono text-2xl font-bold tracking-wider text-primary mb-4">
                  {newCredential}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`btn-secondary px-6 py-2 ${copied ? 'text-green-600' : ''}`}
                >
                  {copied ? t.auth.copied : t.auth.copy}
                </button>
              </div>
            </div>

            <div className="glass-light rounded-xl p-4 mb-4 border-l-2 border-amber-400">
              <p className="text-secondary text-sm">
                <strong>{t.auth.important}</strong>{t.auth.importantTip}
              </p>
            </div>

            <div className="glass-light rounded-xl p-4 mb-4">
              <p className="text-sm text-secondary">
                <strong>{t.auth.reviewNote}</strong><br />
                {t.auth.reviewTip}
                <span className="text-purple-500 dark:text-purple-400 font-medium"> {t.auth.imageDelete}</span>
              </p>
            </div>

            <label className="flex items-center space-x-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => {
                  setConfirmed(e.target.checked)
                  setError('')
                }}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-secondary">{t.auth.confirm}</span>
            </label>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button 
              onClick={handleConfirmRegister}
              className={`btn-primary w-full py-4 ${!confirmed ? 'opacity-60' : ''}`}
            >
              {t.auth.start}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
