'use client'

import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { translations } from '@/i18n'
import PostCard from './PostCard'
import ComposeBox from './ComposeBox'
import UserProfileModal from './UserProfileModal'

type ThreadTab = 'all' | 'hot' | 'latest'

export default function ThreadView() {
  const { posts, language } = useStore()
  const t = translations[language]
  const [activeTab, setActiveTab] = useState<ThreadTab>('all')
  const [viewingUser, setViewingUser] = useState<{ id: string; name: string } | null>(null)

  const tabs: { id: ThreadTab; label: string }[] = [
    { id: 'all', label: t.thread.all },
    { id: 'hot', label: t.thread.hot },
    { id: 'latest', label: t.thread.latest },
  ]

  // 根据标签筛选和排序帖子
  const filteredPosts = useMemo(() => {
    let result = [...posts]
    
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
  }, [posts, activeTab])

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
