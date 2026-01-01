import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Post {
  id: string
  content: string
  authorId: string
  authorName: string
  authorRole: UserRole
  tags: string[]
  likes: number
  likedBy: string[]
  comments: Comment[]
  createdAt: number
  imageUrl?: string
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: number
}

// 资源类型
export interface Resource {
  id: string
  name: string
  category: string
  subcategory?: string
  fileType: string
  fileSize: number
  filePath: string
  uploaderId: string
  uploaderName: string
  downloads: number
  createdAt: number
  description?: string
}

// 资源分类
export interface ResourceCategory {
  id: string
  name: string
  icon: string
  subcategories?: string[]
}

// 用户角色
export type UserRole = 'student' | 'teacher' | 'alumni' | 'pending'

// 用户状态
export type VerifyStatus = 'pending' | 'verified' | 'rejected'

// 主题模式
export type ThemeMode = 'light' | 'dark' | 'system'

// 语言
export type Language = 'zh' | 'en'

// 背景主题 - 8种柔和主题（来自细糠版本）
export type BackgroundTheme = 'moonDesert' | 'dawn' | 'sunset' | 'stone' | 'dusk' | 'light' | 'mango' | 'ice'

// 背景主题配置 - 直接来自 ai_studio_code (9).html
export const BACKGROUND_THEMES: Record<BackgroundTheme, {
  name: string
  nameZh: string
  bg: string
  c1: string
  c2: string
  c3: string
  c4: string
  isLight: boolean
}> = {
  moonDesert: {
    name: 'Moon Desert',
    nameZh: '月夜沙漠',
    bg: '#0a0e17',
    c1: '#1e293b',
    c2: '#5f5546',
    c3: '#334155',
    c4: '#94a3b8',
    isLight: false
  },
  dawn: {
    name: 'Dawn',
    nameZh: '晨曦',
    bg: '#5d596b',
    c1: '#84a9a6',
    c2: '#d16d63',
    c3: '#b39ddb',
    c4: '#e0e0e0',
    isLight: false
  },
  sunset: {
    name: 'Sunset',
    nameZh: '日落',
    bg: '#0d2b38',
    c1: '#c26a4e',
    c2: '#376469',
    c3: '#bcaaa4',
    c4: '#ffccbc',
    isLight: false
  },
  stone: {
    name: 'Stone',
    nameZh: '岩石',
    bg: '#2d2420',
    c1: '#4e3d35',
    c2: '#6d5d52',
    c3: '#8d7b72',
    c4: '#a1887f',
    isLight: false
  },
  dusk: {
    name: 'Dusk',
    nameZh: '黄昏',
    bg: '#17131f',
    c1: '#3e1a2b',
    c2: '#7a725a',
    c3: '#5d4037',
    c4: '#8d6e63',
    isLight: false
  },
  light: {
    name: 'Light',
    nameZh: '浅灰',
    bg: '#607d8b',
    c1: '#006064',
    c2: '#90a4ae',
    c3: '#455a64',
    c4: '#cfd8dc',
    isLight: true
  },
  mango: {
    name: 'Mango',
    nameZh: '芒果',
    bg: '#554a5c',
    c1: '#d68c3b',
    c2: '#b39ddb',
    c3: '#a1887f',
    c4: '#ffcc80',
    isLight: false
  },
  ice: {
    name: 'Ice',
    nameZh: '冰川',
    bg: '#454e59',
    c1: '#546e7a',
    c2: '#78909c',
    c3: '#90a4ae',
    c4: '#b0bec5',
    isLight: false
  }
}

export interface User {
  credential: string
  nickname: string
  phone: string
  email?: string
  studentId?: string
  role: UserRole
  enrollYear?: number
  graduateYear?: number
  verifyStatus: VerifyStatus
  verifyTime?: number
  pendingImages?: string[]
  createdAt: number
}

export interface InviteCode {
  code: string
  createdBy: string
  usedBy?: string
  createdAt: number
  usedAt?: number
}

