import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // 保持和 sitemap.ts 一致的域名逻辑
  const baseUrl = process.env.SITE_URL 
    ? process.env.SITE_URL 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*', // 允许所有爬虫
      allow: '/',     // 允许访问所有路径
      // disallow: '/private/', // 如果以后有不想被收录的页面，写在这里
    },
    // 告诉爬虫 Sitemap 在哪里
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}