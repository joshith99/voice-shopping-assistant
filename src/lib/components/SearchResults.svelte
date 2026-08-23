<script lang="ts">
	import type { CatalogItem } from '$lib/catalog/seed';

	let {
		query,
		results,
		onAdd,
		onClose
	}: {
		query: string;
		results: CatalogItem[];
		onAdd: (name: string) => void;
		onClose: () => void;
	} = $props();
</script>

<section class="mb-6 rounded-xl border border-line bg-surface p-4" aria-label="Search results">
	<header class="mb-3 flex items-center justify-between">
		<h2 class="text-sm font-semibold">
			Results for “{query}”
			<span class="font-normal text-muted">({results.length})</span>
		</h2>
		<button
			type="button"
			class="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
			onclick={onClose}
			aria-label="Close search results"
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

	{#if results.length === 0}
		<p class="text-sm text-muted">No items matched. Try a broader search.</p>
	{:else}
		<ul class="divide-y divide-line">
			{#each results as item (item.name)}
				<li class="flex items-center gap-3 py-2.5">
					<div class="min-w-0 flex-1">
						<p class="truncate text-[15px]">{item.name}</p>
						<p class="text-sm text-muted">
							{item.brand} · {item.size}
						</p>
					</div>
					<span class="tabular text-sm text-muted">${item.price.toFixed(2)}</span>
					<button
						type="button"
						class="shrink-0 rounded-full bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent-ink"
						onclick={() => onAdd(item.name)}
					>
						Add
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</section>
