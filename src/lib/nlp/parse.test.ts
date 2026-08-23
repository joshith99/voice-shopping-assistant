import { describe, expect, it } from 'vitest';
import { parse } from './parse';

describe('parse intent', () => {
	it('detects add from a bare item', () => {
		expect(parse('add milk')).toMatchObject({ intent: 'add', item: 'milk' });
	});

	it('detects add from "I need ..."', () => {
		expect(parse('I need apples')).toMatchObject({ intent: 'add', item: 'apple' });
	});

	it('detects add from "I want to buy ..."', () => {
		expect(parse('I want to buy bananas')).toMatchObject({ intent: 'add', item: 'banana' });
	});

	it('detects add from "... to my list"', () => {
		expect(parse('add bananas to my list')).toMatchObject({ intent: 'add', item: 'banana' });
	});

	it('detects remove', () => {
		expect(parse('remove milk from my list')).toMatchObject({
			intent: 'remove',
			item: 'milk'
		});
	});

	it('detects clear', () => {
		expect(parse('clear my list').intent).toBe('clear');
	});

	it('detects search', () => {
		expect(parse('find me organic apples')).toMatchObject({ intent: 'search', item: 'apple' });
	});

	it('returns unknown for unrecognized input', () => {
		expect(parse('banana smoothie recipe please').intent).toBe('unknown');
	});
});

describe('parse quantity', () => {
	it('parses digit quantity with a unit', () => {
		expect(parse('add 2 bottles of water')).toMatchObject({
			intent: 'add',
			item: 'water',
			quantity: { value: 2, unit: 'bottle' }
		});
	});

	it('parses count without a unit as items', () => {
		expect(parse('buy 5 oranges')).toMatchObject({
			intent: 'add',
			item: 'orange',
			quantity: { value: 5, unit: 'item' }
		});
	});

	it('parses word numbers', () => {
		expect(parse('add two cartons of milk')).toMatchObject({
			quantity: { value: 2, unit: 'carton' }
		});
	});

	it('parses weight units', () => {
		expect(parse('add 2 kilos of rice')).toMatchObject({
			quantity: { value: 2, unit: 'kg' }
		});
	});
});

describe('parse price filter', () => {
	it('parses "under $5"', () => {
		expect(parse('find toothpaste under $5')).toMatchObject({
			intent: 'search',
			item: 'toothpaste',
			filter: { maxPrice: 5 }
		});
	});

	it('parses "between $2 and $5"', () => {
		expect(parse('find toothpaste between $2 and $5')).toMatchObject({
			intent: 'search',
			filter: { minPrice: 2, maxPrice: 5 }
		});
	});

	it('parses a dollar word', () => {
		expect(parse('find milk under 3 dollars')).toMatchObject({
			intent: 'search',
			filter: { maxPrice: 3 }
		});
	});
});

describe('parse change', () => {
	it('detects a quantity change', () => {
		expect(parse('change milk to 3')).toMatchObject({
			intent: 'change',
			item: 'milk',
			quantity: { value: 3, unit: 'item' }
		});
	});
});
