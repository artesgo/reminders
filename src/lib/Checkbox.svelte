<script lang="ts">
	import { fade } from 'svelte/transition';

	export let id;
	export let value;
</script>

<label class="atg-checkbox">
	<input {id} class="sr-only" type="checkbox" bind:checked={value} on:change />
	<span class="checkmark">
		{#if value}
			<span class="checked" transition:fade={{ duration: 200 }} />
		{/if}
	</span>
	<slot />
</label>
