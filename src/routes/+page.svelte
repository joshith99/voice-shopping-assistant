<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { env } from '$env/dynamic/public';
	import MicButton from '$lib/components/MicButton.svelte';
	import ListItem from '$lib/components/ListItem.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import SuggestionRail from '$lib/components/SuggestionRail.svelte';
	import { CATALOG, SUBSTITUTES } from '$lib/catalog/seed';
	import { searchCatalog } from '$lib/catalog/search';
	import type { CatalogItem } from '$lib/catalog/seed';
	import { createData } from '$lib/data';
	import type { Data, HistoryEntry, ListItem as Item } from '$lib/data';
	import { categorize } from '$lib/nlp/categories';
	import { parse } from '$lib/nlp/parse';
	import type { Command } from '$lib/nlp/types';
	import { runningLow } from '$lib/suggestions/history';
	import { onSaleItems, seasonalItems } from '$lib/suggestions/seasonal';
	import { substitutesFor } from '$lib/suggestions/substitutes';
	import { createDeepgramProvider } from '$lib/voice/deepgram';
	import { speak } from '$lib/voice/speech-synthesis';
	import type { VoiceState } from '$lib/voice/types';
	import { createWebSpeechProvider } from '$lib/voice/web-speech';

	const CATEGORY_ORDER = [
		'produce',
		'dairy',
		'bakery',
		'meat',
		'seafood',
		'snacks',
		'beverages',
		'household',
		'other'
	];

	let items = $state<Item[]>([]);
	let history = $state<HistoryEntry[]>([]);
	let voiceState = $state<VoiceState>('idle');
	let transcript = $state('');
	let feedback = $state('');
	let error = $state('');
	let manualText = $state('');
	let language = $state('en-US');
	let highlightId = $state<string | null>(null);
	let searchResults = $state<{ query: string; items: CatalogItem[] } | null>(null);
	let settingsOpen = $state(false);
	let deepgramKey = $state('');
	type Undoable = { kind: 'clear'; items: Item[] } | { kind: 'remove'; item: Item; index: number };

	let undo = $state<Undoable | null>(null);

	let data: Data | undefined;
	let provider: ReturnType<typeof createWebSpeechProvider> | undefined;
	let feedbackTimer: ReturnType<typeof setTimeout> | undefined;
	let undoTimer: ReturnType<typeof setTimeout> | undefined;

	const listening = $derived(voiceState === 'listening' || voiceState === 'recognizing');

	const itemNames = $derived(items.map((item) => item.name));

	const undoLabel = $derived(
		undo ? (undo.kind === 'clear' ? 'Restore list?' : `Restore ${undo.item.name}?`) : ''
	);

	const suggestions = $derived.by(() => {
		const result: { kind: string; name: string }[] = [];
		for (const low of runningLow(history, new Date()).slice(0, 2)) {
			result.push({ kind: 'Running low', name: low.name });
		}
		for (const item of onSaleItems(CATALOG).slice(0, 3)) {
			result.push({ kind: 'On sale', name: item.name });
		}
		for (const item of seasonalItems(CATALOG, new Date().getMonth() + 1).slice(0, 2)) {
			result.push({ kind: 'In season', name: item.name });
		}
		for (const alternative of substitutesFor(itemNames, SUBSTITUTES).slice(0, 2)) {
			result.push({ kind: 'Try instead', name: alternative });
		}
		return result.slice(0, 4);
	});

	const groups = $derived.by(() => {
		const byCategory = new Map<string, Item[]>();
		for (const item of items) {
			const list = byCategory.get(item.category) ?? [];
			list.push(item);
			byCategory.set(item.category, list);
		}
		return CATEGORY_ORDER.map((category) => ({
			category,
			items: byCategory.get(category) ?? []
		})).filter((group) => group.items.length > 0);
	});

	$effect(() => {
		document.documentElement.lang = language;
	});

	onMount(() => {
		data = createData({
			supabaseUrl: env.PUBLIC_SUPABASE_URL,
			supabaseAnonKey: env.PUBLIC_SUPABASE_ANON_KEY
		});
		data.getList().then((loaded) => (items = loaded));
		language = data.getSetting('language') ?? 'en-US';
		deepgramKey = data.getSetting('deepgramKey') ?? '';
		void seedHistory();
		initProvider();
	});

	const DEMO_HISTORY: { name: string; category: string; daysAgo: number }[] = [
		{ name: 'milk', category: 'dairy', daysAgo: 10 },
		{ name: 'bread', category: 'bakery', daysAgo: 9 },
		{ name: 'spinach', category: 'produce', daysAgo: 7 },
		{ name: 'toothpaste', category: 'household', daysAgo: 35 }
	];

	async function seedHistory() {
		if (!data) return;
		const existing = await data.getHistory();
		if (existing.length > 0) {
			history = existing;
			return;
		}
		for (const entry of DEMO_HISTORY) {
			const when = new Date(Date.now() - entry.daysAgo * 86400000).toISOString();
			await data.addToHistory(entry.name, entry.category, when);
		}
		history = await data.getHistory();
	}

	function initProvider() {
		const callbacks = {
			onState: (s: VoiceState) => (voiceState = s),
			onResult: (text: string, isFinal: boolean) => {
				transcript = text;
				if (isFinal) handleCommand(text);
			},
			onError: (reason: string) => {
				error = friendlyError(reason);
				voiceState = 'error';
			}
		};

		provider = deepgramKey
			? createDeepgramProvider(callbacks, { apiKey: deepgramKey, lang: language })
			: createWebSpeechProvider(callbacks, { lang: language });
	}

	function friendlyError(reason: string): string {
		if (reason.includes('not-allowed') || reason.includes('permission')) {
			return "Microphone access is blocked. Allow it in your browser's permissions.";
		}
		if (reason.includes('no-speech')) return "Didn't catch that. Tap the mic and try again.";
		if (reason.includes('not supported')) {
			return 'Voice input is not supported in this browser. Try Chrome or Edge.';
		}
		return "Couldn't reach the microphone. Tap the mic to try again.";
	}

	function toggleMic() {
		if (!provider) return;
		if (listening) {
			provider.stop();
			voiceState = 'idle';
			transcript = '';
		} else {
			error = '';
			transcript = '';
			feedback = '';
			provider.start();
		}
	}

	function handleCommand(text: string) {
		const command = parse(text, language);
		if (command.intent === 'unknown') {
			setFeedback("Sorry, I didn't understand that.");
			return;
		}
		apply(command);
	}

	function apply(command: Command) {
		switch (command.intent) {
			case 'add':
				return add(command);
			case 'remove':
				return remove(command);
			case 'change':
				return change(command);
			case 'clear':
				return clearList();
			case 'search':
				return search(command);
			default:
				return setFeedback("Sorry, I didn't understand that.");
		}
	}

	function search(command: Command) {
		const query = command.item ?? '';
		const items = searchCatalog(CATALOG, query, command.filter ?? {});
		if (items.length === 0) {
			setFeedback(`No matches for “${query}”.`);
			return;
		}
		searchResults = { query, items };
		setFeedback(`Found ${items.length} result${items.length === 1 ? '' : 's'}.`);
	}

	function add(command: Command) {
		if (!command.item) return setFeedback("Sorry, I didn't catch the item.");
		addByName(command.item, command.quantity?.value ?? 1, command.quantity?.unit ?? 'item');
	}

	function addByName(name: string, quantity = 1, unit = 'item') {
		const category = categorize(name);

		const existing = items.find((item) => item.name === name && !item.checked);
		if (existing) {
			existing.quantity += quantity;
			highlightId = existing.id;
		} else {
			const id = crypto.randomUUID();
			items = [...items, { id, name, category, quantity, unit, checked: false }];
			highlightId = id;
		}

		void data?.addToHistory(name, category);
		history = [...history, { name, category, purchasedAt: new Date().toISOString() }];
		persist();
		setFeedback(`Added ${name}`);
	}

	function remove(command: Command) {
		if (!command.item) return setFeedback("Sorry, I didn't catch the item.");
		const index = items.findIndex((item) => item.name === command.item);
		if (index === -1) return setFeedback(`I don't see ${command.item} on the list.`);
		removeAt(index);
	}

	function change(command: Command) {
		if (!command.item) return;
		const target = items.find((item) => item.name === command.item);
		if (!target) return setFeedback(`I don't see ${command.item} on the list.`);

		if (command.quantity) {
			target.quantity = command.quantity.value;
			target.unit = command.quantity.unit;
		}
		persist();
		setFeedback(`Updated ${command.item}.`);
	}

	function clearList() {
		if (items.length > 0) undo = { kind: 'clear', items };
		items = [];
		persist();
		setFeedback('Cleared the list.');
		scheduleUndoReset();
	}

	function removeAt(index: number) {
		const [removed] = items.splice(index, 1);
		items = items;
		undo = { kind: 'remove', item: removed, index };
		persist();
		setFeedback(`Removed ${removed.name}`);
		scheduleUndoReset();
	}

	function undoLast() {
		if (!undo) return;
		if (undo.kind === 'clear') {
			items = undo.items;
			setFeedback('Restored the list.');
		} else {
			items.splice(Math.min(undo.index, items.length), 0, undo.item);
			items = items;
			setFeedback(`Restored ${undo.item.name}`);
		}
		undo = null;
		clearTimeout(undoTimer);
		persist();
	}

	function scheduleUndoReset() {
		clearTimeout(undoTimer);
		undoTimer = setTimeout(() => (undo = null), 5000);
	}

	function persist() {
		if (data) void data.saveList(items);
	}

	function toggleItem(id: string) {
		const item = items.find((i) => i.id === id);
		if (!item) return;
		item.checked = !item.checked;
		items = items;
		persist();
		setFeedback(item.checked ? `Marked ${item.name}` : `Unmarked ${item.name}`);
	}

	function removeItem(id: string) {
		const index = items.findIndex((item) => item.id === id);
		if (index === -1) return;
		removeAt(index);
	}

	function onManualSubmit(event: SubmitEvent) {
		event.preventDefault();
		const text = manualText.trim();
		if (!text) return;
		manualText = '';
		handleCommand(text);
	}

	function onLanguageChange() {
		data?.setSetting('language', language);
		initProvider();
	}

	function saveKey(key: string) {
		deepgramKey = key;
		if (key) data?.setSetting('deepgramKey', key);
		else data?.setSetting('deepgramKey', '');
		settingsOpen = false;
		initProvider();
	}

	function clearKey() {
		deepgramKey = '';
		data?.setSetting('deepgramKey', '');
		settingsOpen = false;
		initProvider();
	}

	function setFeedback(message: string) {
		feedback = message;
		voiceState = 'confirming';
		speak(message, language);
		clearTimeout(feedbackTimer);
		feedbackTimer = setTimeout(() => {
			feedback = '';
			highlightId = null;
			voiceState = 'idle';
		}, 2500);
	}

	function capitalize(word: string): string {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}