// 预设资源分类
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: 'math', name: '数学', icon: '📐', subcategories: ['必修一', '必修二', '必修三', '必修四', '选必一', '选必二', '选必三'] },
  { id: 'chinese', name: '语文', icon: '📖', subcategories: ['必修上', '必修下', '选必上', '选必中', '选必下'] },
  { id: 'english', name: '英语', icon: '🔤', subcategories: ['词汇', '语法', '阅读', '写作', '听力'] },
  { id: 'physics', name: '物理', icon: '⚡', subcategories: ['必修一', '必修二', '必修三', '选必一', '选必二', '选必三'] },
  { id: 'chemistry', name: '化学', icon: '🧪', subcategories: ['必修一', '必修二', '选必一', '选必二', '选必三'] },
  { id: 'biology', name: '生物', icon: '🧬', subcategories: ['必修一', '必修二', '选必一', '选必二', '选必三'] },
  { id: 'history', name: '历史', icon: '📜', subcategories: ['必修上', '必修下', '选必一', '选必二', '选必三'] },
  { id: 'geography', name: '地理', icon: '🌍', subcategories: ['必修一', '必修二', '选必一', '选必二', '选必三'] },
  { id: 'politics', name: '政治', icon: '⚖️', subcategories: ['必修一', '必修二', '必修三', '必修四', '选必一', '选必二', '选必三'] },
  { id: 'other', name: '其他', icon: '📁', subcategories: ['竞赛', '综评', '学习方法', '工具软件'] },
]

// 示例资源数据
const sampleResources: Resource[] = [
  {
    id: 'r1',
    name: 'Longman 9000词汇表',
    category: 'english',
    subcategory: '词汇',
    fileType: 'pdf',
    fileSize: 2048000,
    filePath: '/resources/longman9000.pdf',
    uploaderId: 'admin',
    uploaderName: '管理员',
    downloads: 156,
    createdAt: Date.now() - 86400000 * 7,
    description: '朗文9000核心词汇完整版'
  },
  {
    id: 'r2',
    name: 'Oxford 3000词汇表',
    category: 'english',
    subcategory: '词汇',
    fileType: 'pdf',
    fileSize: 1536000,
    filePath: '/resources/oxford3000.pdf',
    uploaderId: 'admin',
    uploaderName: '管理员',
    downloads: 89,
    createdAt: Date.now() - 86400000 * 5,
    description: '牛津3000核心词汇'
  },
  {
    id: 'r3',
    name: '数学必修一教材',
    category: 'math',
    subcategory: '必修一',
    fileType: 'pdf',
    fileSize: 15360000,
    filePath: '/resources/math/数学必修一.pdf',
    uploaderId: 'admin',
    uploaderName: '管理员',
    downloads: 234,
    createdAt: Date.now() - 86400000 * 10,
    description: '人教A版数学必修第一册'
  },
]

interface AppState {
  // 用户状态
  user: User | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
  
  // 帖子状态
  posts: Post[]
  addPost: (post: Post) => void
  likePost: (postId: string, userId: string) => void
  addComment: (postId: string, comment: Comment) => void
  
  // 资源状态
  resources: Resource[]
  addResource: (resource: Resource) => void
  incrementDownload: (resourceId: string) => void
  
  // 待审核用户列表
  pendingUsers: User[]
  addPendingUser: (user: User) => void
  approvePendingUser: (credential: string) => void
  rejectPendingUser: (credential: string) => void
  
  // 邀请码
  inviteCodes: InviteCode[]
  addInviteCode: (code: InviteCode) => void
  useInviteCode: (code: string, userCredential: string) => boolean
  
  // UI 状态
  activeTab: 'thread' | 'resources' | 'profile'
  setActiveTab: (tab: 'thread' | 'resources' | 'profile') => void
  
  // 主题
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  
  // 语言
  language: Language
  setLanguage: (lang: Language) => void

  // 背景主题
  backgroundTheme: BackgroundTheme
  setBackgroundTheme: (theme: BackgroundTheme) => void
}

// 生成16位随机凭证
export const generateCredential = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result.match(/.{1,4}/g)?.join('-') || result
}

// 生成6位邀请码
export const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 生成随机昵称
export const generateNickname = (): string => {
  const adjectives = ['快乐的', '安静的', '勇敢的', '聪明的', '温柔的', '神秘的', '活泼的', '可爱的']
  const nouns = ['小猫', '小狗', '企鹅', '熊猫', '兔子', '松鼠', '海豚', '小鸟']
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  const num = Math.floor(Math.random() * 1000)
  return `${adj}${noun}${num}`
}

// 角色显示名称
export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    student: '在校生',
    teacher: '教师',
    alumni: '校友',
    pending: '待验证'
  }
  return labels[role]
}

