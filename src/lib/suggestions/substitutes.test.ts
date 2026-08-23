import { describe, expect, it } from 'vitest';
import { substitutesFor } from './substitutes';
import { SUBSTITUTES } from '$lib/catalog/seed';

describe('substitutesFor', () => {
	it('returns alternatives for listed items', () => {
		expect(substitutesFor(['milk'], SUBSTITUTES)).toContain('almond milk');
	});

	it('excludes substitutes already on the list', () => {
		const result = substitutesFor(['milk', 'almond milk'], SUBSTITUTES);
		expect(result).not.toContain('almond milk');
	});

	it('returns an empty array for items with no substitutes', () => {
		expect(substitutesFor(['bread'], SUBSTITUTES)).toEqual([]);
	});
});
