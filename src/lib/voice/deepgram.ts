import type { VoiceCallbacks, VoiceProvider } from './types';

export function deepgramUrl(apiKey: string, lang = 'en-US'): string {
	const language = lang.toLowerCase().split('-')[0];
	return `wss://api.deepgram.com/v1/listen?model=nova-3&language=${language}&interim_results=true&smart_format=true&token=${encodeURIComponent(apiKey)}`;
}

interface DeepgramResult {
	type: string;
	is_final: boolean;
	channel?: { alternatives?: { transcript?: string }[] };
}

export function createDeepgramProvider(
	callbacks: VoiceCallbacks,
	options: { apiKey: string; lang?: string }
): VoiceProvider {
	let socket: WebSocket | null = null;
	let mediaRecorder: MediaRecorder | null = null;
	let stream: MediaStream | null = null;

	const start = () => {
		void navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((captured) => {
				stream = captured;
				socket = new WebSocket(deepgramUrl(options.apiKey, options.lang));

				socket.onopen = () => {
					callbacks.onState('listening');
					mediaRecorder = new MediaRecorder(stream!, { mimeType: 'audio/webm' });
					mediaRecorder.ondataavailable = (event) => {
						if (event.data.size > 0 && socket?.readyState === WebSocket.OPEN) {
							socket.send(event.data);
						}
					};
					mediaRecorder.start(250);
				};

				socket.onmessage = (event) => {
					const data = JSON.parse(event.data as string) as DeepgramResult;
					if (data.type !== 'Results') return;
					const transcript = data.channel?.alternatives?.[0]?.transcript ?? '';
					if (!transcript) return;
					callbacks.onState('recognizing');
					callbacks.onResult(transcript, data.is_final);
				};

				socket.onerror = () => {
					callbacks.onState('error');
					callbacks.onError('deepgram-connection-failed');
				};

				socket.onclose = () => callbacks.onState('idle');
			})
			.catch(() => {
				callbacks.onState('error');
				callbacks.onError('not-allowed');
			});
	};

	const stop = () => {
		mediaRecorder?.stop();
		stream?.getTracks().forEach((track) => track.stop());
		socket?.close();
		socket = null;
		mediaRecorder = null;
		stream = null;
	};

	return { start, stop };
}
