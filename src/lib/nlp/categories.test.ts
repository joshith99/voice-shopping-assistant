import { describe, expect, it } from 'vitest';
import { categorize } from './categories';

describe('categorize', () => {
	it('categorizes dairy', () => {
		expect(categorize('milk')).toBe('dairy');
		expect(categorize('cheese')).toBe('dairy');
		expect(categorize('butter')).toBe('dairy');
	});

	it('categorizes produce', () => {
		expect(categorize('apple')).toBe('produce');
		expect(categorize('banana')).toBe('produce');
		expect(categorize('spinach')).toBe('produce');
	});

	it('categorizes bakery', () => {
		expect(categorize('bread')).toBe('bakery');
	});

	it('falls back to a default for unknown items', () => {
		expect(categorize('zqxjkl')).toBe('other');
	});
});
