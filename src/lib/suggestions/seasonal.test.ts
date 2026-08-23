import { describe, expect, it } from 'vitest';
import { onSaleItems, seasonalItems } from './seasonal';
import { CATALOG } from '$lib/catalog/seed';

describe('seasonalItems', () => {
	it('returns summer items in July', () => {
		const names = seasonalItems(CATALOG, 7).map((item) => item.name);
		expect(names).toContain('watermelon');
		expect(names).toContain('mango');
		expect(names).not.toContain('strawberry');
	});

	it('returns winter items in January', () => {
		const names = seasonalItems(CATALOG, 1).map((item) => item.name);
		expect(names).toContain('carrot');
		expect(names).toContain('orange');
	});
});

describe('onSaleItems', () => {
	it('returns only items on sale', () => {
		const items = onSaleItems(CATALOG);
		expect(items.length).toBeGreaterThan(0);
		expect(items.every((item) => item.onSale)).toBe(true);
	});
});
