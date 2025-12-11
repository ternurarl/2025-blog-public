'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useState, useMemo } from 'react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useReadArticles } from '@/hooks/use-read-articles'

export default function CategoriesPage() {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()

	// 按标签分组文章
	const categorizedItems = useMemo(() => {
		const categories: Record<string, typeof items> = {}
		
		items.forEach(item => {
			if (item.tags && item.tags.length > 0) {
				item.tags.forEach(tag => {
					if (!categories[tag]) {
						categories[tag] = []
					}
					categories[tag].push(item)
				})
			}
		})
		
		// 对每个分类的文章按日期排序
		Object.keys(categories).forEach(tag => {
			categories[tag].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		})
		
		return categories
	}, [items])

	// 获取每个分类的最新文章日期和文章数量
	const categoryStats = useMemo(() => {
		return Object.entries(categorizedItems).map(([tag, articles]) => ({
			tag,
			count: articles.length,
			latestDate: articles[0]?.date || '',
			articles: articles.slice(0, 5) // 只取前5篇文章展示
		})).sort((a, b) => b.count - a.count)
	}, [categorizedItems])

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24">
				<div className="text-secondary py-6 text-center text-sm">加载中...</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24">
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className="card relative mx-auto flex items-center gap-1 rounded-xl p-1">
				<div className="rounded-lg bg-brand px-4 py-1.5 text-xs font-medium text-white shadow-sm">
					文章分类
				</div>
			</motion.div>

			{categoryStats.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY / 2 }}
					className="card relative w-full max-w-[840px] space-y-6">
					<div className="text-secondary py-6 text-center text-sm">暂无分类</div>
				</motion.div>
			) : (
				<div className="w-full max-w-[840px] space-y-6">
					{categoryStats.map((category, index) => (
						<motion.div
							key={category.tag}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: INIT_DELAY / 2 + index * 0.1 }}
							className="card relative w-full space-y-4">
							{/* 分类标题 */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="font-medium">#{category.tag}</div>
									<div className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
									<div className="text-secondary text-sm">{category.count} 篇文章</div>
								</div>
								<Link
									href={`/categories/${encodeURIComponent(category.tag)}`}
									className="text-brand text-sm hover:opacity-80 transition-opacity">
									查看更多 →
								</Link>
							</div>

							{/* 文章列表 - 时间轴设计 */}
							<div className="space-y-3">
								{category.articles.map((article, articleIndex) => {
									const hasRead = isRead(article.slug)
									return (
										<div key={article.slug} className="group relative flex items-start gap-4">
											{/* 左侧日期 */}
											<div className="text-secondary w-16 shrink-0 text-xs">
												{dayjs(article.date).format('MM-DD')}
											</div>

											{/* 中间时间轴 */}
											<div className="relative flex flex-col items-center">
												{/* 连接线 - 除了最后一篇文章 */}
												{articleIndex < category.articles.length - 1 && (
													<div className="absolute top-4 bottom-0 w-px border-l border-dashed border-gray-300"></div>
												)}
												{/* 圆点 */}
												<div className="relative z-10 h-2 w-2 rounded-full bg-gray-300 group-hover:bg-brand transition-colors"></div>
											</div>

											{/* 右侧内容 */}
											<div className="flex-1 min-w-0">
												<Link
													href={`/blog/${article.slug}`}
													className="group-hover:text-brand transition-colors">
													<div className="flex items-start justify-between gap-2">
														<div className="flex-1 min-w-0">
															<h4 className="text-sm font-medium truncate">
																{article.title || article.slug}
																{hasRead && <span className="text-secondary ml-2 text-xs">[已阅读]</span>}
															</h4>
															{article.summary && (
																<p className="text-secondary text-xs mt-1 line-clamp-2">
																	{article.summary}
																</p>
															)}
														</div>
														{/* 标签 */}
														<div className="flex flex-wrap gap-1 shrink-0">
															{article.tags?.map(tag => (
																<span
																	key={tag}
																	className="text-secondary bg-white/60 px-1.5 py-0.5 rounded text-xs">
																	#{tag}
																</span>
															))}
														</div>
													</div>
												</Link>
											</div>
										</div>
									)
								})}
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	)
}