'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex, type BlogIndexItem } from '@/hooks/use-blog-index'
import { useMemo } from 'react'
import { INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useReadArticles } from '@/hooks/use-read-articles'
import { notFound } from 'next/navigation'
import categoryConfig from '@/app/categories/category-config.json'

interface Props {
	params: {
		tag: string
	}
}

const FALLBACK_COLOR = 'var(--color-brand)'

export default function CategoryDetailPage({ params }: Props) {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()

	const decodedTag = decodeURIComponent(params.tag || '')
	const normalizedTag = decodedTag.trim().toLowerCase()

	const specialCategory = categoryConfig.specialCategories.find(
		cat => cat.name.toLowerCase() === normalizedTag
	)

	const filteredItems = useMemo(() => {
		return items
			.filter(item => {
				const normalizedCategory = item.category ? item.category.trim().toLowerCase() : ''
				if (normalizedCategory) {
					return normalizedCategory === normalizedTag
				}

				if (!normalizedCategory && normalizedTag === '未分类') {
					return true
				}

				// 兼容旧数据：使用标签匹配
				if (!normalizedCategory && specialCategory && item.tags?.length) {
					return item.tags.some(itemTag =>
						specialCategory.tags.some(catTag =>
							itemTag.toLowerCase().includes(catTag.toLowerCase()) ||
							catTag.toLowerCase().includes(itemTag.toLowerCase())
						)
					)
				}

				return false
			})
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [items, normalizedTag, specialCategory])

	const groupedItems = useMemo(() => {
		const groups = new Map<string, { label: string; items: BlogIndexItem[] }>()

		filteredItems.forEach(article => {
			const key = dayjs(article.date).format('YYYY')
			if (!groups.has(key)) {
				groups.set(key, { label: `${key} 年`, items: [] })
			}
			groups.get(key)!.items.push(article)
		})

		return Array.from(groups.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.map(([key, group]) => ({
				key,
				label: group.label,
				items: group.items
			}))
	}, [filteredItems])

	if (loading) {
		return (
			<div className='flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24'>
				<div className='text-secondary py-6 text-center text-sm'>加载中...</div>
			</div>
		)
	}

	if (filteredItems.length === 0) {
		notFound()
	}

	const categoryName = specialCategory?.name || decodedTag
	const categoryColor = specialCategory?.color || FALLBACK_COLOR
	const categoryDescription = specialCategory?.description || '该分类下的文章导航'

	return (
		<div className='flex flex-col items-center gap-6 px-6 pb-24 pt-24 max-sm:pt-24'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className='card relative mx-auto w-full max-w-[840px] space-y-4 rounded-3xl p-6'>
				<div className='flex items-center justify-between gap-3'>
					<div className='flex items-center gap-3 text-lg font-semibold'>
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

			{groupedItems.map(group => (
				<motion.div
					key={group.key}
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					transition={{ delay: INIT_DELAY / 2 }}
					className='card relative w-full max-w-[840px] space-y-4 rounded-3xl p-6'>
					<div className='mb-2 flex items-center justify-between gap-3 text-base'>
						<div className='flex items-center gap-3'>
							<div className='font-medium'>{group.label}</div>
							<div className='h-2 w-2 rounded-full bg-[#D9D9D9]' />
							<div className='text-secondary text-sm'>{group.items.length} 篇</div>
						</div>
					</div>

					<div className='space-y-2'>
						{group.items.map(article => {
							const hasRead = isRead(article.slug)
							return (
								<Link
									key={article.slug}
									href={`/blog/${article.slug}`}
									className='group flex min-h-10 items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:bg-white/70'>
									<span className='text-secondary w-[44px] shrink-0 text-sm font-medium'>
										{dayjs(article.date).format('MM-DD')}
									</span>

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
			))}
		</div>
	)
}
