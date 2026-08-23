import type { VoiceCallbacks, VoiceProvider } from './types';

export interface RecognitionLike {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onstart: (() => void) | null;
	onresult: ((event: unknown) => void) | null;
	onerror: ((event: unknown) => void) | null;
	onend: (() => void) | null;
	start(): void;
	stop(): void;
	abort(): void;
}

export interface WebSpeechOptions {
	recognitionCtor?: new () => RecognitionLike;
	lang?: string;
}

type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { resultIndex: number; results: RecognitionResult[] };

function browserRecognition(): new () => RecognitionLike {
	const g = globalThis as unknown as {
		SpeechRecognition?: new () => RecognitionLike;
		webkitSpeechRecognition?: new () => RecognitionLike;
	};
	return (g.SpeechRecognition ?? g.webkitSpeechRecognition) as new () => RecognitionLike;
}

export function createWebSpeechProvider(
	callbacks: VoiceCallbacks,
	options: WebSpeechOptions = {}
): VoiceProvider {
	const Recognition = options.recognitionCtor ?? browserRecognition();
	let recognition: RecognitionLike | null = null;

	const start = () => {
		if (!Recognition) {
			callbacks.onError('Speech recognition is not supported in this browser');
			return;
		}

		recognition = new Recognition();
		recognition.lang = options.lang ?? navigator.language ?? 'en-US';
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = () => callbacks.onState('listening');
		recognition.onerror = (event) => {
			const message = (event as { error?: string }).error ?? 'unknown';
			callbacks.onState('error');
			callbacks.onError(message);
		};
		recognition.onresult = (event) => {
			callbacks.onState('recognizing');
			const { resultIndex, results } = event as RecognitionEvent;
			let final = '';
			let interim = '';
			for (let i = resultIndex; i < results.length; i++) {
				const result = results[i];
				if (result.isFinal) final += result[0].transcript;
				else interim += result[0].transcript;
			}
			if (final) callbacks.onResult(final, true);
			else if (interim) callbacks.onResult(interim, false);
		};
		recognition.onend = () => callbacks.onState('idle');

		recognition.start();
	};

	const stop = () => {
		recognition?.stop();
		recognition = null;
	};

	return { start, stop };
}
