<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Reminder } from '../state/reminders';
	import { reminderStore } from '../state/reminders';
	import SchedulerComponent from './SchedulerComponent.svelte';
	export let scheduler = false;
	export let reminder: Reminder = null;
	import { i18nObject } from '../i18n/i18n-node';
	import { lang } from '../state/lang';
	$: LL = i18nObject($lang);
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
				<button class="btn" on:click={() => (scheduler = !scheduler)}>{LL.CANCEL()}</button>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../styles/variables' as vars;

	.overlay {
		position: fixed;
		overflow-y: scroll;
		overflow-x: hidden;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: vars.$hilight-tpt;
		box-shadow: 0 0 20px vars.$hilight-tpt;
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
		background-color: vars.$dark;
		box-shadow: 0 0 10px vars.$dark;
	}
	.light .scheduler-items {
		background-color: vars.$light;
		box-shadow: 0 0 10px vars.$light;
	}
</style>