</script>

<svelte:head>
	<title>Voice Shop</title>
	<meta name="description" content="A voice-first shopping list." />
</svelte:head>

<div class="mx-auto flex min-h-dvh w-full max-w-xl flex-col">
	<header class="flex items-center justify-between px-5 pt-5">
		<h1 class="text-lg font-semibold tracking-tight">Voice Shop</h1>
		<div class="flex items-center gap-2">
			<select
				class="rounded-lg border border-line bg-surface px-2 py-1.5 text-sm text-muted focus:border-accent"
				bind:value={language}
				onchange={onLanguageChange}
				aria-label="Recognition language"
			>
				<option value="en-US">English</option>
				<option value="hi-IN">हिन्दी</option>
				<option value="es-ES">Español</option>
			</select>
			<button
				type="button"
				class="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
				onclick={() => (settingsOpen = true)}
				aria-label="Settings"
			>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-5 w-5"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="3" />
					<path
						d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
					/>
				</svg>
			</button>
		</div>
	</header>

	<main class="flex flex-1 flex-col px-5 pb-48 pt-6">
		<form onsubmit={onManualSubmit} class="mb-6">
			<input
				type="text"
				class="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[16px] placeholder:text-muted focus:border-accent"
				placeholder="Or type an item, e.g. “2 bottles of water”"
				aria-label="Add item by typing"
				bind:value={manualText}
			/>
		</form>

		<details class="mb-6 rounded-xl border border-line bg-surface px-4 py-3">
			<summary class="cursor-pointer text-sm font-medium text-ink">What can I say?</summary>
			<ul class="mt-3 space-y-1 text-sm text-muted">
				<li>“add two bottles of water”</li>
				<li>“remove milk”</li>
				<li>“change milk to 3 cartons”</li>
				<li>“clear the list”</li>
				<li>“find toothpaste under $5”</li>
			</ul>
		</details>

		{#if searchResults}
			<SearchResults
				query={searchResults.query}
				results={searchResults.items}
				onAdd={addByName}
				onClose={() => (searchResults = null)}
			/>
		{/if}

		<SuggestionRail {suggestions} onAdd={addByName} />

		{#if items.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
				<h2 class="text-2xl font-semibold tracking-tight">Your list is empty</h2>
				<p class="text-muted">Speak or type an item to get started.</p>
			</div>
		{:else}
			<div class="mb-4 flex items-center justify-between">
				<p class="text-sm text-muted">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
				<button
					type="button"
					class="text-sm font-medium text-warn hover:text-ink"
					onclick={clearList}
				>
					Clear list
				</button>
			</div>
			<ul class="space-y-7">
				{#each groups as group (group.category)}
					<li>
						<h2 class="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted">
							{capitalize(group.category)}
						</h2>
						<ul class="space-y-2">
							{#each group.items as item (item.id)}
								<ListItem
									{item}
									highlighted={item.id === highlightId}
									onToggle={() => toggleItem(item.id)}
									onRemove={() => removeItem(item.id)}
								/>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		{/if}
	</main>
</div>

<div class="fixed inset-x-0 bottom-0 z-20 bg-canvas/90 backdrop-blur">
	<div class="mx-auto w-full max-w-xl px-5 pb-4 pt-2">
		{#if undo}
			<div
				class="mb-2 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-2 shadow-lg"
				transition:fade
			>
				<span class="text-sm text-ink">{undoLabel}</span>
				<button
					type="button"
					class="shrink-0 rounded-full bg-ink px-3 py-1 text-sm font-semibold text-white hover:bg-accent"
					onclick={undoLast}
				>
					Undo
				</button>
			</div>
		{/if}

		<p class="min-h-6 text-center text-[15px] leading-snug" aria-live="polite">
			{#if transcript}
				<span class="text-ink">“{transcript}”</span>
			{:else if error}
				<span class="text-warn">{error}</span>
			{:else if feedback}
				<span class="text-accent-ink">{feedback}</span>
			{:else}
				<span class="text-muted">Tap the mic and say “add milk”</span>
			{/if}
		</p>

		<div class="mt-2 flex justify-center">
			<MicButton state={voiceState} onclick={toggleMic} />
		</div>
	</div>
</div>

{#if settingsOpen}
	<Settings
		apiKey={deepgramKey}
		onSave={saveKey}
		onClear={clearKey}
		onClose={() => (settingsOpen = false)}
	/>
{/if}
