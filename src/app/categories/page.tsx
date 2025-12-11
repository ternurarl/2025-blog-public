'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useState, useMemo } from 'react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useReadArticles } from '@/hooks/use-read-articles'
import categoryConfig from './category-config.json'

interface SpecialCategory {
	name: string
	tags: string[]
	description: string
	icon: string
	color: string
	articles: any[]
	count: number
	latestDate: string
}

export default function CategoriesPage() {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()

	// 根据特殊分类配置来组织文章
	const specialCategories = useMemo(() => {
		const categories: SpecialCategory[] = categoryConfig.specialCategories.map(config => ({
			...config,
			articles: [],
			count: 0,
			latestDate: ''
		}))

		// 将文章分配到各个特殊分类
		items.forEach(item => {
			if (item.tags && item.tags.length > 0) {
				categories.forEach(category => {
					// 检查文章标签是否与分类的标签匹配
					const hasMatchingTag = item.tags.some(tag => 
						category.tags.some(catTag => 
							tag.toLowerCase().includes(catTag.toLowerCase()) || 
							catTag.toLowerCase().includes(tag.toLowerCase())
						)
					)
					
					if (hasMatchingTag) {
						category.articles.push(item)
					}
				})
			}
		})

		// 对每个分类的文章按日期排序并获取统计信息
		categories.forEach(category => {
			category.articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			category.count = category.articles.length
			category.latestDate = category.articles[0]?.date || ''
		})

		// 只返回有文章的分类，并按文章数量排序
		return categories
			.filter(category => category.count > 0)
			.sort((a, b) => b.count - a.count)
	}, [items])

	// 获取未分类的文章（不属于任何特殊分类的文章）
	const uncategorizedArticles = useMemo(() => {
		const categorizedArticleIds = new Set(
			categoryConfig.specialCategories.flatMap(cat => 
				items.filter(item => 
					item.tags && item.tags.some(tag => 
						cat.tags.some(catTag => 
							tag.toLowerCase().includes(catTag.toLowerCase()) || 
							catTag.toLowerCase().includes(tag.toLowerCase())
						)
					)
				).map(item => item.slug)
			)
		)

		return items
			.filter(item => !categorizedArticleIds.has(item.slug))
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [items])

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

			{specialCategories.length === 0 && uncategorizedArticles.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY / 2 }}
					className="card relative w-full max-w-[840px] space-y-6">
					<div className="text-secondary py-6 text-center text-sm">暂无文章</div>
				</motion.div>
			) : (
				<div className="w-full max-w-[840px] space-y-6">
					{/* 特殊分类 */}
					{specialCategories.map((category, index) => (
						<motion.div
							key={category.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: INIT_DELAY / 2 + index * 0.1 }}
							className="card relative w-full space-y-4">
							{/* 分类标题 */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<span className="text-2xl">{category.icon}</span>
									<div className="font-medium" style={{ color: category.color }}>{category.name}</div>
									<div className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
									<div className="text-secondary text-sm">{category.count} 篇文章</div>
								</div>
								<Link
									href={`/categories/${encodeURIComponent(category.name)}`}
									className="text-brand text-sm hover:opacity-80 transition-opacity">
									查看更多 →
								</Link>
							</div>

							{/* 分类描述 */}
							<p className="text-secondary text-sm">{category.description}</p>

							{/* 文章列表 - 时间轴设计 */}
							<div className="space-y-3">
								{category.articles.slice(0, 5).map((article, articleIndex) => {
									const hasRead = isRead(article.slug)
									return (
										<motion.div
											key={article.slug}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ delay: INIT_DELAY / 2 + articleIndex * 0.05 }}>
											<Link
												href={`/blog/${article.slug}`}
												className="group flex min-h-10 items-center gap-3 py-3 transition-all cursor-pointer hover:bg-white/60 rounded-lg px-2">
												{/* 左侧日期 */}
												<span className="text-secondary w-[44px] shrink-0 text-sm font-medium">
													{dayjs(article.date).format('MM-DD')}
												</span>
												
												{/* 中间时间轴 */}
												<div className="relative flex h-2 w-2 items-center justify-center">
													<div className="bg-secondary group-hover:bg-brand h-[5px] w-[5px] rounded-full transition-all group-hover:h-4"></div>
													<ShortLineSVG className="absolute bottom-4" />
												</div>
												
												{/* 右侧内容 */}
												<div className="flex-1 truncate text-sm font-medium transition-all group-hover:text-brand group-hover:translate-x-2">
													{article.title || article.slug}
													{hasRead && <span className="text-secondary ml-2 text-xs">[已阅读]</span>}
												</div>
												
												{/* 标签 */}
												<div className="flex flex-wrap items-center gap-2 max-sm:hidden">
													{article.tags?.slice(0, 3).map((t: string) => (
														<span key={t} className="text-secondary text-xs">
															#{t}
														</span>
													))}
												</div>
											</Link>
										</motion.div>
									)
								})}
							</div>
						</motion.div>
					))}

					{/* 未分类文章 */}
					{uncategorizedArticles.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: INIT_DELAY / 2 + specialCategories.length * 0.1 }}
							className="card relative w-full space-y-4">
							{/* 分类标题 */}
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<span className="text-2xl">📦</span>
									<div className="font-medium text-gray-600">其他文章</div>
									<div className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
									<div className="text-secondary text-sm">{uncategorizedArticles.length} 篇文章</div>
								</div>
							</div>

							<p className="text-secondary text-sm">未分类的文章</p>

							{/* 文章列表 - 时间轴设计 */}
							<div className="space-y-3">
								{uncategorizedArticles.slice(0, 5).map((article, index) => {
									const hasRead = isRead(article.slug)
									return (
										<motion.div
											key={article.slug}
											initial={{ opacity: 0, x: -20 }}
											whileInView={{ opacity: 1, x: 0 }}
											transition={{ delay: INIT_DELAY / 2 + index * 0.05 }}>
											<Link
												href={`/blog/${article.slug}`}
												className="group flex min-h-10 items-center gap-3 py-3 transition-all cursor-pointer hover:bg-white/60 rounded-lg px-2">
												{/* 左侧日期 */}
												<span className="text-secondary w-[44px] shrink-0 text-sm font-medium">
													{dayjs(article.date).format('MM-DD')}
												</span>
												
												{/* 中间时间轴 */}
												<div className="relative flex h-2 w-2 items-center justify-center">
													<div className="bg-secondary group-hover:bg-brand h-[5px] w-[5px] rounded-full transition-all group-hover:h-4"></div>
													<ShortLineSVG className="absolute bottom-4" />
												</div>
												
												{/* 右侧内容 */}
												<div className="flex-1 truncate text-sm font-medium transition-all group-hover:text-brand group-hover:translate-x-2">
													{article.title || article.slug}
													{hasRead && <span className="text-secondary ml-2 text-xs">[已阅读]</span>}
												</div>
												
												{/* 标签 */}
												<div className="flex flex-wrap items-center gap-2 max-sm:hidden">
													{article.tags?.slice(0, 3).map((t: string) => (
														<span key={t} className="text-secondary text-xs">
															#{t}
														</span>
													))}
												</div>
											</Link>
										</motion.div>
									)
								})}
							</div>
						</motion.div>
					)}
				</div>
			)}
		</div>
	)
}