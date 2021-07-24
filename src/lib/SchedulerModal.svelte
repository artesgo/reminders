<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Reminder } from '../state/reminders';
	import SchedulerComponent from './SchedulerComponent.svelte';
	export let scheduler = false;
	export let reminder: Reminder = null;
</script>

{#if scheduler}
	<div class="overlay" transition:slide={{ duration: 200 }}>
		<div class="scheduler">
			<div class="scheduler-items">
				<SchedulerComponent on:schedule {reminder} />
				<button on:click={() => (scheduler = !scheduler)}>Cancel</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		overflow-y: scroll;
		overflow-x: hidden;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #2e86abcb;
		box-shadow: 0 0 20px #2e86abcb;
	}
	.scheduler {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.scheduler-items {
		background-color: #fcfcfc;
		padding: 20px 20px;
		width: 450px;
		box-shadow: 0 0 10px #fcfcfc;
		border-radius: 4px;
	}
</style>