// 示例帖子数据
const samplePosts: Post[] = [
  {
    id: '1',
    content: '食堂今天的红烧肉真的绝了！推荐大家去尝尝二楼窗口的 👨‍🍳',
    authorId: 'sample1',
    authorName: '饿了的熊猫',
    authorRole: 'student',
    tags: ['食堂', '美食'],
    likes: 42,
    likedBy: [],
    comments: [
      {
        id: 'c1',
        content: '确实！我也吃了，太香了',
        authorId: 'sample2',
        authorName: '干饭人',
        createdAt: Date.now() - 3600000,
      }
    ],
    createdAt: Date.now() - 7200000,
  },
  {
    id: '2',
    content: '有人知道明天数学考试的范围吗？课代表说的太快了没听清 😭',
    authorId: 'sample3',
    authorName: '学习困难户',
    authorRole: 'student',
    tags: ['考试', '数学'],
    likes: 28,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 14400000,
  },
  {
    id: '3',
    content: '操场的晚霞太美了，分享给大家 🌅 高三党看到请回去学习',
    authorId: 'sample4',
    authorName: '摄影爱好者',
    authorRole: 'alumni',
    tags: ['校园风景', '日常'],
    likes: 156,
    likedBy: [],
    comments: [
      {
        id: 'c2',
        content: '高三党已经哭晕在厕所',
        authorId: 'sample5',
        authorName: '高三苦命人',
        createdAt: Date.now() - 1800000,
      }
    ],
    createdAt: Date.now() - 28800000,
  },
  {
    id: '4',
    content: '图书馆三楼靠窗的位置真的太舒服了，安利给大家。就是要早点去占位 📚',
    authorId: 'sample6',
    authorName: '图书馆常驻',
    authorRole: 'teacher',
    tags: ['学习', '图书馆'],
    likes: 89,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 43200000,
  },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),
      
      posts: samplePosts,
      addPost: (post) => set((state) => ({ 
        posts: [post, ...state.posts] 
      })),
      likePost: (postId, userId) => set((state) => ({
        posts: state.posts.map((post) => {
          if (post.id === postId) {
            const hasLiked = post.likedBy.includes(userId)
            return {
              ...post,
              likes: hasLiked ? post.likes - 1 : post.likes + 1,
              likedBy: hasLiked 
                ? post.likedBy.filter((id) => id !== userId)
                : [...post.likedBy, userId],
            }
          }
          return post
        }),
      })),
      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, comment],
            }
          }
          return post
        }),
      })),
      
      // 资源
      resources: sampleResources,
      addResource: (resource) => set((state) => ({
        resources: [resource, ...state.resources]
      })),
      incrementDownload: (resourceId) => set((state) => ({
        resources: state.resources.map(r => 
          r.id === resourceId ? { ...r, downloads: r.downloads + 1 } : r
        )
      })),
      
      // 待审核用户
      pendingUsers: [],
      addPendingUser: (user) => set((state) => ({
        pendingUsers: [...state.pendingUsers, user]
      })),
      approvePendingUser: (credential) => set((state) => {
        const pendingUser = state.pendingUsers.find(u => u.credential === credential)
        if (pendingUser) {
          const approvedUser: User = {
            ...pendingUser,
            verifyStatus: 'verified',
            verifyTime: Date.now(),
            pendingImages: undefined,
          }
          return {
            pendingUsers: state.pendingUsers.filter(u => u.credential !== credential),
            user: state.user?.credential === credential ? approvedUser : state.user,
          }
        }
        return state
      }),
      rejectPendingUser: (credential) => set((state) => ({
        pendingUsers: state.pendingUsers.filter(u => u.credential !== credential)
      })),
      
      // 邀请码
      inviteCodes: [],
      addInviteCode: (code) => set((state) => ({
        inviteCodes: [...state.inviteCodes, code]
      })),
      useInviteCode: (code, userCredential) => {
        const state = get()
        const inviteCode = state.inviteCodes.find(
          c => c.code === code && !c.usedBy
        )
        if (inviteCode) {
          set({
            inviteCodes: state.inviteCodes.map(c => 
              c.code === code 
                ? { ...c, usedBy: userCredential, usedAt: Date.now() }
                : c
            )
          })
          return true
        }
        return false
      },
      
      activeTab: 'thread',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // 主题
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // 语言
      language: 'zh',
      setLanguage: (lang) => set({ language: lang }),

      // 背景主题
      backgroundTheme: 'moonDesert',
      setBackgroundTheme: (theme) => set({ backgroundTheme: theme }),
    }),
    {
      name: 'jzthread-storage',
      partialize: (state) => ({ 
        user: state.user, 
        posts: state.posts,
        resources: state.resources,
        pendingUsers: state.pendingUsers,
        inviteCodes: state.inviteCodes,
        theme: state.theme,
        language: state.language,
        backgroundTheme: state.backgroundTheme,
      }),
    }
  )
)
