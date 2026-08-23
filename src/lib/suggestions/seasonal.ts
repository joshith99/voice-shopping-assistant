import type { CatalogItem } from '$lib/catalog/seed';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export function seasonFor(month: number): Season {
	if (month >= 3 && month <= 5) return 'spring';
	if (month >= 6 && month <= 8) return 'summer';
	if (month >= 9 && month <= 11) return 'autumn';
	return 'winter';
}

export function seasonalItems(catalog: CatalogItem[], month: number): CatalogItem[] {
	const season = seasonFor(month);
	return catalog.filter((item) => item.season === season);
}

export function onSaleItems(catalog: CatalogItem[]): CatalogItem[] {
	return catalog.filter((item) => item.onSale);
}
