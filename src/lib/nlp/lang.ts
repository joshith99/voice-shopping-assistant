import type { Intent } from './types';

export interface LanguageDef {
	intents: { intent: Intent; pattern: RegExp }[];
	numberWords: Record<string, number>;
	unitWords: Record<string, string>;
	unitPattern: string;
	numberPattern: string;
	stopWords: Set<string>;
}

const EN: LanguageDef = {
	intents: [
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
	],
	numberWords: {
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
	},
	unitWords: {
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
	},
	unitPattern:
		'bottles?|cartons?|boxes?|cans?|packs?|bags?|jars?|loaves|loaf|kilos?|kilograms?|grams?|litres?|liters?|pounds?|dozens?|kg|g|l|ml|lb',
	numberPattern:
		'one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|a|an|couple|dozen',
	stopWords: new Set([
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
	])
};

const HI: LanguageDef = {
	intents: [
		{ intent: 'clear', pattern: /(साफ करो|साफ करें|खाली करो|खाली करें|सब हटाओ)/ },
		{ intent: 'search', pattern: /(ढूंढो|ढूंढें|खोजो|खोजें)/ },
		{ intent: 'remove', pattern: /(हटाओ|हटाएं|निकालो|निकालें)/ },
		{ intent: 'change', pattern: /(बदलो|बदलें)/ },
		{ intent: 'add', pattern: /(जोड़ो|जोड़ें|डालो|डालें|खरीदो|खरीदें|चाहिए|लाओ|लाना)/ }
	],
	numberWords: {
		एक: 1,
		दो: 2,
		तीन: 3,
		चार: 4,
		पांच: 5,
		पाँच: 5,
		छह: 6,
		छः: 6,
		सात: 7,
		आठ: 8,
		नौ: 9,
		दस: 10
	},
	unitWords: {
		बोतल: 'bottle',
		बोतलें: 'bottle',
		डिब्बा: 'box',
		डिब्बे: 'box',
		पैकेट: 'pack',
		थैला: 'bag',
		थैले: 'bag',
		किलो: 'kg',
		ग्राम: 'g',
		लीटर: 'l'
	},
	unitPattern: 'बोतल|बोतलें|डिब्बा|डिब्बे|पैकेट|थैला|थैले|किलो|ग्राम|लीटर',
	numberPattern: 'एक|दो|तीन|चार|पांच|पाँच|छह|छः|सात|आठ|नौ|दस',
	stopWords: new Set([
		'जोड़ो',
		'जोड़ें',
		'डालो',
		'डालें',
		'खरीदो',
		'खरीदें',
		'चाहिए',
		'लाओ',
		'लाना',
		'हटाओ',
		'हटाएं',
		'निकालो',
		'निकालें',
		'ढूंढो',
		'ढूंढें',
		'खोजो',
		'खोजें',
		'मुझे',
		'मेरी',
		'सूची',
		'में',
		'से',
		'को',
		'और',
		'कृपया'
	])
};

const ES: LanguageDef = {
	intents: [
		{ intent: 'clear', pattern: /(limpia|limpiar|borra todo|vacía|vaciar)/ },
		{ intent: 'search', pattern: /(busca|buscar|encuentra|encontrar)/ },
		{ intent: 'remove', pattern: /(quita|quitar|elimina|eliminar|borra|borrar)/ },
		{ intent: 'change', pattern: /(cambia|cambiar)/ },
		{ intent: 'add', pattern: /(añade|añadir|agrega|agregar|compra|comprar|necesito|quiero|pon)/ }
	],
	numberWords: {
		un: 1,
		uno: 1,
		una: 1,
		dos: 2,
		tres: 3,
		cuatro: 4,
		cinco: 5,
		seis: 6,
		siete: 7,
		ocho: 8,
		nueve: 9,
		diez: 10
	},
	unitWords: {
		botella: 'bottle',
		botellas: 'bottle',
		caja: 'box',
		cajas: 'box',
		paquete: 'pack',
		paquetes: 'pack',
		bolsa: 'bag',
		bolsas: 'bag',
		kilo: 'kg',
		kilos: 'kg',
		gramo: 'g',
		gramos: 'g',
		litro: 'l',
		litros: 'l'
	},
	unitPattern: 'botellas?|cajas?|paquetes?|bolsas?|kilos?|gramos?|litros?',
	numberPattern: 'uno|un|una|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez',
	stopWords: new Set([
		'añade',
		'añadir',
		'agrega',
		'agregar',
		'compra',
		'comprar',
		'necesito',
		'quiero',
		'pon',
		'quita',
		'quitar',
		'elimina',
		'eliminar',
		'borra',
		'borrar',
		'busca',
		'buscar',
		'encuentra',
		'encontrar',
		'mi',
		'la',
		'el',
		'los',
		'las',
		'lista',
		'de',
		'del',
		'a',
		'por',
		'favor',
		'y',
		'un',
		'una',
		'para'
	])
};

const LANGUAGES: Record<string, LanguageDef> = { en: EN, hi: HI, es: ES };

export function getLanguage(lang: string): LanguageDef {
	const base = lang.toLowerCase().split('-')[0];
	return LANGUAGES[base] ?? EN;
}
