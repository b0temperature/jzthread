export const translations = {
  zh: {
    // 通用
    app: {
      name: 'JZThread',
      subtitle: '金山中学校园墙',
    },
    
    // 导航
    nav: {
      thread: '串文',
      resources: '资源',
      profile: '我的',
    },
    
    // 串文页
    thread: {
      title: '串文',
      all: '全部',
      hot: '热门',
      latest: '最新',
      compose: '分享一些有趣的事...',
      placeholder: '分享一些有趣的事...',
      publish: '发布',
      selectTags: '选择标签（最多3个）',
      like: '赞',
      comment: '评论',
      share: '分享',
      noPost: '还没有帖子，来发布第一条吧！',
    },
    
    // 资源页
    resources: {
      title: '学习资源',
      search: '搜索资源...',
      upload: '上传资源',
      download: '下载',
      downloads: '次下载',
      allCategories: '全部分类',
      noResource: '暂无资源',
      fileSize: '文件大小',
      uploadedBy: '上传者',
      uploadTime: '上传时间',
    },
    
    // 个人页
    profile: {
      title: '个人中心',
      posts: '帖子',
      likes: '获赞',
      comments: '评论',
      credential: '登录凭证',
      yourCredential: '你的凭证（请妥善保管）',
      keepSafe: '请妥善保管',
      studentId: '学号',
      enrollYear: '入学',
      graduateYear: '毕业',
      phone: '手机',
      notBound: '未绑定',
      logout: '退出登录',
      logoutConfirm: '确定要退出吗？请确保你已保存好凭证。',
      settings: '设置',
      theme: '主题',
      language: '语言',
      light: '浅色',
      dark: '深色',
      system: '跟随系统',
      lightMode: '浅色',
      darkMode: '深色',
      systemMode: '系统',
      pendingReview: '身份审核中',
      pendingReviewDesc: '管理员会在24小时内审核，请耐心等待',
    },
    
    // 角色
    role: {
      student: '在校生',
      teacher: '教师',
      alumni: '校友',
      pending: '待验证',
    },
    
    // 状态
    status: {
      verified: '已验证',
      pending: '待审核',
      rejected: '未通过',
      pendingTip: '管理员会在24小时内审核，请耐心等待',
    },
    
    // 登录注册
    auth: {
      register: '注册新账号',
      login: '我有凭证',
      welcome: '欢迎回来',
      enterCredential: '输入你的16位凭证',
      enter: '进入',
      forgotCredential: '忘记凭证？联系管理员通过手机号找回',
      fillInfo: '填写信息',
      infoTip: '用于找回账号，不会公开显示',
      iAm: '我是',
      phone: '手机号',
      phonePlaceholder: '用于找回账号',
      email: '邮箱（选填）',
      emailPlaceholder: '备用联系方式',
      studentId: '学号',
      studentIdPlaceholder: '不会公开显示',
      enrollYear: '入学年份',
      graduateYear: '毕业年份',
      next: '下一步',
      verify: '身份验证',
      verifyTip: '上传以下任一证明',
      verifyItems: ['学生证/饭卡照片', '校务系统截图（显示学号即可）', '教师工作证（教师）'],
      verifyNote: '图片仅用于审核，审核后立即删除',
      uploadImage: '点击上传图片',
      submit: '提交审核',
      success: '提交成功',
      saveCredential: '请保存你的登录凭证',
      yourCredential: '你的凭证',
      copy: '复制凭证',
      copied: '已复制',
      important: '重要：',
      importantTip: '这是你唯一的登录凭证。如果丢失，需要联系管理员通过手机号找回。',
      reviewNote: '审核说明：',
      reviewTip: '管理员会在24小时内审核你的身份。审核通过后你将获得完整权限。',
      imageDelete: '审核通过后，你上传的图片将被永久删除。',
      confirm: '我已保存凭证',
      start: '开始使用',
      back: '返回',
    },
    
    // 关于
    about: {
      title: '关于 JZThread',
      anonymous: '真正的匿名',
      anonymousDesc: '我们不收集邮箱、手机号、IP地址等任何个人信息。你的身份只是一个16位随机凭证。',
      anonymousTip: '我们不收集邮箱、手机号、IP地址等任何个人信息。你的身份只是一个16位随机凭证。',
      keepCredential: '请保管好凭证',
      keepCredentialTip: '丢失凭证 = 永久丢失账号。这不是bug，是feature。因为我们无法验证你是谁。',
      saveCredential: '请保管好凭证',
      saveCredentialDesc: '丢失凭证 = 永久丢失账号。这不是bug，是feature。因为我们无法验证你是谁。',
      friendly: '友善发言',
      friendlyTip: '匿名不是恶意攻击他人的借口。请保持友善，违规内容将被删除。',
      beKind: '友善发言',
      beKindDesc: '匿名不是恶意攻击他人的借口。请保持友善，违规内容将被删除。',
      version: '版本',
    },
    
    // 分类
    categories: {
      math: '数学',
      chinese: '语文',
      english: '英语',
      physics: '物理',
      chemistry: '化学',
      biology: '生物',
      history: '历史',
      geography: '地理',
      politics: '政治',
      other: '其他',
    },
    
    // 标签
    tags: {
      canteen: '食堂',
      exam: '考试',
      rant: '吐槽',
      help: '求助',
      confession: '表白墙',
      secondhand: '二手',
      daily: '日常',
      study: '学习',
    },
    
    // 必填
    required: '必填',
    
    // 错误
    error: {
      phoneInvalid: '请输入正确的手机号',
      studentIdRequired: '请输入学号',
      imageRequired: '请上传至少一张验证图片',
      confirmRequired: '请勾选确认你已保存凭证',
      credentialInvalid: '凭证格式不正确，应为16位字符',
    },
    
    // 学校特色
    school: {
      title: '金中专属社区',
      features: [
        '仅限金山中学师生及校友',
        '需要验证学生证/教师证',
        '验证后图片立即删除',
        '不存储姓名，只保留学号',
      ],
    },
  },
  
  en: {
    // Common
    app: {
      name: 'JZThread',
      subtitle: 'Jinshan High School Forum',
    },
    
    // Navigation
    nav: {
      thread: 'Threads',
      resources: 'Resources',
      profile: 'Profile',
    },
    
    // Thread page
    thread: {
      title: 'Threads',
      all: 'All',
      hot: 'Hot',
      latest: 'Latest',
      compose: 'Share something interesting...',
      placeholder: 'Share something interesting...',
      publish: 'Post',
      selectTags: 'Select tags (max 3)',
      like: 'Like',
      comment: 'Comment',
      share: 'Share',
      noPost: 'No posts yet. Be the first to share!',
    },
    
    // Resources page
    resources: {
      title: 'Study Resources',
      search: 'Search resources...',
      upload: 'Upload',
      download: 'Download',
      downloads: 'downloads',
      allCategories: 'All Categories',
      noResource: 'No resources yet',
      fileSize: 'File size',
      uploadedBy: 'Uploaded by',
      uploadTime: 'Upload time',
    },
    
    // Profile page
    profile: {
      title: 'Profile',
      posts: 'Posts',
      likes: 'Likes',
      comments: 'Comments',
      credential: 'Login Credential',
      yourCredential: 'Your Credential (Keep it safe)',
      keepSafe: 'Keep it safe',
      studentId: 'Student ID',
      enrollYear: 'Enrolled',
      graduateYear: 'Graduated',
      phone: 'Phone',
      notBound: 'Not bound',
      logout: 'Log out',
      logoutConfirm: 'Are you sure? Make sure you have saved your credential.',
      settings: 'Settings',
      theme: 'Theme',
      language: 'Language',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      lightMode: 'Light',
      darkMode: 'Dark',
      systemMode: 'Auto',
      pendingReview: 'Identity Verification Pending',
      pendingReviewDesc: 'Admin will review within 24 hours, please wait',
    },
    
    // Role
    role: {
      student: 'Student',
      teacher: 'Teacher',
      alumni: 'Alumni',
      pending: 'Pending',
    },
    
    // Status
    status: {
      verified: 'Verified',
      pending: 'Pending Review',
      rejected: 'Rejected',
      pendingTip: 'Admin will review within 24 hours, please wait',
    },
    
    // Auth
    auth: {
      register: 'Create Account',
      login: 'I have a credential',
      welcome: 'Welcome back',
      enterCredential: 'Enter your 16-digit credential',
      enter: 'Enter',
      forgotCredential: 'Forgot credential? Contact admin with your phone number',
      fillInfo: 'Fill in Information',
      infoTip: 'For account recovery, will not be public',
      iAm: 'I am',
      phone: 'Phone',
      phonePlaceholder: 'For account recovery',
      email: 'Email (optional)',
      emailPlaceholder: 'Backup contact',
      studentId: 'Student ID',
      studentIdPlaceholder: 'Will not be public',
      enrollYear: 'Enrollment Year',
      graduateYear: 'Graduation Year',
      next: 'Next',
      verify: 'Verification',
      verifyTip: 'Upload any of the following',
      verifyItems: ['Student ID / Meal Card', 'School system screenshot', 'Teacher ID (for teachers)'],
      verifyNote: 'Images are only for review, will be deleted after approval',
      uploadImage: 'Click to upload',
      submit: 'Submit for Review',
      success: 'Submitted Successfully',
      saveCredential: 'Please save your credential',
      yourCredential: 'Your Credential',
      copy: 'Copy',
      copied: 'Copied',
      important: 'Important: ',
      importantTip: 'This is your only login credential. Contact admin with your phone if lost.',
      reviewNote: 'Review Note: ',
      reviewTip: 'Admin will review within 24 hours. You will have full access after approval.',
      imageDelete: 'Your uploaded images will be permanently deleted after approval.',
      confirm: 'I have saved my credential',
      start: 'Get Started',
      back: 'Back',
    },
    
    // About
    about: {
      title: 'About JZThread',
      anonymous: 'True Anonymity',
      anonymousDesc: 'We do not collect email, phone, IP or any personal info. Your identity is just a 16-digit random credential.',
      anonymousTip: 'We do not collect email, phone, IP or any personal info. Your identity is just a 16-digit random credential.',
      keepCredential: 'Keep Your Credential Safe',
      keepCredentialTip: 'Lost credential = Lost account forever. This is a feature, not a bug.',
      saveCredential: 'Keep Your Credential Safe',
      saveCredentialDesc: 'Lost credential = Lost account forever. This is a feature, not a bug.',
      friendly: 'Be Friendly',
      friendlyTip: 'Anonymity is not an excuse for harassment. Stay friendly, or your content will be removed.',
      beKind: 'Be Friendly',
      beKindDesc: 'Anonymity is not an excuse for harassment. Stay friendly, or your content will be removed.',
      version: 'Version',
    },
    
    // Categories
    categories: {
      math: 'Math',
      chinese: 'Chinese',
      english: 'English',
      physics: 'Physics',
      chemistry: 'Chemistry',
      biology: 'Biology',
      history: 'History',
      geography: 'Geography',
      politics: 'Politics',
      other: 'Other',
    },
    
    // Tags
    tags: {
      canteen: 'Canteen',
      exam: 'Exam',
      rant: 'Rant',
      help: 'Help',
      confession: 'Confession',
      secondhand: 'Second-hand',
      daily: 'Daily',
      study: 'Study',
    },
    
    // Required
    required: 'Required',
    
    // Error
    error: {
      phoneInvalid: 'Please enter a valid phone number',
      studentIdRequired: 'Please enter student ID',
      imageRequired: 'Please upload at least one image',
      confirmRequired: 'Please confirm you have saved your credential',
      credentialInvalid: 'Invalid credential format, should be 16 characters',
    },
    
    // School
    school: {
      title: 'Jinshan High School Only',
      features: [
        'Only for students, teachers and alumni',
        'Student/Teacher ID verification required',
        'Images deleted after verification',
        'No real name stored, only student ID',
      ],
    },
  },
}

export type TranslationKey = typeof translations.zh
