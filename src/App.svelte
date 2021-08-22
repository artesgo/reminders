<script lang="ts">
	import type { Locales } from './i18n/i18n-types';
	import { lang } from './state/lang';
	import { onMount } from 'svelte';
	import { i18nObject } from './i18n/i18n-node';
	import Reminder from './lib/Reminder.svelte';
	import { reminderStore } from './state/reminders';
	$: LL = i18nObject($lang);
	onMount(() => {
		$reminderStore.darkMode = localStorage.getItem('darkMode') === 'true';
		if (!!localStorage.getItem('lang')) {
			$lang = localStorage.getItem('lang') as Locales;
		}
	});

	function toggleDarkMode() {
		$reminderStore.darkMode = !$reminderStore.darkMode;
		localStorage.setItem('darkMode', $reminderStore.darkMode ? 'true' : 'false');
	}

	function toggleLang() {
		$lang === 'en' ? ($lang = 'jp') : ($lang = 'en');
		localStorage.setItem('lang', $lang);
	}
</script>

<div class="container" class:dark={$reminderStore.darkMode} class:light={!$reminderStore.darkMode}>
	<main>
		<header>
			<button class="btn-icon" on:click={toggleDarkMode}>
				{#if $reminderStore.darkMode}
					<div class="sr-only">{LL.LIGHT()}</div>
					<img src="./svg/sun.svg" role="presentation" alt="" />
				{:else}
					<div class="sr-only">{LL.DARK()}</div>
					<img src="./svg/moon.svg" role="presentation" alt="" />
				{/if}
			</button>
			<h1>{LL.TITLE()}</h1>
			<button class="btn lang-toggle" on:click={toggleLang}>
				{#if $lang === 'en'}
					{LL.JP()}
				{:else}
					{LL.EN()}
				{/if}
			</button>
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
	<footer>
		<a href="https://ko-fi.com/artesra" target="_blank">{LL.COFFEE()}</a>
		<a href="https://github.com/artesgo/reminders/issues" target="_blank">{LL.SUPPORT()}</a>
	</footer>
</div>

<style lang="scss" global>
	@use './_globals';
	@use './styles/variables' as vars;

	main {
		min-height: 500px;
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
		border-left: 2px solid vars.$hilight;
		border-right: none;
		height: 1.5rem;
		transition: 200ms;
		width: 100%;
	}
	input:hover,
	input:focus {
		border-left: 5px solid vars.$hilight;
	}

	.lang-toggle {
		height: 75%;
	}

	footer {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
	}
</style>
