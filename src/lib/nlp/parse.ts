import type { Command, Filter, Intent, Quantity } from './types';

const NUMBER_WORDS: Record<string, number> = {
	a: 1,
	an: 1,
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	ten: 10,
	eleven: 11,
	twelve: 12,
	thirteen: 13,
	fourteen: 14,
	fifteen: 15,
	sixteen: 16,
	seventeen: 17,
	eighteen: 18,
	nineteen: 19,
	twenty: 20,
	couple: 2,
	dozen: 12
};

const UNIT_WORDS: Record<string, string> = {
	bottle: 'bottle',
	bottles: 'bottle',
	carton: 'carton',
	cartons: 'carton',
	box: 'box',
	boxes: 'box',
	can: 'can',
	cans: 'can',
	pack: 'pack',
	packs: 'pack',
	bag: 'bag',
	bags: 'bag',
	jar: 'jar',
	jars: 'jar',
	loaf: 'loaf',
	loaves: 'loaf',
	kilo: 'kg',
	kilos: 'kg',
	kilogram: 'kg',
	kilograms: 'kg',
	kg: 'kg',
	gram: 'g',
	grams: 'g',
	g: 'g',
	litre: 'l',
	litres: 'l',
	liter: 'l',
	liters: 'l',
	l: 'l',
	ml: 'ml',
	pound: 'lb',
	pounds: 'lb',
	lb: 'lb',
	dozen: 'dozen',
	dozens: 'dozen'
};

const UNIT_PATTERN =
	'bottles?|cartons?|boxes?|cans?|packs?|bags?|jars?|loaves|loaf|kilos?|kilograms?|grams?|litres?|liters?|pounds?|dozens?|kg|g|l|ml|lb';

const NUMBER_PATTERN =
	'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|a|an|couple|dozen';

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

const STOP_WORDS = new Set([
	'add',
	'buy',
	'get',
	'grab',
	'pick',
	'up',
	'put',
	'remember',
	'need',
	'want',
	'would',
	'like',
	'i',
	"i'd",
	'we',
	'remove',
	'delete',
	'drop',
	'take',
	'out',
	'off',
	'rid',
	'find',
	'search',
	'look',
	'show',
	'me',
	'change',
	'make',
	'it',
	'update',
	'set',
	'to',
	'from',
	'on',
	'in',
	'for',
	'the',
	'a',
	'an',
	'my',
	'our',
	'list',
	'shopping',
	'please',
	'some',
	'of',
	'and',
	'then',
	'now',
	'also'
]);

const INTENTS: { intent: Intent; pattern: RegExp }[] = [
	{
		intent: 'clear',
		pattern:
			/\b(clear|empty|delete all|delete everything|remove all|remove everything|reset|start over)\b/
	},
	{ intent: 'search', pattern: /\b(find|search|look for|look up|show me)\b/ },
	{ intent: 'remove', pattern: /\b(remove|delete|drop|take out|take off|get rid of)\b/ },
	{ intent: 'change', pattern: /\b(change|make it|update|set)\b/ },
	{
		intent: 'add',
		pattern:
			/\b(add|buy|get|grab|pick up|put|remember|i need|i want|i would like|i'd like|we need)\b/
	}
];

function toNumber(word: string): number | undefined {
	if (/^\d+$/.test(word)) return Number(word);
	return NUMBER_WORDS[word.toLowerCase()];
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

function normalizeItem(raw: string): string | undefined {
	const tokens = raw
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 0 && !STOP_WORDS.has(w) && !ADJECTIVES.has(w));

	if (tokens.length === 0) return undefined;
	return singularize(tokens.join(' '));
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

function extractQuantity(t: string): { quantity?: Quantity; rest: string } {
	const withUnit = new RegExp(`\\b(\\d+|${NUMBER_PATTERN})\\s+(${UNIT_PATTERN})\\s+of\\s+`, 'i');
	const m = ` ${t} `.match(withUnit);
	if (m) {
		const value = toNumber(m[1]);
		if (value !== undefined) {
			return {
				quantity: { value, unit: UNIT_WORDS[m[2].toLowerCase()] },
				rest: ` ${t} `.replace(m[0], ' ').trim()
			};
		}
	}

	const bare = new RegExp(`\\b(\\d+|${NUMBER_PATTERN})\\s+`, 'i');
	const b = ` ${t} `.match(bare);
	if (b) {
		const value = toNumber(b[1]);
		if (value !== undefined) {
			return {
				quantity: { value, unit: 'item' },
				rest: ` ${t} `.replace(b[0], ' ').trim()
			};
		}
	}

	return { quantity: undefined, rest: t };
}

export function parse(transcript: string): Command {
	const t = transcript.toLowerCase().trim();
	const intent = INTENTS.find(({ pattern }) => pattern.test(t))?.intent ?? 'unknown';

	if (intent === 'unknown') return { intent, text: transcript };
	if (intent === 'clear') return { intent, text: transcript };

	if (intent === 'change') {
		const m = t.match(
			/change\s+(.+?)\s+to\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*$/
		);
		if (m) {
			const value = toNumber(m[2]);
			return {
				intent,
				item: normalizeItem(m[1]),
				quantity: value !== undefined ? { value, unit: 'item' } : undefined,
				text: transcript
			};
		}
		return { intent, item: normalizeItem(t), text: transcript };
	}

	const { filter, rest: afterPrice } = extractPrice(t);
	const { quantity, rest } = extractQuantity(afterPrice);

	return {
		intent,
		item: normalizeItem(rest),
		quantity,
		filter,
		text: transcript
	};
}
