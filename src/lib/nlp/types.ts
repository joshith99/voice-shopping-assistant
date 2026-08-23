export type Intent = 'add' | 'remove' | 'change' | 'search' | 'clear' | 'unknown';

export interface Quantity {
	value: number;
	unit: string;
}

export interface Filter {
	brand?: string;
	size?: string;
	minPrice?: number;
	maxPrice?: number;
}

export interface Command {
	intent: Intent;
	item?: string;
	quantity?: Quantity;
	filter?: Filter;
	text: string;
}
