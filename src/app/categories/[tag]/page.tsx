'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useMemo } from 'react'
import { ANIMATION_DELAY, INIT_DELAY } from '@/consts'
import dayjs from 'dayjs'
import ShortLineSVG from '@/svgs/short-line.svg'
import { useReadArticles } from '@/hooks/use-read-articles'
import { notFound } from 'next/navigation'

interface Props {
	params: {
		tag: string
	}
}

export default function CategoryDetailPage({ params }: Props) {
	const { items, loading } = useBlogIndex()
	const { isRead } = useReadArticles()
	
	// 解码标签参数
	const tag = decodeURIComponent(params.tag)
	
	// 筛选出包含该标签的文章
	const filteredItems = useMemo(() => {
		return items.filter(item => 
			item.tags && item.tags.includes(tag)
		).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	}, [items, tag])

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24">
				<div className="text-secondary py-6 text-center text-sm">加载中...</div>
			</div>
		)
	}

	// 如果没有找到该标签的文章，返回404
	if (filteredItems.length === 0) {
		notFound()
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6 px-6 pt-24 max-sm:pt-24">
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				className="card relative mx-auto flex items-center gap-1 rounded-xl p-1">
				<div className="rounded-lg bg-brand px-4 py-1.5 text-xs font-medium text-white shadow-sm">
					分类: #{tag}
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				transition={{ delay: INIT_DELAY / 2 }}
				className="card relative w-full max-w-[840px] space-y-6">
				<div className="mb-3 flex items-center justify-between gap-3 text-base">
					<div className="flex items-center gap-3">
						<div className="font-medium">#{tag}</div>
						<div className="h-2 w-2 rounded-full bg-[#D9D9D9]"></div>
						<div className="text-secondary text-sm">{filteredItems.length} 篇文章</div>
					</div>
					<Link
						href="/categories"
						className="text-secondary text-sm hover:text-brand transition-colors">
						← 所有分类
					</Link>
				</div>
				
				<div>
					{filteredItems.map((item, index) => {
						const hasRead = isRead(item.slug)
						return (
							<motion.div
								key={item.slug}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								transition={{ delay: INIT_DELAY / 2 + index * 0.05 }}>
								<Link
									href={`/blog/${item.slug}`}
									className="group flex min-h-10 items-center gap-3 py-3 transition-all cursor-pointer hover:bg-white/60 rounded-lg px-2">
									<span className="text-secondary w-[44px] shrink-0 text-sm font-medium">
										{dayjs(item.date).format('MM-DD')}
									</span>
									
									<div className="relative flex h-2 w-2 items-center justify-center">
										<div className="bg-secondary group-hover:bg-brand h-[5px] w-[5px] rounded-full transition-all group-hover:h-4"></div>
										<ShortLineSVG className="absolute bottom-4" />
									</div>
									
									<div className="flex-1 truncate text-sm font-medium transition-all group-hover:text-brand group-hover:translate-x-2">
										{item.title || item.slug}
										{hasRead && <span className="text-secondary ml-2 text-xs">[已阅读]</span>}
									</div>
									
									<div className="flex flex-wrap items-center gap-2 max-sm:hidden">
										{item.tags?.map(t => (
											<Link
												key={t}
												href={`/categories/${encodeURIComponent(t)}`}
												onClick={(e) => e.stopPropagation()}
												className="text-secondary text-sm hover:text-brand transition-colors">
												#{t}
											</Link>
										))}
									</div>
								</Link>
							</motion.div>
						)
					})}
				</div>
			</motion.div>
		</div>
	)
}