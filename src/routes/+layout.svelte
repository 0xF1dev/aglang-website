<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	@font-face {
		font-family: 'Tabular';
		font-display: swap;
		src: url('/Tabular-Variable.woff2');
	}

	:global(body) {
		background-color: #121212;
		color: #fff;
		margin: 0;
		font-family: 'Tabular';
	}
</style>
