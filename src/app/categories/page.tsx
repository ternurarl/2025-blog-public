'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex, type BlogIndexItem } from '@/hooks/use-blog-index'
import { useMemo } from 'react'
import { INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import { useReadArticles } from '@/hooks/use-read-articles'
import categoryConfig from './category-config.json'

interface SpecialCategory {
	name: string
	tags: string[]
	description: string
	icon: string
	color: string
	articles: BlogIndexItem[]
	count: number
	latestDate: string
}

interface CategoryCard extends SpecialCategory {
	href: string
	previewArticles: BlogIndexItem[]
}

export default function CategoriesPage() {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()

	const specialCategories = useMemo<SpecialCategory[]>(() => {
		const categories: SpecialCategory[] = categoryConfig.specialCategories.map(config => ({
			...config,
			articles: [],
			count: 0,
			latestDate: ''
		}))

		items.forEach(item => {
			if (!item.tags || item.tags.length === 0) return

			categories.forEach(category => {
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
		})

		categories.forEach(category => {
			category.articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			category.count = category.articles.length
			category.latestDate = category.articles[0]?.date || ''
		})

		return categories.filter(category => category.count > 0).sort((a, b) => b.count - a.count)
	}, [items])

	const categorizedSlugs = useMemo(() => {
		return new Set<string>(
			specialCategories.flatMap(category => category.articles.map(article => article.slug))
		)
	}, [specialCategories])

	const uncategorizedArticles = useMemo(() => {
		return items
			.filter(item => !categorizedSlugs.has(item.slug))
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [items, categorizedSlugs])

	const categoryCards = useMemo<CategoryCard[]>(() => {
		const cards = specialCategories.map<CategoryCard>(category => ({
			...category,
			href: `/categories/${encodeURIComponent(category.name)}`,
			previewArticles: category.articles.slice(0, 5)
		}))

		if (uncategorizedArticles.length > 0) {
			cards.push({
				name: '其他文章',
				tags: [],
				description: '未归类的最新文章',
				icon: '??',
				color: '#94a3b8',
				articles: uncategorizedArticles,
				count: uncategorizedArticles.length,
				latestDate: uncategorizedArticles[0]?.date || '',
				href: '/blog',
				previewArticles: uncategorizedArticles.slice(0, 5)
			})
		}

		return cards
	}, [specialCategories, uncategorizedArticles])

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24'>
				<div className='text-secondary py-6 text-center text-sm'>加载中...</div>
			</div>
		)
	}

	return (
		<div className='relative mx-auto flex w-full max-w-[1080px] flex-col gap-10 px-6 pb-24 pt-24 max-sm:px-4 max-sm:pt-24'>
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-4 top-16 -z-10 h-[360px] rounded-[200px] bg-[radial-gradient(circle_at_top,_rgba(79,209,197,0.28),_transparent_70%)] blur-3xl max-sm:inset-x-0 max-sm:rounded-none'
			/>

			<motion.div
				initial={{ opacity: 0, y: 18 }}
				animate={{ opacity: 1, y: 0 }}
				className='mx-auto flex flex-col items-center gap-3 text-center'>
				<span className='rounded-full border border-white/70 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.5em] text-secondary backdrop-blur'>
					Categories
				</span>
				<h1 className='text-3xl font-semibold text-linear max-sm:text-2xl'>精选分类一览</h1>
				<p className='text-secondary text-sm'>
					按主题快速定位最新文章，配合时间线与标签查找你关心的内容。
				</p>
			</motion.div>

			{categoryCards.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY / 2 }}
					className='relative w-full rounded-[32px] border border-white/60 bg-white/80 p-10 text-center text-secondary shadow-[0_40px_120px_-60px_rgba(15,23,42,0.8)] backdrop-blur'>
					暂无文章
				</motion.div>
			) : (
				<div className='w-full space-y-6'>
					{categoryCards.map((category, index) => (
						<motion.section
							key={category.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: INIT_DELAY / 2 + index * 0.08 }}
							className='relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.65)] backdrop-blur max-sm:p-5'>
							<div className='flex flex-wrap items-center justify-between gap-3'>
								<div className='flex flex-wrap items-center gap-3 text-lg font-semibold tracking-wide'>
									<span className='text-2xl'>{category.icon}</span>
									<span style={{ color: category.color }}>{category.name}</span>
									<span className='text-secondary text-sm font-normal'>{category.count} 篇文章</span>
								</div>
								<Link
									href={category.href}
									className='text-sm font-medium text-brand transition-opacity hover:opacity-80'>
									查看更多...
								</Link>
							</div>

							<div className='mt-4 space-y-1.5'>
								{category.previewArticles.map((article, articleIndex) => {
									const hasRead = isRead(article.slug)
									const accentColor = category.color || 'var(--color-brand)'

									return (
										<Link
											key={article.slug}
											href={`/blog/${article.slug}`}
											className='group relative flex flex-wrap items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:-translate-y-[1px] hover:bg-white/80'>
											<div className='relative flex w-6 justify-center'>
												<span
													className='mt-1 h-2 w-2 rounded-full border border-white transition-transform group-hover:scale-110'
													style={{ background: accentColor }}
												/>
												{articleIndex < category.previewArticles.length - 1 && (
													<span
														className='absolute left-1/2 top-4 -z-10 w-px -translate-x-1/2'
														style={{
															bottom: '-0.75rem',
															background: `linear-gradient(to bottom, ${accentColor}, transparent)`
														}}
													/>
												)}
											</div>

											<span className='text-secondary w-14 shrink-0 text-right text-sm font-semibold'>
												{dayjs(article.date).format('MM-DD')}
											</span>

											<div className='flex-1 text-sm font-medium text-slate-800 transition-all group-hover:text-brand'>
												<span className='line-clamp-1'>{article.title || article.slug}</span>
												{hasRead && <span className='text-secondary ml-2 text-xs'>[已阅读]</span>}
											</div>

											<div className='flex flex-wrap items-center gap-2 text-xs font-medium text-secondary max-sm:w-full max-sm:justify-start max-sm:pl-10'>
												{article.tags && article.tags.length > 0 ? (
													article.tags.slice(0, 4).map(tag => (
														<span
															key={tag}
															className='rounded-full bg-slate-100/80 px-2 py-0.5 text-[11px] tracking-wide text-secondary transition-colors group-hover:bg-white/80'>
															#{tag}
														</span>
													))
												) : (
													<span className='text-secondary/70 text-[11px]'>#暂无标签</span>
												)}
											</div>
										</Link>
									)
								})}
							</div>
						</motion.section>
					))}
				</div>
			)}
		</div>
	)
}
