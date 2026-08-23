import { describe, expect, it } from 'vitest';
import { runningLow } from './history';
import type { HistoryEntry } from '$lib/data/types';

function entry(name: string, category: string, daysAgo: number): HistoryEntry {
	return {
		name,
		category,
		purchasedAt: new Date(Date.now() - daysAgo * 86400000).toISOString()
	};
}

describe('runningLow', () => {
	it('flags items past their category cadence', () => {
		const history = [entry('milk', 'dairy', 10), entry('bread', 'bakery', 3)];
		const names = runningLow(history, new Date()).map((r) => r.name);
		expect(names).toContain('milk');
		expect(names).not.toContain('bread');
	});

	it('uses only the most recent purchase per item', () => {
		const history = [entry('milk', 'dairy', 20), entry('milk', 'dairy', 2)];
		expect(runningLow(history, new Date()).map((r) => r.name)).not.toContain('milk');
	});

	it('sorts by days since purchase, most overdue first', () => {
		const history = [entry('milk', 'dairy', 12), entry('toothpaste', 'household', 40)];
		const result = runningLow(history, new Date());
		expect(result[0].name).toBe('toothpaste');
	});
});
