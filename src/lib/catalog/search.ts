import type { CatalogItem } from './seed';
import type { Filter } from '$lib/nlp/types';

export function searchCatalog(
	catalog: CatalogItem[],
	query: string,
	filter: Filter = {}
): CatalogItem[] {
	const q = query.toLowerCase();
	return catalog.filter((item) => {
		const matchesQuery =
			!q || item.name.toLowerCase().includes(q) || item.brand.toLowerCase().includes(q);
		const matchesBrand =
			!filter.brand || item.brand.toLowerCase().includes(filter.brand.toLowerCase());
		const matchesSize = !filter.size || item.size.toLowerCase().includes(filter.size.toLowerCase());
		const matchesMin = filter.minPrice === undefined || item.price >= filter.minPrice;
		const matchesMax = filter.maxPrice === undefined || item.price <= filter.maxPrice;
		return matchesQuery && matchesBrand && matchesSize && matchesMin && matchesMax;
	});
}
