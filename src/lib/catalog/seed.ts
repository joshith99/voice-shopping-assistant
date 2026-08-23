export interface CatalogItem {
	name: string;
	category: string;
	brand: string;
	size: string;
	price: number;
	season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
	onSale: boolean;
}

export const CATALOG: CatalogItem[] = [
	{
		name: 'milk',
		category: 'dairy',
		brand: 'Amul',
		size: '1 L',
		price: 2.5,
		season: 'all',
		onSale: false
	},
	{
		name: 'cheese',
		category: 'dairy',
		brand: 'Britannia',
		size: '200 g',
		price: 3.2,
		season: 'all',
		onSale: true
	},
	{
		name: 'butter',
		category: 'dairy',
		brand: 'Amul',
		size: '500 g',
		price: 4.0,
		season: 'all',
		onSale: false
	},
	{
		name: 'yogurt',
		category: 'dairy',
		brand: 'Epigamia',
		size: '400 g',
		price: 2.8,
		season: 'all',
		onSale: false
	},
	{
		name: 'bread',
		category: 'bakery',
		brand: 'Modern',
		size: '400 g',
		price: 1.5,
		season: 'all',
		onSale: false
	},
	{
		name: 'bagel',
		category: 'bakery',
		brand: 'Theobroma',
		size: '6 pack',
		price: 3.4,
		season: 'all',
		onSale: false
	},
	{
		name: 'apple',
		category: 'produce',
		brand: 'Kashmiri',
		size: '1 kg',
		price: 2.9,
		season: 'all',
		onSale: false
	},
	{
		name: 'banana',
		category: 'produce',
		brand: 'Robusta',
		size: '1 dozen',
		price: 1.2,
		season: 'all',
		onSale: false
	},
	{
		name: 'strawberry',
		category: 'produce',
		brand: 'Mahabaleshwar',
		size: '250 g',
		price: 3.1,
		season: 'spring',
		onSale: true
	},
	{
		name: 'watermelon',
		category: 'produce',
		brand: 'Local',
		size: '1 pc',
		price: 2.2,
		season: 'summer',
		onSale: false
	},
	{
		name: 'mango',
		category: 'produce',
		brand: 'Alphonso',
		size: '1 kg',
		price: 4.5,
		season: 'summer',
		onSale: false
	},
	{
		name: 'pumpkin',
		category: 'produce',
		brand: 'Local',
		size: '1 kg',
		price: 1.8,
		season: 'autumn',
		onSale: false
	},
	{
		name: 'spinach',
		category: 'produce',
		brand: 'Local',
		size: '250 g',
		price: 0.9,
		season: 'all',
		onSale: false
	},
	{
		name: 'tomato',
		category: 'produce',
		brand: 'Local',
		size: '1 kg',
		price: 1.1,
		season: 'all',
		onSale: false
	},
	{
		name: 'onion',
		category: 'produce',
		brand: 'Local',
		size: '1 kg',
		price: 0.8,
		season: 'all',
		onSale: false
	},
	{
		name: 'potato',
		category: 'produce',
		brand: 'Local',
		size: '1 kg',
		price: 0.7,
		season: 'all',
		onSale: false
	},
	{
		name: 'carrot',
		category: 'produce',
		brand: 'Ooty',
		size: '1 kg',
		price: 1.0,
		season: 'winter',
		onSale: false
	},
	{
		name: 'orange',
		category: 'produce',
		brand: 'Nagpur',
		size: '1 kg',
		price: 2.0,
		season: 'winter',
		onSale: true
	},
	{
		name: 'avocado',
		category: 'produce',
		brand: 'Imported',
		size: '1 pc',
		price: 1.9,
		season: 'all',
		onSale: false
	},
	{
		name: 'chicken',
		category: 'meat',
		brand: 'FreshToHome',
		size: '500 g',
		price: 4.2,
		season: 'all',
		onSale: false
	},
	{
		name: 'beef',
		category: 'meat',
		brand: 'FreshToHome',
		size: '500 g',
		price: 5.5,
		season: 'all',
		onSale: false
	},
	{
		name: 'salmon',
		category: 'seafood',
		brand: 'FreshToHome',
		size: '250 g',
		price: 6.5,
		season: 'all',
		onSale: false
	},
	{
		name: 'shrimp',
		category: 'seafood',
		brand: 'FreshToHome',
		size: '250 g',
		price: 5.0,
		season: 'all',
		onSale: true
	},
	{
		name: 'chips',
		category: 'snacks',
		brand: 'Lays',
		size: '120 g',
		price: 1.4,
		season: 'all',
		onSale: false
	},
	{
		name: 'popcorn',
		category: 'snacks',
		brand: 'Act II',
		size: '90 g',
		price: 1.0,
		season: 'all',
		onSale: false
	},
	{
		name: 'chocolate',
		category: 'snacks',
		brand: 'Cadbury',
		size: '150 g',
		price: 2.6,
		season: 'all',
		onSale: false
	},
	{
		name: 'granola',
		category: 'snacks',
		brand: 'Yoga Bar',
		size: '300 g',
		price: 3.8,
		season: 'all',
		onSale: true
	},
	{
		name: 'coffee',
		category: 'beverages',
		brand: 'Blue Tokai',
		size: '250 g',
		price: 5.2,
		season: 'all',
		onSale: false
	},
	{
		name: 'tea',
		category: 'beverages',
		brand: 'Tetley',
		size: '250 g',
		price: 3.0,
		season: 'all',
		onSale: false
	},
	{
		name: 'orange juice',
		category: 'beverages',
		brand: 'Tropicana',
		size: '1 L',
		price: 3.4,
		season: 'all',
		onSale: false
	},
	{
		name: 'sparkling water',
		category: 'beverages',
		brand: 'San Pellegrino',
		size: '750 ml',
		price: 2.4,
		season: 'all',
		onSale: false
	},
	{
		name: 'toothpaste',
		category: 'household',
		brand: 'Colgate',
		size: '200 g',
		price: 1.7,
		season: 'all',
		onSale: false
	},
	{
		name: 'dish soap',
		category: 'household',
		brand: 'Vim',
		size: '500 ml',
		price: 1.6,
		season: 'all',
		onSale: false
	},
	{
		name: 'laundry detergent',
		category: 'household',
		brand: 'Ariel',
		size: '1 kg',
		price: 4.8,
		season: 'all',
		onSale: true
	},
	{
		name: 'toilet paper',
		category: 'household',
		brand: 'Origami',
		size: '4 rolls',
		price: 3.1,
		season: 'all',
		onSale: false
	},
	{
		name: 'shampoo',
		category: 'household',
		brand: 'Dove',
		size: '340 ml',
		price: 4.1,
		season: 'all',
		onSale: false
	},
	{
		name: 'rice',
		category: 'other',
		brand: 'India Gate',
		size: '5 kg',
		price: 8.5,
		season: 'all',
		onSale: false
	},
	{
		name: 'olive oil',
		category: 'other',
		brand: 'Figaro',
		size: '1 L',
		price: 9.0,
		season: 'all',
		onSale: false
	},
	{
		name: 'almond milk',
		category: 'dairy',
		brand: 'Only Earth',
		size: '1 L',
		price: 3.6,
		season: 'all',
		onSale: false
	},
	{
		name: 'oat milk',
		category: 'dairy',
		brand: 'Alt Co',
		size: '1 L',
		price: 3.4,
		season: 'all',
		onSale: false
	},
	{
		name: 'honey',
		category: 'other',
		brand: 'Dabur',
		size: '500 g',
		price: 5.5,
		season: 'all',
		onSale: false
	}
];

export const SUBSTITUTES: Record<string, string[]> = {
	milk: ['almond milk', 'oat milk', 'soy milk'],
	butter: ['margarine', 'ghee'],
	sugar: ['honey', 'stevia'],
	rice: ['quinoa', 'brown rice'],
	coffee: ['green tea', 'matcha'],
	chicken: ['tofu', 'paneer'],
	beef: ['lamb', 'plant-based mince']
};
