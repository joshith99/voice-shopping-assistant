<script lang="ts">
	export interface Suggestion {
		kind: string;
		name: string;
	}

	let { suggestions, onAdd }: { suggestions: Suggestion[]; onAdd: (name: string) => void } =
		$props();
</script>

{#if suggestions.length > 0}
	<section class="mb-6" aria-label="Suggestions">
		<h2 class="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-muted">Suggestions</h2>
		<ul class="flex flex-wrap gap-2 pb-1">
			{#each suggestions as suggestion (suggestion.kind + suggestion.name)}
				<li class="shrink-0">
					<button
						type="button"
						class="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent-ink"
						onclick={() => onAdd(suggestion.name)}
					>
						<span class="text-xs text-muted">{suggestion.kind}</span>
						<span class="font-medium">{suggestion.name}</span>
					</button>
				</li>
			{/each}
		</ul>
	</section>
{/if}
