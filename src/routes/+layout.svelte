<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/aglanglogo-small.avif';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div id="header">
	<a href="/">
		<div id="logo">
			<img src={logo} alt="Logo" />
			<span>Aglang</span>
		</div>
	</a>
	<div id="links">
		<a href="/download">download</a>
		<a href="/interpreter">try it</a>
		<a href="https://github.com/0xF1dev/aglang/blob/main/docs/reference.md">docs</a>
	</div>
</div>
<main>{@render children()}</main>

<style lang="scss">
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
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	#header {
		width: 100vw;
		position: sticky;
		top: 0;
		border-bottom: 1px solid white;
		padding: 2rem 0;
		display: flex;
		justify-content: space-around;
		background-color: #121212;
		z-index: 9999;

		a {
			color: white;
			text-decoration: none;

			#logo {
				display: flex;
				align-items: center;
				gap: 1.5rem;

				img {
					width: 48px;
				}

				span {
					font-size: 20px;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}

		#links {
			display: flex;
			align-items: center;
			gap: 2rem;

			a:hover {
				text-decoration: underline;
			}
		}
	}

	main {
		flex-grow: 1;
	}
</style>
