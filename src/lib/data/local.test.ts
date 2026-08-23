import { describe, expect, it } from 'vitest';
import { createLocalData, type StorageLike } from './local';
import type { ListItem } from './types';

function memoryStorage(): StorageLike {
	const map = new Map<string, string>();
	return {
		getItem: (k) => map.get(k) ?? null,
		setItem: (k, v) => void map.set(k, v)
	};
}

const item: ListItem = {
	id: '1',
	name: 'milk',
	category: 'dairy',
	quantity: 2,
	unit: 'bottle',
	checked: false
};

describe('local data', () => {
	it('round-trips the list', async () => {
		const data = createLocalData(memoryStorage());
		await data.saveList([item]);
		expect(await data.getList()).toEqual([item]);
	});

	it('returns an empty list before anything is saved', async () => {
		const data = createLocalData(memoryStorage());
		expect(await data.getList()).toEqual([]);
	});

	it('appends history entries in order', async () => {
		const data = createLocalData(memoryStorage());
		await data.addToHistory('milk', 'dairy');
		await data.addToHistory('bread', 'bakery');
		const history = await data.getHistory();
		expect(history).toHaveLength(2);
		expect(history[0].name).toBe('milk');
		expect(history[1].category).toBe('bakery');
	});

	it('stores and reads settings', () => {
		const data = createLocalData(memoryStorage());
		data.setSetting('deepgramKey', 'abc123');
		expect(data.getSetting('deepgramKey')).toBe('abc123');
		expect(data.getSetting('missing')).toBeNull();
	});
});
