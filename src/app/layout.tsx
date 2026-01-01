import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JZThread - 金山中学校园墙',
  description: '匿名分享，自由表达',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JZThread',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 柔和流体背景 */}
        <div className="animated-bg" id="animated-bg">
          <div className="blur-layer">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
          </div>
          <div className="vignette-layer"></div>
          <div className="noise-layer"></div>
        </div>
        {children}
      </body>
    </html>
  )
}
