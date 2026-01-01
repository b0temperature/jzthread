'use client'

import { formatDistanceToNow } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { Post, useStore } from '@/store'
import { translations } from '@/i18n'
import { useState } from 'react'

interface PostCardProps {
  post: Post
  onComment?: () => void
  onAuthorClick?: (authorId: string, authorName: string) => void
}

export default function PostCard({ post, onComment, onAuthorClick }: PostCardProps) {
  const { user, likePost, language } = useStore()
  const t = translations[language]
  const [showComments, setShowComments] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [localLikes, setLocalLikes] = useState(post.likes)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localComments, setLocalComments] = useState(post.comments)
  
  const hasLiked = user ? post.likedBy.includes(user.credential) : false
  const timeAgo = formatDistanceToNow(post.createdAt, { 
    addSuffix: true, 
    locale: language === 'zh' ? zhCN : enUS
  })

  const handleLike = async () => {
    if (!user || isLiking) return
    
    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.credential })
      })
      
      if (response.ok) {
        const data = await response.json()
        // 更新本地点赞数
        setLocalLikes(prev => data.liked ? prev + 1 : Math.max(prev - 1, 0))
        // 同时更新 store (用于 hasLiked 状态)
        likePost(post.id, user.credential)
      }
    } catch (error) {
      console.error('Like failed:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user || !commentText.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.credential,
          content: commentText.trim()
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        // 添加新评论到本地列表
        setLocalComments(prev => [...prev, {
          id: data.comment.id,
          content: commentText.trim(),
          authorName: user.username,
          createdAt: new Date()
        }])
        setCommentText('')
      }
    } catch (error) {
      console.error('Comment submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
    }
  }

  // 获取头像字母
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

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
    <div className="glass card fade-in">
      {/* 头部 */}
      <div className="flex items-center mb-4">
        <button 
          onClick={() => onAuthorClick?.(post.authorId, post.authorName)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:scale-105 transition-transform"
          style={{ background: getGradient(post.authorName) }}
        >
          {getInitial(post.authorName)}
        </button>
        <div className="ml-3 flex-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onAuthorClick?.(post.authorId, post.authorName)}
              className="font-medium text-gray-800 dark:text-gray-100 hover:underline"
            >
              {post.authorName}
            </button>
            {post.authorRole && post.authorRole !== 'pending' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                post.authorRole === 'teacher' 
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : post.authorRole === 'alumni'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {t.role[post.authorRole]}
              </span>
            )}
          </div>
          <div className="timestamp">{timeAgo}</div>
        </div>
      </div>

      {/* 内容 */}
      <div className="text-gray-800 dark:text-gray-100 text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="mb-4">
          {post.tags.map((tagKey) => (
            <span key={tagKey} className="tag">
              #{t.tags[tagKey as keyof typeof t.tags] || tagKey}
            </span>
          ))}
        </div>
      )}

      {/* 图片 */}
      {post.imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img 
            src={post.imageUrl} 
            alt="" 
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 互动栏 */}
      <div className="flex items-center pt-3 border-t border-white/20 dark:border-white/10">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all text-sm ${
            hasLiked 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-500' 
              : 'hover:bg-white/30 dark:hover:bg-white/10 text-secondary'
          }`}
        >
          <svg className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className="font-medium">{localLikes}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-secondary transition-all ml-1 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span className="font-medium">{localComments.length}</span>
        </button>

        <div className="relative ml-1">
          <button 
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center px-3 py-1.5 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 text-secondary transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
          {/* 分享菜单 */}
          {showShareMenu && (
            <div className="absolute bottom-full right-0 mb-2 glass rounded-xl p-2 min-w-[120px] shadow-lg z-10">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post.content)
                  setShowShareMenu(false)
                  alert(language === 'zh' ? '已复制内容' : 'Content copied')
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-white/30 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                {language === 'zh' ? '复制内容' : 'Copy text'}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  setShowShareMenu(false)
                  alert(language === 'zh' ? '已复制链接' : 'Link copied')
                }}
                className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-white/30 dark:hover:bg-white/10 rounded-lg transition-all"
              >
                {language === 'zh' ? '复制链接' : 'Copy link'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 评论区 */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/30 dark:border-white/10">
          {/* 评论输入框 */}
          {user && (
            <div className="mb-4 flex items-start space-x-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                style={{ background: getGradient(user.username) }}
              >
                {getInitial(user.username)}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={language === 'zh' ? '写下你的评论...' : 'Write a comment...'}
                  className="w-full glass-light rounded-xl px-4 py-3 text-sm text-primary placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  rows={3}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmitting}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (language === 'zh' ? '发送中...' : 'Sending...') : (language === 'zh' ? '发送' : 'Send')}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 评论列表 */}
          {localComments.length > 0 && (
            <div className="space-y-3">
              {localComments.map((comment) => (
                <div key={comment.id} className="glass-light rounded-xl p-3">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ background: getGradient(comment.authorName) }}
                    >
                      {getInitial(comment.authorName)}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      {comment.authorName}
                    </span>
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      {formatDistanceToNow(comment.createdAt, { 
                        addSuffix: true, 
                        locale: language === 'zh' ? zhCN : enUS 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
