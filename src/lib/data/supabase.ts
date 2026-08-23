import { createClient } from '@supabase/supabase-js';
import type { Data, HistoryEntry, ListItem } from './types';

const SETTING_PREFIX = 'vsa:setting:';

export function createSupabaseData(url: string, anonKey: string): Data {
	const client = createClient(url, anonKey, { auth: { persistSession: true } });
	let authReady: Promise<void> | null = null;

	const ensureAuth = (): Promise<void> => {
		authReady ??= (async () => {
			const { data } = await client.auth.getSession();
			if (!data.session) {
				await client.auth.signInAnonymously();
			}
		})().catch(() => undefined);
		return authReady;
	};

	const getList = async (): Promise<ListItem[]> => {
		await ensureAuth();
		const { data, error } = await client
			.from('list_items')
			.select('id, name, category, quantity, unit, checked')
			.order('created_at');
		if (error) return [];
		return (data ?? []).map((row) => ({
			id: row.id,
			name: row.name,
			category: row.category,
			quantity: row.quantity,
			unit: row.unit,
			checked: row.checked
		}));
	};

	const saveList = async (items: ListItem[]): Promise<void> => {
		await ensureAuth();
		await client.from('list_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
		if (items.length === 0) return;
		await client.from('list_items').insert(
			items.map((item) => ({
				id: item.id,
				name: item.name,
				category: item.category,
				quantity: item.quantity,
				unit: item.unit,
				checked: item.checked
			}))
		);
	};

	const addToHistory = async (
		name: string,
		category: string,
		purchasedAt?: string
	): Promise<void> => {
		await ensureAuth();
		await client
			.from('purchase_history')
			.insert({ name, category, purchased_at: purchasedAt ?? new Date().toISOString() });
	};

	const getHistory = async (): Promise<HistoryEntry[]> => {
		await ensureAuth();
		const { data, error } = await client
			.from('purchase_history')
			.select('name, category, purchased_at')
			.order('purchased_at', { ascending: true });
		if (error) return [];
		return (data ?? []).map((row) => ({
			name: row.name,
			category: row.category,
			purchasedAt: row.purchased_at
		}));
	};

	const getSetting = (key: string): string | null => localStorage.getItem(SETTING_PREFIX + key);
	const setSetting = (key: string, value: string): void => {
		localStorage.setItem(SETTING_PREFIX + key, value);
	};

	return { getList, saveList, addToHistory, getHistory, getSetting, setSetting };
}
