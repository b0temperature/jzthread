'use client'

import { useState, useRef } from 'react'
import { useStore } from '@/store'
import { translations } from '@/i18n'
import { nanoid } from 'nanoid'

// 常用表情列表
const EMOJI_LIST = ['😀', '😂', '🥲', '😊', '😍', '🤔', '😭', '😱', '🥺', '👍', '👎', '❤️', '🔥', '💯', '🎉', '✨', '😴', '🤡', '💀', '🙏']

export default function ComposeBox() {
  const { user, addPost, language } = useStore()
  const t = translations[language]
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 使用翻译的标签
  const popularTags = Object.keys(t.tags)

  const handleSubmit = async () => {
    if (!content.trim() || !user) return

    try {
      // 调用 API 创建帖子
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: '71475011-7e63-4305-b357-005a093ad133', // 张三的 ID (临时写死,后续需要用户认证)
          title: content.trim().split('\n')[0].slice(0, 50), // 使用第一行作为标题
          content: content.trim(),
          tag: selectedTags[0] || null, // 使用第一个标签
        }),
      })

      if (response.ok) {
        // 成功后清空表单并刷新页面
        setContent('')
        setSelectedTags([])
        setIsExpanded(false)
        window.location.reload() // 简单刷新页面重新获取数据
      } else {
        alert('发布失败,请重试')
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('发布失败,请重试')
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + emoji + content.substring(end)
      setContent(newContent)
      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    } else {
      setContent(content + emoji)
    }
    setShowEmojiPicker(false)
  }

  if (!user) return null

  return (
    <div className="glass rounded-2xl p-4 mb-6 transition-all duration-300">
      <div className="flex items-start">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          }}
        >
          {user.nickname.charAt(0)}
        </div>
        <div className="ml-3 flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={t.thread.placeholder}
            className="w-full bg-transparent border-none outline-none resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] leading-relaxed"
            rows={isExpanded ? 4 : 2}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="fade-in">
          {/* 标签选择 */}
          <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.thread.selectTags}</div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tagKey) => (
                <button
                  key={tagKey}
                  onClick={() => toggleTag(tagKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.includes(tagKey)
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                      : 'glass-light text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10'
                  }`}
                >
                  #{t.tags[tagKey as keyof typeof t.tags]}
                </button>
              ))}
            </div>
          </div>

          {/* 操作栏 */}
          <div className="mt-4 flex items-center justify-between">
            {/* 左侧工具按钮 */}
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-secondary transition-all text-sm"
              >
                😊
              </button>
              {/* 表情选择器 */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 glass rounded-xl p-3 shadow-lg z-10">
                  <div className="grid grid-cols-5 gap-2 w-[200px]">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:bg-white/30 dark:hover:bg-white/10 rounded p-1 transition-all"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* 右侧发布按钮 */}
            <div className="flex items-center space-x-3">
              <span className={`text-xs ${content.length > 500 ? 'text-red-500' : 'text-secondary'}`}>
                {content.length}/500
              </span>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 500}
                className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.thread.publish}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
