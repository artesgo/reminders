<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { reminderStore } from '../state/reminders';
	import { addReminder, createList, parseStorage } from '../state/reminder-actions';
	import { reminderList, takodachiMode } from '../state/reminder-selector';
	import type { Reminder } from './../state/reminders';
	import ReminderComponent from './ReminderComponent.svelte';
	import SchedulerModal from './SchedulerModal.svelte';

	let expanded = {};
	let newItem = {};
	let newUrl = {};
	let _list = '';
	onMount(() => {
		getPreviousAlarms();
		chrome.runtime.onMessage.addListener((msg) => contextListener(msg));
	});

	function contextListener(message) {
		if (!!message.contextCreateLink) {
			for (let ordered of $reminderList) {
				newUrl[ordered.list] = message.contextCreateLink;
			}
		}
	}

	function _sort(list: Reminder[], by: string) {
		return list.sort((a, b) => {
			return a[by] - b[by];
		});
	}

	function _toggle(list) {
		expanded[list] = !expanded[list];
	}

	function _getItemLength(list: Reminder[]) {
		return `(${list.length} item${list.length === 1 ? '' : 's'})`;
	}

	function _addItem(list: string, order: number, populated: boolean) {
		const index = ++$reminderStore.index;
		addReminder(order, list, newItem[list], _when, newUrl[list], populated, index);
	}

	function _createList() {
		createList(_list, ++$reminderStore.listOrder);
	}

	function getPreviousAlarms() {
		chrome.runtime.sendMessage({ previousSchedules: true }, function (response) {
			if (response && response.alarms) {
				if (!$reminderStore.populated) {
					parseStorage(response.alarms);
					expanded = $reminderList.map((list) => {
						expanded = {
							...expanded,
							[list.list]: false,
						};
					});
				}
			}
		});
	}

	let _when;
	let scheduler = false;
	function schedule({ when }) {
		_when = when;
		scheduler = false;
	}
</script>

<div class="grid row">
	<label>
		<span class="sr-only">Create Reminder Group</span>
		<input type="text" bind:value={_list} placeholder={`Create Reminder Group`} />
	</label>
	<button class="btn" on:click={_createList}>Create Group</button>
</div>

<section aria-hidden={scheduler}>
	<!-- get list by keys -->
	{#each $reminderList as ordered}
		<button class="btn accordion" on:click={() => _toggle(ordered.list)}>
			<h2 class="align-vertical">
				{#if $takodachiMode}
					{#if expanded[ordered.list]}
						<img class="sunny tiny" src="/svg/takodachi-bonk.svg" role="presentation" alt="" />
					{:else}
						<img class="sunny tiny" src="/svg/takodachi.svg" role="presentation" alt="" />
					{/if}
				{:else}
					<img
						class:open={expanded[ordered.list]}
						src="/svg/arrow-down--blue.svg"
						role="presentation"
						alt=""
						style="width: 2rem; height: 2rem;"
					/>
				{/if}
				{ordered.list.toUpperCase()}
				{_getItemLength($reminderStore.reminders[ordered.order][ordered.list])}
			</h2>
		</button>
		{#if expanded[ordered.list]}
			<div class="list-container" transition:slide={{ duration: 200 }}>
				<div class="list-adder grid row">
					<div class="reminder-array">
						<button class="btn no-right-border" on:click={() => (scheduler = !scheduler)}
							>Calendar</button
						>
						<label>
							<span class="sr-only">Reminder Description</span>
							<input
								class="description"
								type="text"
								bind:value={newItem[ordered.list]}
								placeholder={`Reminder Description`}
							/>
						</label>
						<label>
							<span class="sr-only">Reminder URL</span>
							<input
								class="url"
								type="text"
								bind:value={newUrl[ordered.list]}
								placeholder={`Reminder url`}
							/>
						</label>
					</div>
					<button class="btn" on:click={() => _addItem(ordered.list, ordered.order, true)}
						>Add Item</button
					>
				</div>
				<!-- should include key to prevent  -->
				{#each _sort($reminderStore.reminders[ordered.order][ordered.list], 'when') as reminder (reminder.id)}
					<ReminderComponent {reminder} />
				{:else}
					<div class="no-items">no reminders here</div>
				{/each}
			</div>
		{/if}
	{:else}
		<h2 class="no-items">
			You have no more reminders
			{#if $takodachiMode}
				<img class="sunny" src="/svg/takodachi.svg" role="presentation" alt="" />
			{:else}
				<img class="sunny" src="/svg/sun.svg" role="presentation" alt="" />
			{/if}
		</h2>
	{/each}
</section>

<SchedulerModal bind:scheduler on:schedule={(data) => schedule({ ...data.detail })} />

<style>
	[aria-hidden] {
		overflow: hidden;
	}

	h2 {
		font-size: 1rem;
		font-weight: 300;
	}
	h2 img {
		margin-right: 0.5rem;
		transform: rotate(180deg);
		transition: 200ms;
	}
	h2 img.open {
		transform: rotate(0deg);
	}
	.list-adder input {
		border-right: none;
	}
	.list-adder button {
		border-left: 2px solid #2e86ab;
	}
	input.url,
	input.description {
		margin-left: 0;
	}

	.accordion {
		padding: 0px;
		background: none;
		border: none;
		width: 100%;
		text-align: left;
	}
	.no-items {
		margin: 4px 0 4px 2.5rem;
	}

	h2.no-items {
		margin-top: 2rem;
		display: flex;
		align-items: center;
	}
	.sunny {
		animation: sun 3s infinite;
	}
	.tiny {
		width: 2rem;
		height: 2rem;
	}

	@keyframes sun {
		0% {
			transform: rotate(-7deg);
		}
		50% {
			transform: rotate(7deg);
		}
		100% {
			transform: rotate(-7deg);
		}
	}
</style>
