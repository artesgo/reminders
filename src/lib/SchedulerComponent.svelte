<script lang="ts">
	import dayjs from 'dayjs';
	import isToday from 'dayjs/plugin/isToday';
	import type { Reminder } from '../state/reminders';
	dayjs.extend(isToday);

	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	export let month: number = dayjs().month();
	export let year: number = dayjs().year();
	export let reminder: Reminder = null;
	export let shownWeeks = 6;
	let schedule = createEventDispatcher();
	let dayOfWeek: number;
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	let daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
	let _weeks: Array<any[]> = [];
	let selectedDate;
	let formattedDateTime;
	let present;
	let hour: number;
	let minute: number;
	let isAM: boolean;
	onMount(() => {
		if (reminder) {
			let reminderDate = dayjs(reminder.when);
			month = reminderDate.month();
			year = reminderDate.year();
			selectDate(reminderDate.startOf('day'));
			hour = reminderDate.hour();
			minute = reminderDate.minute();
		} else {
			// allows selection of am / pm
			isAM = dayjs().hour() < 12;
			// defaults schedule to next hour
			hour = dayjs().hour();
		}
		// don't use 24hr notation
		if (hour > 12) hour -= 12;
		// store present for comparison
		present = dayjs();
		focusMonthYearSkip();
	});
	$: {
		dayOfWeek =
			dayjs(`${year}-${month + 1}`)
				.startOf('month')
				.day() + 1;

		_weeks = [];
		// determine number of rows to render
		const numberOfWeeksInMonth = calculateNumberOfRowsInMonth(daysInMonth, dayOfWeek);

		// for each week
		for (let week = 0; week < numberOfWeeksInMonth; week++) {
			// render each day
			for (let day of [1, 2, 3, 4, 5, 6, 7]) {
				// the first of the month may start in the middle of the week
				// determine the offset e.g. 1st of Feb starts on Weds
				// january 31 would have offset day of -1
				// january 30 would be -2, etc...
				const offsetDay = week * 7 + day - dayOfWeek;

				let _day = dayjs(`${year}-${month + 1}`).add(offsetDay, 'days');
				// pre-select today
				if (_day.isToday()) {
					selectedDate = _day;
				}

				// create the week if it doesn't exist
				if (!_weeks[week]) {
					_weeks[week] = [];
				}

				// add day to week
				_weeks[week] = _weeks[week].concat([_day]);
			}
		}
	}

	function calculateNumberOfRowsInMonth(days, start) {
		if (!!shownWeeks) {
			return shownWeeks;
		} else {
			return Math.ceil((days + start) / 7);
		}
	}
	function selectDate(date) {
		selectedDate = date;
	}
	function selectTime() {
		let _hr = Number.parseInt(`${hour}`);
		// 12pm does not need to add 12
		if (!isAM && _hr !== 12) {
			_hr = _hr + 12;
		} else if (isAM && _hr === 12) {
			// account for 00:00, midnight
			_hr = 0;
		}
		let parseHr = `${_hr < 10 ? 0 : ''}${_hr ? _hr : 0}`;
		let parseMn = `${minute ? minute : 0}`;
		const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
		// get diff in minutes
		formattedDateTime = dayjs(`${formattedDate} ${parseHr}:${parseMn}:00`);
		const when = +formattedDateTime;
		schedule('schedule', { when });
	}
	function prevMonth() {
		month--;
		if (month < 0) {
			year--;
			month = 11;
		}
	}
	function nextMonth() {
		month++;
		if (month > 11) {
			year++;
			month = 0;
		}
	}
	function prevYear() {
		year--;
	}
	function nextYear() {
		year++;
	}
	function focusMonthYearSkip() {
		focusElementById('monthYearSkip');
	}
	function focusDateSkip() {
		focusElementById('dateSkip');
	}
	function focusHour() {
		focusElementById('ampm');
	}
	function focusElementById(id: string) {
		document.getElementById(id).focus();
	}
</script>

<section class="calendar">
	<button id="monthYearSkip" class="sr-only" on:click={focusDateSkip}>
		Skip Month and Year Selection
	</button>
	{#if !!present}
		<div class="grid split month-year--selection">
			<button class="prev" on:click={prevYear}>
				{year - 1}
				<span class="sr-only">
					{#if year - 1 < present.year()}
						dates would be in the past
					{/if}
				</span>
			</button>
			<div class="months">
				{#each months as mth, index}
					<button
						class:selected={index === month}
						on:click={() => {
							month = index;
						}}
					>
						{mth}
						<span class="sr-only">
							{year}
							{#if year - 1 < present.year() || (year === present.year() && index < present.month())}
								dates would be in the past
							{/if}
						</span>
					</button>
				{/each}
			</div>
			<button class="next" on:click={nextYear}>
				{year + 1}
			</button>
		</div>
	{/if}

	<button id="dateSkip" class="sr-only" on:click={focusHour}> Skip Date Selection </button>
	<h2>Date Selection</h2>
	<table>
		<caption>Calendar Month ({months[month]} / {year})</caption>
		<thead>
			<th>Sun</th>
			<th>Mon</th>
			<th>Tue</th>
			<th>Wed</th>
			<th>Thu</th>
			<th>Fri</th>
			<th>Sat</th>
		</thead>
		<tbody>
			{#each _weeks as week}
				<tr>
					{#each week as day}
						<td>
							<button
								class:selected={day.isSame(selectedDate)}
								class:last-month={day.month() < month || day.year() < year}
								class:next-month={day.month() > month || day.year() > year}
								on:click={() => selectDate(day)}
							>
								{#if day.isSame(selectedDate)}
									<span class="sr-only">Selected</span>
								{/if}
								{day.date()}
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<h2>Time Selection</h2>
	<div class="grid time">
		<button id="ampm" class="ampm" on:click={() => (isAM = !isAM)}>
			{#if isAM}
				<span class="meridian" transition:slide>A</span>
			{:else}
				<span class="meridian" transition:slide>P</span>
			{/if}
			<div>M</div>
		</button>
		<label>
			<span class="sr-only">Hour</span>
			<!-- validate only 0-23 no decimals -->
			<!-- mandatory field -->
			<input type="text" bind:value={hour} placeholder="12" />
		</label>
		<label>
			<span class="sr-only">Minute</span>
			<!-- validate only 0-59 no decimals -->
			<!-- optional field -->
			<input type="text" bind:value={minute} placeholder="00" />
		</label>
		<button on:click={selectTime}>Select Time</button>
	</div>
	selected date ({formattedDateTime ? formattedDateTime.date() : ''})
</section>

<style>
	.calendar {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.calendar h2 {
		text-align: center;
	}
	.ampm {
		position: relative;
	}
	.meridian {
		position: absolute;
		left: 0.5rem;
	}
	.ampm div {
		margin-left: 0.75rem;
	}
	.next-month,
	.last-month {
		background-color: #f0edee;
	}

	.split {
		grid-template-columns: 100px 1fr 100px;
		width: 100%;
	}
	.months {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	}
	.time {
		grid-template-columns: 40px 50px 50px 100px;
	}

	.selected {
		border-left: 10px solid #2e86ab;
		transition: 200ms;
	}

	table,
	.month-year--selection {
		margin-bottom: 1rem;
	}

	table button {
		width: 2.5rem;
		height: 2rem;
	}
</style>
