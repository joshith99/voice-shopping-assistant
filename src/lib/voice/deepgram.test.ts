import { describe, expect, it } from 'vitest';
import { deepgramUrl } from './deepgram';

describe('deepgramUrl', () => {
	it('builds a streaming URL with the key and language', () => {
		const url = deepgramUrl('abc123', 'es-ES');
		expect(url).toContain('wss://api.deepgram.com/v1/listen');
		expect(url).toContain('model=nova-3');
		expect(url).toContain('language=es');
		expect(url).toContain('token=abc123');
	});

	it('derives the language code from a full locale', () => {
		expect(deepgramUrl('key', 'hi-IN')).toContain('language=hi');
	});
});
