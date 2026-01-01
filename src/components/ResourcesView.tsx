'use client'

import { useState, useMemo, useRef } from 'react'
import { useStore, RESOURCE_CATEGORIES, Resource } from '@/store'
import { translations } from '@/i18n'
import { nanoid } from 'nanoid'

export default function ResourcesView() {
  const { resources, language, incrementDownload, addResource, user } = useStore()
  const t = translations[language]
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 筛选资源
  const filteredResources = useMemo(() => {
    let result = [...resources]
    
    if (selectedCategory) {
      result = result.filter(r => r.category === selectedCategory)
    }
    if (selectedSubcategory) {
      result = result.filter(r => r.subcategory === selectedSubcategory)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query)
      )
    }
    
    return result.sort((a, b) => b.createdAt - a.createdAt)
  }, [resources, selectedCategory, selectedSubcategory, searchQuery])

  // 获取当前分类的子分类
  const currentSubcategories = useMemo(() => {
    if (!selectedCategory) return []
    const category = RESOURCE_CATEGORIES.find(c => c.id === selectedCategory)
    return category?.subcategories || []
  }, [selectedCategory])

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')
  }

  const handleDownload = (resource: Resource) => {
    incrementDownload(resource.id)
    // 实际下载逻辑
    window.open(resource.filePath, '_blank')
  }

  const handleUpload = () => {
    if (!user || !selectedFile || !uploadForm.name || !uploadForm.category) {
      alert(language === 'zh' ? '请填写完整信息' : 'Please fill in all required fields')
      return
    }

    const newResource: Resource = {
      id: nanoid(),
      name: uploadForm.name,
      category: uploadForm.category,
      subcategory: uploadForm.subcategory || undefined,
      fileType: selectedFile.name.split('.').pop() || 'file',
      fileSize: selectedFile.size,
      filePath: URL.createObjectURL(selectedFile), // 实际项目中应上传到服务器
      uploaderId: user.credential,
      uploaderName: user.nickname,
      downloads: 0,
      createdAt: Date.now(),
      description: uploadForm.description || undefined,
    }

    addResource(newResource)
    setShowUploadModal(false)
    setUploadForm({ name: '', category: '', subcategory: '', description: '' })
    setSelectedFile(null)
    alert(language === 'zh' ? '上传成功！' : 'Upload successful!')
  }

  const currentUploadSubcategories = useMemo(() => {
    if (!uploadForm.category) return []
    const category = RESOURCE_CATEGORIES.find(c => c.id === uploadForm.category)
    return category?.subcategories || []
  }, [uploadForm.category])

  return (
    <div className="fade-in">
      {/* 搜索栏 */}
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.resources.search}
              className="input-glass pl-11 w-full"
            />
          </div>
          <button 
            onClick={() => user ? setShowUploadModal(true) : alert(language === 'zh' ? '请先登录' : 'Please login first')}
            className="btn-primary px-4 py-3"
          >
            {t.resources.upload}
          </button>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="glass rounded-2xl p-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory(null)
              setSelectedSubcategory(null)
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'glass-light text-gray-600 hover:bg-white/50'
            }`}
          >
            {t.resources.allCategories}
          </button>
          {RESOURCE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
                setSelectedSubcategory(null)
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                  : 'glass-light text-secondary hover:bg-white/50'
              }`}
            >
              {t.categories[category.id as keyof typeof t.categories] || category.name}
            </button>
          ))}
        </div>

        {/* 子分类 */}
        {currentSubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/30">
            {currentSubcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(
                  selectedSubcategory === sub ? null : sub
                )}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedSubcategory === sub
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-white/30 text-gray-600 hover:bg-white/50 dark:text-gray-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 资源列表 */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-secondary">{t.resources.noResource}</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div key={resource.id} className="glass card">
              <div className="flex items-start gap-4">
                {/* 文件类型标识 */}
                <div className="w-12 h-12 rounded-xl glass-light flex items-center justify-center text-xs font-bold text-secondary uppercase flex-shrink-0">
                  {resource.fileType}
                </div>
                
                {/* 文件信息 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 truncate">
                    {resource.name}
                  </h3>
                  {resource.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{formatFileSize(resource.fileSize)}</span>
                    <span>•</span>
                    <span>{resource.downloads} {t.resources.downloads}</span>
                    <span>•</span>
                    <span>{formatDate(resource.createdAt)}</span>
                  </div>
                </div>

                {/* 下载按钮 */}
                <button
                  onClick={() => handleDownload(resource)}
                  className="btn-glass px-4 py-2 flex-shrink-0 text-sm"
                >
                  {t.resources.download}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 上传弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-primary mb-4">
              {t.resources.upload}
            </h3>
            
            {/* 文件选择 */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 transition-all"
              >
                {selectedFile ? (
                  <div className="text-center">
                    <div className="text-2xl mb-2">📄</div>
                    <p className="text-sm text-primary">{selectedFile.name}</p>
                    <p className="text-xs text-secondary">{formatFileSize(selectedFile.size)}</p>
                  </div>
                ) : (
                  <p className="text-secondary">{language === 'zh' ? '点击选择文件' : 'Click to select file'}</p>
                )}
              </button>
            </div>

            {/* 资源名称 */}
            <div className="mb-4">
              <label className="text-sm text-secondary mb-1 block">
                {language === 'zh' ? '资源名称' : 'Resource name'} *
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                className="input-glass w-full"
                placeholder={language === 'zh' ? '例如：数学必修一笔记' : 'e.g. Math notes'}
              />
            </div>

            {/* 分类选择 */}
            <div className="mb-4">
              <label className="text-sm text-secondary mb-1 block">
                {language === 'zh' ? '分类' : 'Category'} *
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value, subcategory: '' })}
                className="input-glass w-full"
              >
                <option value="">{language === 'zh' ? '请选择分类' : 'Select category'}</option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {t.categories[cat.id as keyof typeof t.categories] || cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 子分类选择 */}
            {currentUploadSubcategories.length > 0 && (
              <div className="mb-4">
                <label className="text-sm text-secondary mb-1 block">
                  {language === 'zh' ? '子分类' : 'Subcategory'}
                </label>
                <select
                  value={uploadForm.subcategory}
                  onChange={(e) => setUploadForm({ ...uploadForm, subcategory: e.target.value })}
                  className="input-glass w-full"
                >
                  <option value="">{language === 'zh' ? '请选择子分类' : 'Select subcategory'}</option>
                  {currentUploadSubcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 描述 */}
            <div className="mb-6">
              <label className="text-sm text-secondary mb-1 block">
                {language === 'zh' ? '描述（选填）' : 'Description (optional)'}
              </label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                className="input-glass w-full"
                rows={2}
                placeholder={language === 'zh' ? '简单介绍一下这个资源...' : 'Brief description...'}
              />
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadForm({ name: '', category: '', subcategory: '', description: '' })
                  setSelectedFile(null)
                }}
                className="flex-1 btn-glass py-2"
              >
                {language === 'zh' ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadForm.name || !uploadForm.category}
                className="flex-1 btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {language === 'zh' ? '上传' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
