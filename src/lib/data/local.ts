import type { Data, HistoryEntry, ListItem } from './types';

export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

const LIST_KEY = 'vsa:list';
const HISTORY_KEY = 'vsa:history';
const SETTING_PREFIX = 'vsa:setting:';

function memoryStore(): StorageLike {
	const map = new Map<string, string>();
	return {
		getItem: (key) => map.get(key) ?? null,
		setItem: (key, value) => void map.set(key, value)
	};
}

function defaultStore(): StorageLike {
	if (typeof globalThis.localStorage !== 'undefined') {
		return globalThis.localStorage;
	}
	return memoryStore();
}

export function createLocalData(storage?: StorageLike): Data {
	const store = storage ?? defaultStore();

	const getList = async (): Promise<ListItem[]> => {
		const raw = store.getItem(LIST_KEY);
		return raw ? (JSON.parse(raw) as ListItem[]) : [];
	};

	const saveList = async (items: ListItem[]): Promise<void> => {
		store.setItem(LIST_KEY, JSON.stringify(items));
	};

	const getHistory = async (): Promise<HistoryEntry[]> => {
		const raw = store.getItem(HISTORY_KEY);
		return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
	};

	const addToHistory = async (
		name: string,
		category: string,
		purchasedAt?: string
	): Promise<void> => {
		const history = await getHistory();
		history.push({ name, category, purchasedAt: purchasedAt ?? new Date().toISOString() });
		store.setItem(HISTORY_KEY, JSON.stringify(history));
	};

	const getSetting = (key: string): string | null => store.getItem(SETTING_PREFIX + key);

	const setSetting = (key: string, value: string): void => {
		store.setItem(SETTING_PREFIX + key, value);
	};

	return { getList, saveList, addToHistory, getHistory, getSetting, setSetting };
}
