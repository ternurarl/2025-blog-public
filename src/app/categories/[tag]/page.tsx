'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useMemo, useState } from 'react'
import { INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useReadArticles } from '@/hooks/use-read-articles'
import { resolveCategoryName, getCategoryMeta } from '@/lib/category-utils'

dayjs.extend(weekOfYear)

type DisplayMode = 'day' | 'week' | 'month' | 'year'

interface Props {
	params: {
		tag: string
	}
}

const FALLBACK_COLOR = 'var(--color-brand)'
const cardClass =
	'relative w-full max-w-[840px] rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-[0_45px_120px_-60px_rgba(15,23,42,0.65)] backdrop-blur'

export default function CategoryDetailPage({ params }: Props) {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()
	const decodedTag = decodeURIComponent(params.tag || '')
	const normalizedTag = decodedTag.trim().toLowerCase()
	const [displayMode, setDisplayMode] = useState<DisplayMode>('year')

	const specialCategory = getCategoryMeta(decodedTag)

	const filteredItems = useMemo(() => {
		return items
			.filter(item => {
				const normalizedCategory = resolveCategoryName(item).trim().toLowerCase()
				if (normalizedCategory) return normalizedCategory === normalizedTag
				return normalizedTag === '未分类'
			})
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [items, normalizedTag, specialCategory])

	const grouped = useMemo(() => {
		const groupedItems = filteredItems.reduce(
			(acc, item) => {
				const date = dayjs(item.date)
				let key: string
				let label: string
				switch (displayMode) {
					case 'day':
						key = date.format('YYYY-MM-DD')
						label = date.format('YYYY年MM月DD日')
						break
					case 'week':
						const week = date.week()
						key = `${date.format('YYYY')}-W${week.toString().padStart(2, '0')}`
						label = `${date.format('YYYY')}年第${week}周`
						break
					case 'month':
						key = date.format('YYYY-MM')
						label = date.format('YYYY年MM月')
						break
					case 'year':
					default:
						key = date.format('YYYY')
						label = `${key}年`
						break
				}
				if (!acc[key]) acc[key] = { label, items: [] }
				acc[key].items.push(item)
				return acc
			},
			{} as Record<string, { label: string; items: typeof filteredItems }>
		)

		const keys = Object.keys(groupedItems).sort((a, b) => {
			if (displayMode === 'week') {
				const [yearA, weekA] = a.split('-W').map(Number)
				const [yearB, weekB] = b.split('-W').map(Number)
				if (yearA !== yearB) return yearB - yearA
				return weekB - weekA
			}
			return b.localeCompare(a)
		})

		return { groupedItems, groupKeys: keys }
	}, [filteredItems, displayMode])

	const categoryName = specialCategory?.name || decodedTag
	const categoryColor = specialCategory?.color || FALLBACK_COLOR
	const categoryDescription = specialCategory?.description || '该分类下的文章导航'

	return (
		<div className='flex flex-col items-center gap-6 px-6 pb-24 pt-24 max-sm:pt-24'>
			<div className='flex w-full max-w-[840px] flex-col gap-6'>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					className={`${cardClass} space-y-4`}>
					<div className='flex flex-wrap items-center justify-between gap-3'>
						<div className='flex flex-wrap items-center gap-3 text-lg font-semibold'>
							<span className='h-2.5 w-2.5 rounded-full' style={{ background: categoryColor }} />
							<span>{categoryName}</span>
							<span className='text-secondary text-sm font-normal'>{filteredItems.length} 篇文章</span>
						</div>
						<Link href='/categories' className='text-sm text-secondary transition-colors hover:text-brand'>
							← 返回分类
						</Link>
					</div>
					<p className='text-secondary text-sm'>{categoryDescription}</p>
				</motion.div>

				{filteredItems.length > 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='relative flex gap-2 rounded-[24px] border border-white/60 bg-white/80 p-3 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.6)] backdrop-blur max-sm:flex-wrap'>
						{(['day', 'week', 'month', 'year'] as DisplayMode[]).map(mode => (
							<motion.button
								key={mode}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setDisplayMode(mode)}
								className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
									displayMode === mode ? 'bg-brand text-white shadow-sm' : 'text-secondary hover:text-brand hover:bg-white/60'
								}`}>
								{mode === 'day' ? '日' : mode === 'week' ? '周' : mode === 'month' ? '月' : '年'}
							</motion.button>
						))}
					</motion.div>
				)}
			</div>

			{loading && <div className='text-secondary py-6 text-center text-sm'>加载中...</div>}

			{!loading && filteredItems.length === 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					className={`${cardClass} py-8 text-center text-secondary`}>
					该分类暂无文章
				</motion.div>
			)}

			{grouped.groupKeys.map(groupKey => {
				const group = grouped.groupedItems[groupKey]
				if (!group) return null
				return (
					<motion.div
						key={groupKey}
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						transition={{ delay: INIT_DELAY / 2 }}
					className={`${cardClass} space-y-4`}>
						<div className='mb-2 flex items-center gap-3'>
							<div className='font-medium'>{group.label}</div>
							<div className='h-2 w-2 rounded-full bg-[#D9D9D9]' />
							<div className='text-secondary text-sm'>{group.items.length} 篇</div>
						</div>

						<div className='space-y-2'>
							{group.items.map(article => {
								const hasRead = isRead(article.slug)
								return (
									<Link
										key={article.slug}
										href={`/blog/${article.slug}`}
										className='group flex min-h-10 items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:bg-white/70'>
										<span className='text-secondary w-[44px] shrink-0 text-sm font-medium'>{dayjs(article.date).format('MM-DD')}</span>

										<div className='relative flex h-2 w-2 items-center justify-center'>
											<div className='bg-secondary group-hover:bg-brand h-[5px] w-[5px] rounded-full transition-all group-hover:h-4' />
											<ShortLineSVG className='absolute bottom-4' />
										</div>

										<div className='flex-1 truncate text-sm font-medium transition-all group-hover:translate-x-1.5 group-hover:text-brand'>
											{article.title || article.slug}
											{hasRead && <span className='text-secondary ml-2 text-xs'>[已阅读]</span>}
										</div>

										<div className='flex flex-wrap items-center gap-2 max-sm:hidden'>
											{(article.tags || []).slice(0, 4).map(tag => (
												<Link
													key={tag}
													href={`/categories/${encodeURIComponent(tag)}`}
													onClick={event => event.stopPropagation()}
													className='text-secondary text-sm transition-colors hover:text-brand'>
													#{tag}
												</Link>
											))}
										</div>
									</Link>
								)
							})}
						</div>
					</motion.div>
				)
			})}
		</div>
	)
}
