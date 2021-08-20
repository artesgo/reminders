<script lang="ts">
	import dayjs from 'dayjs';
	import type { Reminder } from '../state/reminders';
	import { createUpdateItem, deleteItem } from '../state/reminder-actions';
	import { onDestroy, onMount } from 'svelte';
	import SchedulerModal from './SchedulerModal.svelte';
	import { L } from '../i18n-helper/i18n';
	import { lang } from '../state/lang';

	export let reminder: Reminder;
	let _edit = false;
	let _when;
	let _diff;
	let _minutes;
	let _hours;
	let _past;
	let interval;

	onMount(() => {
		updateTimes();
		interval = setInterval(updateTimes, 10000);
	});

	function updateTimes() {
		// without +, it will attempt to parse as string which returns wildly diff results
		_when = dayjs(+reminder.when);
		_diff = _when.diff(dayjs(), 'minutes');
		_minutes = Math.abs(_diff % 60);
		_hours = Math.abs(Math.floor(_diff / 60));
		_past = _diff < 0;
	}

	onDestroy(() => {
		clearInterval(interval);
	});
	$: when = `${_hours}:${_minutes < 10 ? '0' : ''}${_minutes}`;

	function schedule({ when, recur }) {
		reminder.when = when;
		reminder.recur = recur;
		createUpdateItem(reminder, true, false);
		updateTimes();
		scheduler = false;
		_edit = false;
	}
	let scheduler = false;
</script>

<div class="grid row" on:dblclick={() => (_edit = !_edit)}>
	{#if !_edit}
		<div class="reminder-array">
			{#if _past}
				<span class="countdown expired">{L[$lang].EXPIRED()}</span>
			{:else}
				<span class="countdown">{`${when}`}</span>
			{/if}
			<div class="description">
				{reminder.description}
			</div>
			<span class="url">
				{#if !!reminder.url}
					<a href={reminder.url} target="_blank">{L[$lang].LINK()}</a>
				{/if}
			</span>
		</div>
	{:else}
		<div class="reminder-array">
			<button class="btn no-right-border" on:click={() => (scheduler = !scheduler)}
				>{L[$lang].UPDATE_TIME()}</button
			>
			<label>
				<div class="sr-only">{L[$lang].DESCRIPTION()}</div>
				<input type="text" bind:value={reminder.description} />
			</label>
			<label>
				<div class="sr-only">{L[$lang].URL()}</div>
				<input type="text" bind:value={reminder.url} />
			</label>
		</div>
	{/if}
	<div class="sub-grid controls">
		{#if _edit}
			<button
				class="btn no-right-border"
				on:click={() => createUpdateItem(reminder, true, false)}
				on:click={() => (_edit = !_edit)}>{L[$lang].SAVE()}</button
			>
		{:else}
			<button class="btn no-right-border" on:click={() => (_edit = !_edit)}
				>{L[$lang].EDIT()}</button
			>
		{/if}
		<button class="btn" on:click={() => deleteItem(reminder)}>{L[$lang].DELETE()}</button>
	</div>
</div>

<SchedulerModal bind:scheduler on:schedule={(data) => schedule({ ...data.detail })} {reminder} />

<style>
	.grid {
		margin: 4px 0;
	}
	.sub-grid.controls {
		display: grid;
		grid-template-columns: 50% 50%;
	}
	.controls button {
		height: 1.5rem;
	}
	.grid button {
		border-left: 2px solid #2e86ab;
	}

	.reminder-array .url,
	.reminder-array .countdown {
		text-align: right;
		padding-right: 1rem;
	}
</style>
