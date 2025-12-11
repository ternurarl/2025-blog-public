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

export default function CategoriesCard() {
	const center = useCenterStore()
	const { cardStyles } = useConfigStore()
	const { items } = useBlogIndex()
	const { isRead } = useReadArticles()
	const styles = cardStyles.categoriesCard

	// 获取所有唯一标签和对应的文章
	const categorizedItems = useMemo(() => {
		const categories: Record<string, BlogIndexItem[]> = {}
		
		items.forEach(item => {
			const categoryName = (item.category || '未分类').trim()
			if (!categories[categoryName]) {
				categories[categoryName] = []
			}
			categories[categoryName].push(item)
		})
		
		// 对每个分类按日期排序
		Object.keys(categories).forEach(name => {
			categories[name].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		})

		return categories
	}, [items])

	// 获取主要分类（文章数量最多的前3个）
	const mainCategories = useMemo(() => {
		return Object.entries(categorizedItems)
			.map(([tag, articles]) => ({
				tag,
				count: articles.length,
				latestArticle: articles[0],
				articles: articles.slice(0, 3) // 每个分类显示前3篇文章
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3)
	}, [categorizedItems])

	const x = styles.offsetX !== null ? center.x + styles.offsetX : center.x + 200
	const y = styles.offsetY !== null ? center.y + styles.offsetY : center.y - 100

	return (
		<HomeDraggableLayer cardKey='categoriesCard' x={x} y={y} width={styles.width} height={styles.height}>
			<Card order={styles.order} width={styles.width} height={styles.height} x={x} y={y} className='space-y-3 max-sm:static'>
				<h2 className='text-secondary text-sm'>文章分类</h2>

				{mainCategories.length > 0 ? (
					<div className='space-y-3'>
						{mainCategories.map((category) => (
							<div key={category.tag} className='space-y-2'>
								{/* 分类标题 */}
								<div className='flex items-center justify-between'>
									<Link
										href={`/categories/${encodeURIComponent(category.tag)}`}
										className='text-xs font-medium text-gray-700 hover:text-brand transition-colors'>
										#{category.tag}
									</Link>
									<span className='text-secondary text-xs'>
										{category.count}
									</span>
								</div>

								{/* 文章列表 - 时间轴风格 */}
								<div className='space-y-2 ml-2'>
									{category.articles.map((article, index) => {
										const hasRead = isRead(article.slug)
										return (
											<div key={article.slug} className='group relative flex items-start gap-2'>
												{/* 时间轴 */}
												<div className='relative flex flex-col items-center mt-1'>
													{/* 连接线 */}
													{index < category.articles.length - 1 && (
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
														<div className='flex items-start justify-between gap-2'>
															<div className='flex-1 min-w-0'>
																<div className='text-xs font-medium line-clamp-1'>
																	{article.title || article.slug}
																	{hasRead && <span className='text-secondary ml-1 text-xs'>[已阅读]</span>}
																</div>
																<div className='text-secondary text-xs'>
																	{dayjs(article.date).format('MM-DD')}
																</div>
															</div>
														</div>
													</Link>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						))}
						
						{/* 查看所有分类链接 */}
						<Link
							href='/categories'
							className='text-brand inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80 mt-2'>
							查看所有分类 →
						</Link>
					</div>
				) : (
					<div className='flex h-[60px] items-center justify-center'>
						<span className='text-secondary text-xs'>暂无分类</span>
					</div>
				)}
			</Card>
		</HomeDraggableLayer>
	)
}
