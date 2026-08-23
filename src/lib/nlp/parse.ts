import { getLanguage, type LanguageDef } from './lang';
import type { Command, Filter, Intent, Quantity } from './types';

const ADJECTIVES = new Set([
	'organic',
	'fresh',
	'frozen',
	'whole',
	'skimmed',
	'semi-skimmed',
	'low-fat',
	'canned',
	'gluten-free',
	'sugar-free'
]);

function toNumber(word: string, numberWords: Record<string, number>): number | undefined {
	if (/^\d+$/.test(word)) return Number(word);
	return numberWords[word.toLowerCase()];
}

function singularize(word: string): string {
	if (word.endsWith('ies') && word.length > 3) return word.slice(0, -3) + 'y';
	if (word.endsWith('es') && /(ches|shes|xes|zes|sses)$/.test(word) && word.length > 3) {
		return word.slice(0, -2);
	}
	if (word.endsWith('s') && !/(ss|us|is)$/.test(word) && word.length > 3) {
		return word.slice(0, -1);
	}
	return word;
}

function normalizeItem(raw: string, stopWords: Set<string>): string | undefined {
	const tokens = raw
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 0 && !stopWords.has(w) && !ADJECTIVES.has(w));

	if (tokens.length === 0) return undefined;
	return singularize(tokens.join(' '));
}

function detectIntent(t: string, def: LanguageDef): Intent {
	return def.intents.find(({ pattern }) => pattern.test(t))?.intent ?? 'unknown';
}

function extractPrice(t: string): { filter?: Filter; rest: string } {
	let s = ` ${t} `;
	const filter: Filter = {};

	let m = s.match(/\b(between)\s+\$?\s*(\d+)\s+(and|to)\s+\$?\s*(\d+)/);
	if (m) {
		filter.minPrice = Number(m[2]);
		filter.maxPrice = Number(m[4]);
		s = s.replace(m[0], ' ');
	} else {
		m = s.match(/\b(under|below|less than|cheaper than|at most)\s+\$?\s*(\d+)\s*(dollars|bucks)?/);
		if (m) {
			filter.maxPrice = Number(m[2]);
			s = s.replace(m[0], ' ');
		}

		m = s.match(/\b(over|above|more than|at least)\s+\$?\s*(\d+)\s*(dollars|bucks)?/);
		if (m) {
			filter.minPrice = Number(m[2]);
			s = s.replace(m[0], ' ');
		}
	}

	return { filter: Object.keys(filter).length > 0 ? filter : undefined, rest: s.trim() };
}

function extractQuantity(t: string, def: LanguageDef): { quantity?: Quantity; rest: string } {
	const withUnit = new RegExp(
		`(?:^|\\s)(\\d+|${def.numberPattern})\\s+(${def.unitPattern})\\s+(?:of|de|of the)?\\s*`,
		'i'
	);
	const m = ` ${t} `.match(withUnit);
	if (m) {
		const value = toNumber(m[1], def.numberWords);
		if (value !== undefined) {
			return {
				quantity: { value, unit: def.unitWords[m[2].toLowerCase()] ?? 'item' },
				rest: ` ${t} `.replace(m[0], ' ').trim()
			};
		}
	}

	const bare = new RegExp(`(?:^|\\s)(\\d+|${def.numberPattern})\\s+`, 'i');
	const b = ` ${t} `.match(bare);
	if (b) {
		const value = toNumber(b[1], def.numberWords);
		if (value !== undefined) {
			return {
				quantity: { value, unit: 'item' },
				rest: ` ${t} `.replace(b[0], ' ').trim()
			};
		}
	}

	return { quantity: undefined, rest: t };
}

export function parse(transcript: string, lang = 'en-US'): Command {
	const def = getLanguage(lang);
	const t = transcript.toLowerCase().trim();
	let intent = detectIntent(t, def);

	if (intent === 'unknown') {
		const { quantity, rest } = extractQuantity(t, def);
		const item = normalizeItem(rest, def.stopWords);
		if (quantity && item) return { intent: 'add', item, quantity, text: transcript };
		return { intent, text: transcript };
	}

	if (intent === 'clear') return { intent, text: transcript };

	if (intent === 'change') {
		const m = t.match(
			/change\s+(.+?)\s+to\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*$/
		);
		if (m) {
			const value = toNumber(m[2], def.numberWords);
			return {
				intent,
				item: normalizeItem(m[1], def.stopWords),
				quantity: value !== undefined ? { value, unit: 'item' } : undefined,
				text: transcript
			};
		}
		return { intent, item: normalizeItem(t, def.stopWords), text: transcript };
	}

	const { filter, rest: afterPrice } = extractPrice(t);
	const { quantity, rest } = extractQuantity(afterPrice, def);

	return {
		intent,
		item: normalizeItem(rest, def.stopWords),
		quantity,
		filter,
		text: transcript
	};
}
