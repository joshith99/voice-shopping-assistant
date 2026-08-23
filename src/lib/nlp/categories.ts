const CATEGORY_KEYWORDS: { category: string; keywords: string[] }[] = [
	{
		category: 'beverages',
		keywords: [
			'juice',
			'soda',
			'cola',
			'coffee',
			'tea',
			'water',
			'sparkling',
			'tonic',
			'wine',
			'beer'
		]
	},
	{
		category: 'bakery',
		keywords: [
			'bread',
			'bagel',
			'bun',
			'croissant',
			'muffin',
			'cake',
			'cookie',
			'pastry',
			'tortilla',
			'roll'
		]
	},
	{
		category: 'snacks',
		keywords: [
			'chips',
			'crisps',
			'cracker',
			'popcorn',
			'pretzel',
			'chocolate',
			'candy',
			'nut',
			'granola',
			'biscuit'
		]
	},
	{
		category: 'dairy',
		keywords: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'paneer', 'ghee']
	},
	{
		category: 'meat',
		keywords: ['chicken', 'beef', 'pork', 'bacon', 'sausage', 'ham', 'turkey', 'lamb', 'steak']
	},
	{
		category: 'seafood',
		keywords: ['fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'crab', 'lobster', 'sardine', 'cod']
	},
	{
		category: 'household',
		keywords: [
			'soap',
			'detergent',
			'sponge',
			'tissue',
			'paper towel',
			'bleach',
			'cleaner',
			'trash',
			'battery',
			'shampoo',
			'toothpaste',
			'toothbrush',
			'toilet'
		]
	},
	{
		category: 'produce',
		keywords: [
			'apple',
			'banana',
			'orange',
			'lemon',
			'lime',
			'grape',
			'berry',
			'strawberry',
			'blueberry',
			'watermelon',
			'melon',
			'mango',
			'pineapple',
			'avocado',
			'tomato',
			'onion',
			'garlic',
			'potato',
			'carrot',
			'broccoli',
			'spinach',
			'lettuce',
			'cabbage',
			'cucumber',
			'pepper',
			'zucchini',
			'mushroom',
			'corn',
			'pea',
			'bean',
			'celery',
			'ginger',
			'chilli',
			'chili'
		]
	}
];

export function categorize(name: string): string {
	const lower = name.toLowerCase();
	for (const { category, keywords } of CATEGORY_KEYWORDS) {
		if (keywords.some((k) => lower.includes(k))) return category;
	}
	return 'other';
}
