import { beforeEach, describe, expect, it } from 'vitest';
import { createWebSpeechProvider, type RecognitionLike } from './web-speech';
import type { VoiceState } from './types';

class FakeRecognition implements RecognitionLike {
	static instances: FakeRecognition[] = [];
	lang = '';
	continuous = false;
	interimResults = false;
	onstart: (() => void) | null = null;
	onresult: ((event: unknown) => void) | null = null;
	onerror: ((event: unknown) => void) | null = null;
	onend: (() => void) | null = null;
	started = false;

	constructor() {
		FakeRecognition.instances.push(this);
	}

	start() {
		this.started = true;
	}

	stop() {
		this.onend?.();
	}

	abort() {}
}

function resultEvent(transcripts: string[], isFinal: boolean) {
	return {
		resultIndex: 0,
		results: transcripts.map((t) => ({ 0: { transcript: t }, isFinal }))
	};
}

describe('web speech provider', () => {
	beforeEach(() => {
		FakeRecognition.instances = [];
	});

	it('starts recognition and reports listening', () => {
		const states: VoiceState[] = [];
		const provider = createWebSpeechProvider(
			{ onState: (s) => states.push(s), onResult: () => {}, onError: () => {} },
			{ recognitionCtor: FakeRecognition, lang: 'en-US' }
		);

		provider.start();
		const rec = FakeRecognition.instances[0];

		expect(rec.started).toBe(true);
		expect(rec.lang).toBe('en-US');
		expect(rec.continuous).toBe(true);
		expect(rec.interimResults).toBe(true);

		rec.onstart?.();
		expect(states).toContain('listening');
	});

	it('reports a final transcript', () => {
		const results: [string, boolean][] = [];
		const states: VoiceState[] = [];
		const provider = createWebSpeechProvider(
			{
				onState: (s) => states.push(s),
				onResult: (t, f) => results.push([t, f]),
				onError: () => {}
			},
			{ recognitionCtor: FakeRecognition, lang: 'en-US' }
		);

		provider.start();
		const rec = FakeRecognition.instances[0];
		rec.onresult?.(resultEvent(['add milk'], true));

		expect(states).toContain('recognizing');
		expect(results).toContainEqual(['add milk', true]);
	});

	it('reports errors', () => {
		const errors: string[] = [];
		const provider = createWebSpeechProvider(
			{ onState: () => {}, onResult: () => {}, onError: (e) => errors.push(e) },
			{ recognitionCtor: FakeRecognition, lang: 'en-US' }
		);

		provider.start();
		const rec = FakeRecognition.instances[0];
		rec.onerror?.({ error: 'not-allowed' });

		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain('not-allowed');
	});
});
