<script lang="ts">
	import dayjs from 'dayjs';
	import isToday from 'dayjs/plugin/isToday';
	import { Reminder, reminderStore } from '../state/reminders';
	import { L } from '../i18n-helper/i18n';
	import { lang } from '../state/lang';

	dayjs.extend(isToday);

	import { createEventDispatcher, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	export let month: number = dayjs().month();
	export let year: number = dayjs().year();
	export let reminder: Reminder = null;
	export let shownWeeks = 6;
	let schedule = createEventDispatcher();
	let dayOfWeek: number;
	let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
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

<section
	class="calendar"
	class:dark={$reminderStore.darkMode}
	class:light={!$reminderStore.darkMode}
>
	<button id="monthYearSkip" class="btn sr-only" on:click={focusDateSkip}>
		{L[$lang].SKIP_MONTHS()}
	</button>
	{#if !!present}
		<div class="grid split month-year--selection">
			<button class="btn prev" on:click={prevYear}>
				{year - 1}
				<span class="sr-only">
					{#if year - 1 < present.year()}
						{L[$lang].DATE_IN_PAST()}
					{/if}
				</span>
			</button>
			<div class="months">
				{#each months as mth, index}
					<button
						class="btn"
						class:selected={index === month}
						on:click={() => {
							month = index;
						}}
					>
						{L[$lang][mth]()}
						<span class="sr-only">
							{year}
							{#if year < present.year() || (year === present.year() && index < present.month())}
								{L[$lang].DATE_IN_PAST()}
							{/if}
						</span>
					</button>
				{/each}
			</div>
			<button class="btn next" on:click={nextYear}>
				{year + 1}
			</button>
		</div>
	{/if}

	<button id="dateSkip" class="btn sr-only" on:click={focusHour}>{L[$lang].SKIP_DAYS()}</button>
	<h2>{L[$lang].DATE_SELECTION()}</h2>
	<table>
		<caption>{L[$lang][months[month]]()} {year}</caption>
		<thead>
			<th>{L[$lang].SUN()}</th>
			<th>{L[$lang].MON()}</th>
			<th>{L[$lang].TUE()}</th>
			<th>{L[$lang].WED()}</th>
			<th>{L[$lang].THU()}</th>
			<th>{L[$lang].FRI()}</th>
			<th>{L[$lang].SAT()}</th>
		</thead>
		<tbody>
			{#each _weeks as week}
				<tr>
					{#each week as day}
						<td>
							<button
								class="btn"
								class:selected={day.isSame(selectedDate)}
								class:last-month={day.month() < month || day.year() < year}
								class:next-month={day.month() > month || day.year() > year}
								on:click={() => selectDate(day)}
							>
								{#if day.isSame(selectedDate)}
									<span class="sr-only">{L[$lang].SELECTED()}</span>
								{/if}
								{day.date()}
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<h2>{L[$lang].TIME_SELECTION()}</h2>
	<div class="grid time">
		<button id="ampm" class="btn ampm" on:click={() => (isAM = !isAM)}>
			{#if isAM}
				<span class="meridian" transition:slide>A</span>
			{:else}
				<span class="meridian" transition:slide>P</span>
			{/if}
			<div>M</div>
		</button>
		<label>
			<span class="sr-only">{L[$lang].HOUR()}</span>
			<input type="text" bind:value={hour} placeholder="12" />
		</label>
		<label>
			<span class="sr-only">{L[$lang].MINUTE()}</span>
			<input type="text" bind:value={minute} placeholder="00" />
		</label>
		<button class="btn" on:click={selectTime}>{L[$lang].SELECT_TIME()}</button>
	</div>
</section>

<style lang="scss">
	@use '../styles/variables' as vars;

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

	.light {
		.btn.next-month,
		.btn.last-month {
			background-color: vars.$light;
			color: vars.$dark;
		}
	}

	.dark {
		.btn.next-month,
		.btn.last-month {
			background-color: vars.$dark;
			color: vars.$light;
		}
	}

	.split {
		grid-template-columns: 1fr 3fr 1fr;
		width: 100%;
	}
	.months {
		display: grid;
		grid-template-columns: 3rem 3rem 3rem 3rem 3rem 3rem;
	}
	.time {
		grid-template-columns: 40px 50px 50px 100px;
	}

	.btn.selected {
		border-left: 5px solid #2e86ab;
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
