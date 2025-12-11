import type { BlogIndexItem } from '@/hooks/use-blog-index'
import categoryConfig from '@/app/categories/category-config.json'

const FALLBACK_CATEGORY = '未分类'

export function resolveCategoryName(item: BlogIndexItem): string {
	const raw = item.category?.trim()
	if (raw) return raw

	if (item.tags && item.tags.length > 0) {
		const match = categoryConfig.specialCategories.find(cat =>
			item.tags!.some(tag =>
				cat.tags.some(catTag => tag.toLowerCase().includes(catTag.toLowerCase()) || catTag.toLowerCase().includes(tag.toLowerCase()))
			)
		)
		if (match) return match.name
	}

	return FALLBACK_CATEGORY
}

export function getCategoryMeta(name: string) {
	const normalized = name.trim().toLowerCase()
	return categoryConfig.specialCategories.find(cat => cat.name.toLowerCase() === normalized)
}
