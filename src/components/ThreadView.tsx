'use client'

import { useState, useMemo, useEffect } from 'react'
import { useStore } from '@/store'
import { translations } from '@/i18n'
import PostCard from './PostCard'
import ComposeBox from './ComposeBox'
import UserProfileModal from './UserProfileModal'

type ThreadTab = 'all' | 'hot' | 'latest'

interface DbPost {
  id: string
  user_id: string
  title: string
  content: string
  tag?: string
  views: number
  likes: number
  comments_count: number
  created_at: string
  users?: {
    id: string
    username: string
    avatar?: string
  }
}

export default function ThreadView() {
  const { posts, language } = useStore()
  const t = translations[language]
  const [activeTab, setActiveTab] = useState<ThreadTab>('all')
  const [viewingUser, setViewingUser] = useState<{ id: string; name: string } | null>(null)
  const [dbPosts, setDbPosts] = useState<DbPost[]>([])
  const [loading, setLoading] = useState(true)

  // 从 API 获取帖子数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const data = await response.json()
        if (data.posts) {
          setDbPosts(data.posts)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])

  const tabs: { id: ThreadTab; label: string }[] = [
    { id: 'all', label: t.thread.all },
    { id: 'hot', label: t.thread.hot },
    { id: 'latest', label: t.thread.latest },
  ]

  // 转换数据库帖子格式为应用格式
  const convertedPosts = useMemo(() => {
    return dbPosts.map(post => ({
      id: post.id,
      content: `${post.title}\n\n${post.content}`,
      authorId: post.user_id,
      authorName: post.users?.username || 'Unknown',
      authorRole: 'student' as const,
      tags: post.tag ? [post.tag] : [],
      likes: post.likes,
      likedBy: [],
      comments: [],
      createdAt: new Date(post.created_at).getTime(),
      imageUrl: undefined
    }))
  }, [dbPosts])

  // 根据标签筛选和排序帖子
  const filteredPosts = useMemo(() => {
    let result = [...convertedPosts]
    
    if (activeTab === 'hot') {
      result.sort((a, b) => b.likes - a.likes)
    } else if (activeTab === 'latest') {
      result.sort((a, b) => b.createdAt - a.createdAt)
    } else {
      // 综合排序
      result.sort((a, b) => {
        const timeWeight = 0.3
        const likeWeight = 0.7
        const now = Date.now()
        const aScore = (1 - (now - a.createdAt) / (24 * 60 * 60 * 1000)) * timeWeight + 
                       (a.likes / 100) * likeWeight
        const bScore = (1 - (now - b.createdAt) / (24 * 60 * 60 * 1000)) * timeWeight + 
                       (b.likes / 100) * likeWeight
        return bScore - aScore
      })
    }
    
    return result
  }, [convertedPosts, activeTab])

  if (loading) {
    return (
      <div className="fade-in">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-secondary">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* 标签导航 */}
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-5 rounded-full text-sm transition-all ${
              activeTab === tab.id
                ? 'glass-active text-primary font-medium'
                : 'glass-light text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 发帖框 */}
      <ComposeBox />
      
      {/* 帖子列表 */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-secondary">{t.thread.noPost}</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onAuthorClick={(authorId, authorName) => setViewingUser({ id: authorId, name: authorName })}
            />
          ))
        )}
      </div>

      {/* 查看用户主页弹窗 */}
      {viewingUser && (
        <UserProfileModal
          authorId={viewingUser.id}
          authorName={viewingUser.name}
          onClose={() => setViewingUser(null)}
        />
      )}
    </div>
  )
}
