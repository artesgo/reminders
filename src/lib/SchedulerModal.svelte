<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Reminder } from '../state/reminders';
	import { reminderStore } from '../state/reminders';
	import SchedulerComponent from './SchedulerComponent.svelte';
	export let scheduler = false;
	export let reminder: Reminder = null;
	import { L } from '../i18n-helper/i18n';
	import { lang } from '../state/lang';
</script>

{#if scheduler}
	<div
		class="overlay"
		class:dark={$reminderStore.darkMode}
		class:light={!$reminderStore.darkMode}
		transition:fade={{ duration: 200 }}
	>
		<div class="scheduler">
			<div class="scheduler-items">
				<SchedulerComponent on:schedule {reminder} />
				<button class="btn" on:click={() => (scheduler = !scheduler)}>{L[$lang].CANCEL()}</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	$light: #fcfcfc;
	$dark: #1e1e24;

	.overlay {
		position: fixed;
		overflow-y: scroll;
		overflow-x: hidden;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #2e86ab59;
		box-shadow: 0 0 20px #2e86ab59;
	}
	.scheduler {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.scheduler-items {
		padding: 20px 20px;
		width: 450px;
		border-radius: 4px;
	}
	.dark .scheduler-items {
		background-color: $dark;
		box-shadow: 0 0 10px $dark;
	}
	.light .scheduler-items {
		background-color: $light;
		box-shadow: 0 0 10px $light;
	}
</style>
