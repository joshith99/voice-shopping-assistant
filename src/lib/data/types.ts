export interface ListItem {
	id: string;
	name: string;
	category: string;
	quantity: number;
	unit: string;
	checked: boolean;
}

export interface HistoryEntry {
	name: string;
	category: string;
	purchasedAt: string;
}

export interface Data {
	getList(): Promise<ListItem[]>;
	saveList(items: ListItem[]): Promise<void>;
	addToHistory(name: string, category: string, purchasedAt?: string): Promise<void>;
	getHistory(): Promise<HistoryEntry[]>;
	getSetting(key: string): string | null;
	setSetting(key: string, value: string): void;
}
