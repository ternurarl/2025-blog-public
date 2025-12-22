/** @type {import('next-sitemap').IConfig} */

const formatLastmod = (dateStr) => {
	const fallback = new Date().toISOString().slice(0, 10)

	if (!dateStr) return fallback

	const d = new Date(dateStr)
	if (Number.isNaN(d.getTime())) return fallback

	return d.toISOString().slice(0, 10)
}

module.exports = {
    // 1. 站点地址配置
    // 优先读取 SITE_URL，否则读取 Vercel 预览地址，最后回退到本地
    siteUrl: process.env.SITE_URL || 
             (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),

    generateRobotsTxt: true, // 自动生成 robots.txt
    sitemapSize: 7000,       // 分割大小

    // ✅ 新增：只生成 sitemap.xml，不再生成 sitemap-0.xml 索引结构
    generateIndexSitemap: false,

    // ✅ 默认频率和权重（适用于首页等自动路由）
    changefreq: 'daily',
    priority: 0.7,

    // ✅ 全局格式化所有自动生成路由的 lastmod（包括 / 首页 等）
    transform: async (config, path) => {
      const rawLastmod = config.autoLastmod ? new Date().toISOString() : undefined

      return {
        loc: path,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: rawLastmod ? formatLastmod(rawLastmod) : undefined,
      }
    },
  
    // 2. 核心逻辑：远程抓取 GitHub Raw 数据生成动态文章路径
    additionalPaths: async (config) => {
      const result = []
  
      // --- 🔧 变量拼凑区域 ---
      
      const ghOwner = process.env.NEXT_PUBLIC_GITHUB_OWNER
      const ghRepo = process.env.NEXT_PUBLIC_GITHUB_REPO || '2025-blog-public'
      const ghBranch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || 'main'
  
      // 拼凑 GitHub Raw 地址
      const githubIndexUrl = `https://raw.githubusercontent.com/${ghOwner}/${ghRepo}/${ghBranch}/public/blogs/index.json`
      // -----------------------
  
      try {
        console.log(`[next-sitemap] Fetching blog index from: ${githubIndexUrl}`)
        
        // 远程拉取 JSON (Node.js 18+ 原生支持 fetch)
        const req = await fetch(githubIndexUrl)
        
        if (!req.ok) {
          throw new Error(`GitHub Responded: ${req.status} (${req.statusText})`)
        }
  
        const posts = await req.json()
  
        // 遍历文章列表，转换成 Sitemap 格式
        posts.forEach((post) => {
          result.push({
            loc: `/blog/${post.slug}`,      // 你的文章链接结构
            changefreq: 'weekly',
            priority: 0.8,
            lastmod: formatLastmod(post.date),
          })
        })
        
        console.log(`[next-sitemap] Successfully added ${result.length} posts.`)
  
      } catch (error) {
        console.error('[next-sitemap] Failed to fetch blog index.', error)
      }
  
      return result
    },
  }