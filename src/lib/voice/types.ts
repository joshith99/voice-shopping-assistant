export type VoiceState = 'idle' | 'listening' | 'recognizing' | 'confirming' | 'error';

export interface VoiceCallbacks {
	onState(state: VoiceState): void;
	onResult(transcript: string, isFinal: boolean): void;
	onError(message: string): void;
}

export interface VoiceProvider {
	start(): void;
	stop(): void;
}
