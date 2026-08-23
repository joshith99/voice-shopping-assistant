<script lang="ts">
	import type { VoiceState } from '$lib/voice/types';

	let {
		state,
		onclick,
		disabled = false
	}: { state: VoiceState; onclick: () => void; disabled?: boolean } = $props();

	const active = $derived(state === 'listening' || state === 'recognizing');
	const label = $derived(
		state === 'listening'
			? 'Stop listening'
			: state === 'recognizing'
				? 'Stop listening'
				: 'Start listening'
	);
</script>

<button
	type="button"
	class="relative grid place-items-center rounded-full text-white transition-all duration-200 ease-out disabled:opacity-50"
	class:bg-accent={active}
	class:bg-ink={!active}
	class:bg-warn={state === 'error'}
	style="width: 4.5rem; height: 4.5rem"
	aria-label={label}
	aria-pressed={active}
	{onclick}
	{disabled}
>
	{#if active}
		<span
			class="absolute inset-0 rounded-full bg-accent opacity-40"
			class:animate-ring={state === 'listening'}
			class:animate-ring-fast={state === 'recognizing'}
		></span>
	{/if}

	<svg
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.8"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="relative h-8 w-8"
		aria-hidden="true"
	>
		<rect x="9" y="3" width="6" height="11" rx="3" />
		<path d="M5 11a7 7 0 0 0 14 0" />
		<path d="M12 18v3" />
	</svg>
</button>

<style>
	@keyframes ring {
		0% {
			transform: scale(1);
			opacity: 0.4;
		}
		70% {
			transform: scale(1.45);
			opacity: 0;
		}
		100% {
			transform: scale(1.45);
			opacity: 0;
		}
	}

	.animate-ring {
		animation: ring 1.6s ease-out infinite;
	}

	.animate-ring-fast {
		animation: ring 0.9s ease-out infinite;
	}
</style>
