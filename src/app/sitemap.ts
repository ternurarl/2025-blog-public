import { MetadataRoute } from 'next'

// 1. 定义数据类型
type BlogIndexItem = {
  slug: string
  title: string
  date: string
  summary?: string
  cover?: string
  tags?: string[]
}

// 2. 强制静态生成 (SSG)
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.bainiaos.top'
  
  // ⚠️ 你的 GitHub Raw 文件地址
  // 格式: https://raw.githubusercontent.com/[用户名]/[仓库名]/[分支]/[文件路径]
  const githubIndexUrl = 'https://raw.githubusercontent.com/ternurarl/2025-blog-public/main/public/blogs/index.json'

  let posts: BlogIndexItem[] = []

  try {
    // 3. 从 GitHub 远程获取 JSON 数据
    // next: { revalidate: 60 } 确保在构建时尽量获取最新数据，但 sitemap 主要在构建时生成一次
    const res = await fetch(githubIndexUrl, { next: { revalidate: 0 } })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch from GitHub: ${res.status}`)
    }
    
    posts = await res.json()
  } catch (error) {
    console.error('Sitemap Error: 无法从 GitHub 获取文章列表', error)
  }

  // 4. 生成文章页面的 Sitemap 条目
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    // 确认这里是 /blog/ 还是 /post/，根据你之前的截图看文件名是 load-blog，推测是 /blog/
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 5. 静态页面 (首页)
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  return [...staticEntries, ...postEntries]
}
