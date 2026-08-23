import { createLocalData } from './local';
import { createSupabaseData } from './supabase';
import type { Data } from './types';

export interface DataEnv {
	supabaseUrl?: string;
	supabaseAnonKey?: string;
}

export function createData(env: DataEnv): Data {
	if (env.supabaseUrl && env.supabaseAnonKey) {
		return createSupabaseData(env.supabaseUrl, env.supabaseAnonKey);
	}
	return createLocalData();
}

export type { Data, HistoryEntry, ListItem } from './types';
