<script lang="ts">
	import { lang } from './state/lang';
	import { onMount } from 'svelte';
	import { L } from './i18n-helper/i18n';
	import Reminder from './lib/Reminder.svelte';
	import { reminderStore } from './state/reminders';
	onMount(() => {
		$reminderStore.darkMode = localStorage.getItem('darkMode') === 'true';
	});

	function toggleDarkMode() {
		$reminderStore.darkMode = !$reminderStore.darkMode;
		localStorage.setItem('darkMode', $reminderStore.darkMode ? 'true' : 'false');
	}

	function toggleLang() {
		$lang === 'en' ? ($lang = 'jp') : ($lang = 'en');
	}
</script>

<div class="container" class:dark={$reminderStore.darkMode} class:light={!$reminderStore.darkMode}>
	<main>
		<header>
			<button class="btn-icon" on:click={toggleDarkMode}>
				{#if $reminderStore.darkMode}
					<div class="sr-only">{L[$lang].LIGHT()}</div>
					<img src="./svg/sun.svg" role="presentation" alt="" />
				{:else}
					<div class="sr-only">{L[$lang].DARK()}</div>
					<img src="./svg/moon.svg" role="presentation" alt="" />
				{/if}
			</button>
			<h1>{L[$lang].TITLE()}</h1>
			<!-- <button class="btn" on:click={toggleLang}>
				{#if $lang === 'en'}
					jp
				{:else}
					en
				{/if}
			</button> -->
			<div class="spacer" />
		</header>
		<Reminder />
		<style>
			header {
				display: grid;
				grid-template-columns: auto 1fr auto;
			}

			header img {
				width: 32px;
				height: 32px;
			}
		</style>
	</main>
</div>

<style lang="scss" global>
	@use './_globals';

	main {
		min-height: 600px;
	}
	.grid {
		display: grid;
	}
	.grid.half-half {
		grid-template-columns: 50% 50%;
	}
	.grid.row {
		grid-template-columns: 1fr 10rem;
	}
	.align-vertical {
		display: flex;
		align-items: center;
	}
	.reminder-array {
		display: grid;
		grid-template-columns: 6rem 1fr 7rem;
	}
	label input {
		box-sizing: border-box;
	}
	input {
		padding-left: 0.5rem;
		border-left: 2px solid #2e86ab;
		border-right: none;
		height: 1.5rem;
		transition: 200ms;
		width: 100%;
	}
	input:hover,
	input:focus {
		border-left: 5px solid #2e86ab;
	}
</style>
