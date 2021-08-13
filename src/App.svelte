<script lang="ts">
	import { onMount } from 'svelte';
	import Reminder from './lib/Reminder.svelte';
	import { reminderStore } from './state/reminders';
	onMount(() => {
		$reminderStore.darkMode = localStorage.getItem('darkMode') === 'true';
	});

	function toggleDarkMode() {
		$reminderStore.darkMode = !$reminderStore.darkMode;
		localStorage.setItem('darkMode', $reminderStore.darkMode ? 'true' : 'false');
	}
</script>

<div class="container" class:dark={$reminderStore.darkMode} class:light={!$reminderStore.darkMode}>
	<main>
		<header>
			<button class="btn-icon" on:click={toggleDarkMode}>
				{#if $reminderStore.darkMode}
					<div class="sr-only">Show Light Mode</div>
					<img src="./svg/sun.svg" role="presentation" alt="" />
				{:else}
					<div class="sr-only">Show Dark Mode</div>
					<img src="./svg/moon.svg" role="presentation" alt="" />
				{/if}
			</button>
			<h1>Reminders</h1>
			<div class="spacer" />
		</header>
		<Reminder />
		<style>
			header {
				display: grid;
				grid-template-columns: 32px 1fr 32px;
			}

			header img {
				width: 32px;
				height: 32px;
			}
		</style>
	</main>
</div>

<style lang="scss" global>
	$light: #fcfcfc;
	$dark: #1e1e24;
	@font-face {
		font-family: 'Quicksand';
		src: local('Quicksand'), url('/font/static/Quicksand-Regular.ttf');
	}
	@font-face {
		font-family: 'QuicksandBold';
		src: local('QuicksandBold'), url('/font/static/Quicksand-Bold.ttf');
	}

	body {
		padding: 0;
		margin: 0;
	}

	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	nav,
	main {
		margin: 0 auto;
		font-family: 'Quicksand' !important;
		box-sizing: border-box;
		font-weight: 700;
	}

	.container {
		height: 100vh;
		padding: 1rem;
		transition: 300ms;
		&.dark {
			background: $dark;
			color: $light;
		}
		&.light {
			background: $light;
			color: $dark;
		}
	}

	button.btn.no-right-border {
		border-right: none;
	}

	nav,
	main {
		width: 600px;
	}

	main {
		min-height: 600px;
	}

	button {
		background: none;
		text-align: center;
		border: none;
		cursor: pointer;
	}

	button.btn {
		border-left: 2px solid #2e86ab;
		color: currentColor;
	}

	a {
		text-decoration: none;
		cursor: pointer;
	}

	.dark {
		.btn {
			border: 1px solid $light;
		}
		a {
			color: $light;
		}
	}
	.light {
		.btn {
			border: 1px solid $dark;
		}
		a {
			color: $dark;
		}
	}

	input {
		border: 1px solid $dark;
	}

	.grid {
		display: grid;
	}
	.grid.half-half {
		grid-template-columns: 50% 50%;
	}
	.grid.row {
		grid-template-columns: 1fr 8rem;
	}
	.align-vertical {
		display: flex;
		align-items: center;
	}
	.reminder-array {
		display: grid;
		grid-template-columns: 6rem 1fr 6rem;
	}
	.sr-only {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
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
		border-left: 10px solid #2e86ab;
	}
	::-webkit-scrollbar {
		width: 4px;
	}

	::-webkit-scrollbar-thumb {
		background: #2e86ab;
	}
</style>
