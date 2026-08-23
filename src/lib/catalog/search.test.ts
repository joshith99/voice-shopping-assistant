import { describe, expect, it } from 'vitest';
import { searchCatalog } from './search';
import { CATALOG } from '$lib/catalog/seed';

describe('searchCatalog', () => {
	it('matches by name', () => {
		expect(searchCatalog(CATALOG, 'milk').some((i) => i.name === 'milk')).toBe(true);
	});

	it('filters by maximum price', () => {
		const result = searchCatalog(CATALOG, 'toothpaste', { maxPrice: 5 });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((i) => i.price <= 5)).toBe(true);
	});

	it('filters by brand', () => {
		const result = searchCatalog(CATALOG, '', { brand: 'amul' });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((i) => i.brand.toLowerCase().includes('amul'))).toBe(true);
	});

	it('returns an empty array when nothing matches', () => {
		expect(searchCatalog(CATALOG, 'zzzqqq')).toEqual([]);
	});
});
