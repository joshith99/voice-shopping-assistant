<script lang="ts">
	import type { ListItem as Item } from '$lib/data/types';

	let {
		item,
		onToggle,
		onRemove,
		highlighted = false
	}: { item: Item; onToggle: () => void; onRemove: () => void; highlighted?: boolean } = $props();

	const IRREGULAR: Record<string, string> = { box: 'boxes', loaf: 'loaves', dozen: 'dozen' };

	function pluralize(unit: string, qty: number): string {
		if (qty === 1 || unit === 'item') return unit;
		return IRREGULAR[unit] ?? `${unit}s`;
	}

	const quantityLabel = $derived.by(() => {
		if (item.unit === 'item' && item.quantity === 1) return '';
		if (item.unit === 'item') return `${item.quantity}`;
		return `${item.quantity} ${pluralize(item.unit, item.quantity)}`;
	});
</script>

<li
	class="group flex items-center gap-3 rounded-xl bg-surface px-4 py-3 transition-colors"
	class:bg-accent-soft={item.checked}
	class:ring-2={highlighted}
	class:ring-accent={highlighted}
>
	<input
		type="checkbox"
		class="h-5 w-5 shrink-0 cursor-pointer rounded accent-accent"
		checked={item.checked}
		onchange={onToggle}
		aria-label={`${item.checked ? 'Unmark' : 'Mark'} ${item.name}`}
	/>

	<span
		class="flex-1 truncate text-[17px] leading-snug"
		class:text-muted={item.checked}
		class:line-through={item.checked}
	>
		{item.name}
	</span>

	{#if quantityLabel}
		<span class="tabular text-sm text-muted">{quantityLabel}</span>
	{/if}

	<button
		type="button"
		class="remove grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted opacity-0 transition-opacity hover:bg-canvas hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
		onclick={onRemove}
		aria-label={`Remove ${item.name}`}
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
</li>

<style>
	@media (hover: none) {
		.remove {
			opacity: 1;
		}
	}
</style>
