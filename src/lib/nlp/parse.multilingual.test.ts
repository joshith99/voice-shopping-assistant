import { describe, expect, it } from 'vitest';
import { parse } from './parse';

describe('parse Hindi', () => {
	it('detects add in Hindi', () => {
		expect(parse('दूध जोड़ो', 'hi-IN')).toMatchObject({ intent: 'add', item: 'दूध' });
	});

	it('parses quantity with a unit in Hindi', () => {
		expect(parse('दो बोतल पानी', 'hi-IN')).toMatchObject({
			intent: 'add',
			quantity: { value: 2, unit: 'bottle' }
		});
	});

	it('detects remove in Hindi', () => {
		expect(parse('दूध हटाओ', 'hi-IN')).toMatchObject({ intent: 'remove', item: 'दूध' });
	});
});

describe('parse Spanish', () => {
	it('detects add in Spanish', () => {
		expect(parse('añade leche', 'es-ES')).toMatchObject({ intent: 'add', item: 'leche' });
	});

	it('parses quantity with a unit in Spanish', () => {
		expect(parse('dos botellas de agua', 'es-ES')).toMatchObject({
			intent: 'add',
			quantity: { value: 2, unit: 'bottle' },
			item: 'agua'
		});
	});

	it('detects remove in Spanish', () => {
		expect(parse('quita la leche', 'es-ES')).toMatchObject({ intent: 'remove', item: 'leche' });
	});
});
