<script lang="ts">
	import Reminder from './lib/Reminder.svelte';
</script>

<main>
	<Reminder />
</main>

<style global>
	@font-face {
		font-family: 'Quicksand';
		src: local('Quicksand'), url('/font/static/Quicksand-Regular.ttf');
	}
	@font-face {
		font-family: 'QuicksandBold';
		src: local('QuicksandBold'), url('/font/static/Quicksand-Bold.ttf');
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
		color: #1e1e24;
		font-weight: 700;
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
		border: 1px solid #1e1e24;
		border-left: 2px solid #2e86ab;
		text-align: center;
	}

	input {
		border: 1px solid #1e1e24;
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
