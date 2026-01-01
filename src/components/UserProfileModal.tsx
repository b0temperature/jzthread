'use client'

import { useMemo } from 'react'
import { useStore } from '@/store'
import { translations } from '@/i18n'
import { formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'

interface UserProfileModalProps {
  authorId: string
  authorName: string
  onClose: () => void
}

export default function UserProfileModal({ authorId, authorName, onClose }: UserProfileModalProps) {
  const { posts, language } = useStore()
  const t = translations[language]

  // 获取该用户的所有帖子
  const userPosts = useMemo(() => {
    return posts
      .filter((p) => p.authorId === authorId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [posts, authorId])

  const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0)

  // 生成基于名字的渐变色
  const getGradient = (name: string) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    ]
    const index = name.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* 头部 */}
        <div className="p-6 border-b border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: getGradient(authorName) }}
              >
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-primary">{authorName}</h2>
                <div className="flex gap-4 mt-1 text-sm text-secondary">
                  <span>{userPosts.length} {t.profile.posts}</span>
                  <span>{totalLikes} {t.profile.likes}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all"
            >
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 帖子列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary">
                {language === 'zh' ? '这位用户还没有发布任何串文' : 'This user has no posts yet'}
              </p>
            </div>
          ) : (
            userPosts.map((post) => (
              <div key={post.id} className="glass-light rounded-xl p-4">
                {/* 内容 */}
                <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* 标签 */}
                {post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags.map((tagKey) => (
                      <span key={tagKey} className="text-xs text-purple-500 dark:text-purple-400">
                        #{t.tags[tagKey as keyof typeof t.tags] || tagKey}
                      </span>
                    ))}
                  </div>
                )}

                {/* 底部信息 */}
                <div className="mt-3 flex items-center justify-between text-xs text-secondary">
                  <span>
                    {formatDistanceToNow(post.createdAt, {
                      addSuffix: true,
                      locale: language === 'zh' ? zhCN : enUS
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                      </svg>
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
