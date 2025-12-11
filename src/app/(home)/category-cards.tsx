import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useConfigStore } from './stores/config-store'
import Link from 'next/link'
import { HomeDraggableLayer } from './home-draggable-layer'
import { motion } from 'motion/react'
import dayjs from 'dayjs'
import { useReadArticles } from '@/hooks/use-read-articles'
import { useMemo } from 'react'
import type { BlogIndexItem } from '@/hooks/use-blog-index'

interface CategoryCardProps {
	tag: string
	articles: BlogIndexItem[]
	cardKey: string
	order: number
	width: number
	height: number
	offsetX: number | null
	offsetY: number | null
	enabled: boolean
}

function CategoryCard({ tag, articles, cardKey, order, width, height, offsetX, offsetY, enabled }: CategoryCardProps) {
	const center = useCenterStore()
	const { isRead } = useReadArticles()
	const x = offsetX !== null ? center.x + offsetX : center.x
	const y = offsetY !== null ? center.y + offsetY : center.y

	// 获取最新的3篇文章
	const latestArticles = articles.slice(0, 3)

	if (!enabled) return null

	return (
		<HomeDraggableLayer cardKey={cardKey as any} x={x} y={y} width={width} height={height}>
			<Card order={order} width={width} height={height} x={x} y={y} className='space-y-3 max-sm:static'>
				{/* 分类标题 */}
				<div className='flex items-center justify-between mb-2'>
					<Link
						href={`/categories/${tag}`}
						className='text-sm font-medium text-gray-700 hover:text-brand transition-colors'>
						{tag}
					</Link>
					<span className='text-secondary text-xs'>
						{articles.length}
					</span>
				</div>

				{/* 文章列表 - 时间轴风格 */}
				<div className='space-y-2 ml-1'>
					{latestArticles.map((article, index) => {
						const hasRead = isRead(article.slug)
						return (
							<div key={article.slug} className='group relative flex items-start gap-2'>
								{/* 时间轴 */}
								<div className='relative flex flex-col items-center mt-1'>
									{/* 连接线 */}
									{index < latestArticles.length - 1 && (
										<div className='absolute top-3 bottom-0 w-px border-l border-dashed border-gray-200'></div>
									)}
									{/* 圆点 */}
									<div className='h-1.5 w-1.5 rounded-full bg-gray-300 group-hover:bg-brand transition-colors'></div>
								</div>

								{/* 文章内容 */}
								<div className='flex-1 min-w-0'>
									<Link
										href={`/blog/${article.slug}`}
										className='group-hover:text-brand transition-colors'>
										<div className='space-y-1'>
											<div className='text-xs font-medium line-clamp-2'>
												{article.title || article.slug}
												{hasRead && <span className='text-secondary ml-1 text-xs'>[已阅读]</span>}
											</div>
											<div className='text-secondary text-xs'>
												{dayjs(article.date).format('MM-DD')}
											</div>
										</div>
									</Link>
								</div>
							</div>
						)
					})}
				</div>

				{/* 查看更多链接 */}
				<Link
					href={`/categories/${tag}`}
					className='text-brand inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80 mt-2'>
					查看更多 →
				</Link>
			</Card>
		</HomeDraggableLayer>
	)
}

export default function CategoryCards() {
	const center = useCenterStore()
	const { items } = useBlogIndex()
	const { cardStyles } = useConfigStore()

	// 根据分类字段聚合文章
	const categorizedItems = useMemo(() => {
		const categories: Record<string, BlogIndexItem[]> = {}
		
		items.forEach(item => {
			const categoryName = (item.category || '未分类').trim()
			if (!categories[categoryName]) {
				categories[categoryName] = []
			}
			categories[categoryName].push(item)
		})
		
		Object.keys(categories).forEach(name => {
			categories[name].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		})
		
		return categories
	}, [items])

	// 获取主要分类（文章数量最多的前6个）
	const mainCategories = useMemo(() => {
		return Object.entries(categorizedItems)
			.map(([tag, articles]) => ({
				tag,
				articles,
				count: articles.length
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 6)
	}, [categorizedItems])

	// 为每个分类生成卡片配置
	const categoryCardConfigs = useMemo(() => {
		return mainCategories.map((category, index) => {
			const baseConfig = cardStyles.categoriesCard
			return {
				tag: category.tag,
				articles: category.articles,
				cardKey: `categoryCard_${index}`,
				order: baseConfig.order + index,
				width: baseConfig.width,
				height: baseConfig.height,
				offsetX: baseConfig.offsetX !== null ? (baseConfig.offsetX as number) + (index * 20) : null,
				offsetY: baseConfig.offsetY !== null ? (baseConfig.offsetY as number) + (index * 10) : null,
				enabled: baseConfig.enabled && index < 4 // 只显示前4个分类
			}
		})
	}, [mainCategories, cardStyles.categoriesCard])

	return (
		<>
			{categoryCardConfigs.map((config) => (
				<CategoryCard
					key={config.cardKey}
					tag={config.tag}
					articles={config.articles}
					cardKey={config.cardKey}
					order={config.order}
					width={config.width}
					height={config.height}
					offsetX={config.offsetX}
					offsetY={config.offsetY}
					enabled={config.enabled}
				/>
			))}
		</>
	)
}
