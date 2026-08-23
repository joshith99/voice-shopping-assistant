import type { HistoryEntry } from '$lib/data/types';

export interface RunningLow {
	name: string;
	category: string;
	daysSince: number;
}

const CADENCE_DAYS: Record<string, number> = {
	dairy: 7,
	produce: 5,
	bakery: 7,
	meat: 7,
	seafood: 5,
	snacks: 14,
	beverages: 14,
	household: 30,
	other: 21
};

const DAY_MS = 86400000;

export function runningLow(history: HistoryEntry[], now = new Date()): RunningLow[] {
	const last = new Map<string, HistoryEntry>();
	for (const entry of history) {
		const previous = last.get(entry.name);
		if (!previous || entry.purchasedAt > previous.purchasedAt) last.set(entry.name, entry);
	}

	const result: RunningLow[] = [];
	for (const entry of last.values()) {
		const cadence = CADENCE_DAYS[entry.category] ?? 21;
		const daysSince = (now.getTime() - new Date(entry.purchasedAt).getTime()) / DAY_MS;
		if (daysSince > cadence) {
			result.push({ name: entry.name, category: entry.category, daysSince: Math.round(daysSince) });
		}
	}
	return result.sort((a, b) => b.daysSince - a.daysSince);
}
