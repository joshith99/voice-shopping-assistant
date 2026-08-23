<script lang="ts">
	import { onMount } from 'svelte';

	let {
		apiKey,
		onSave,
		onClear,
		onClose
	}: {
		apiKey: string;
		onSave: (key: string) => void;
		onClear: () => void;
		onClose: () => void;
	} = $props();

	let draft = $state('');
	let dialog: HTMLDialogElement | undefined;

	onMount(() => {
		draft = apiKey;
		dialog?.showModal();
	});
</script>

<dialog
	bind:this={dialog}
	class="m-auto w-full max-w-sm rounded-2xl bg-surface p-5 shadow-xl backdrop:bg-ink/30"
	onclose={onClose}
>
	<header class="mb-4 flex items-center justify-between">
		<h2 class="text-base font-semibold">Settings</h2>
		<button
			type="button"
			class="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
			onclick={onClose}
			aria-label="Close settings"
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				class="h-4 w-4"
				aria-hidden="true"
			>
				<path d="M6 6l12 12M18 6L6 18" />
			</svg>
		</button>
	</header>

	<label class="mb-1 block text-sm font-medium" for="deepgram-key">Deepgram API key</label>
	<p class="mb-3 text-sm text-muted">
		Optional. Enter your own key for faster, more accurate transcription. The key stays in this
		browser and is sent only to Deepgram.
	</p>
	<input
		id="deepgram-key"
		type="password"
		class="mb-3 w-full rounded-xl border border-line bg-surface px-3 py-2 text-[15px] focus:border-accent"
		placeholder="Paste a Deepgram API key"
		bind:value={draft}
	/>

	<div class="flex justify-end gap-2">
		{#if apiKey}
			<button
				type="button"
				class="rounded-lg px-3 py-2 text-sm font-medium text-warn hover:bg-warn-soft"
				onclick={onClear}
			>
				Remove key
			</button>
		{/if}
		<button
			type="button"
			class="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-ink"
			onclick={() => onSave(draft.trim())}
		>
			Save
		</button>
	</div>
</dialog>
