<script>
	import linuxLogo from '$lib/assets/linux.webp';
	import windowsLogo from '$lib/assets/windows.webp';
</script>

<svelte:head>
    <title>download | aglang</title>
</svelte:head>

<div id="wrapper">
	<h1>download Aglang</h1>
	<div id="btns">
		<a
			href="https://github.com/0xF1dev/aglang/releases/latest/download/aglang-linux-x86_64"
			class="download-btn"><img src={linuxLogo} alt="" />Linux</a
		>
		<a
			href="https://github.com/0xF1dev/aglang/releases/latest/download/aglang-windows-x86_64.exe"
			class="download-btn"><img src={windowsLogo} alt="" />Windows</a
		>
	</div>
	<div class="section">
		<h1>install from source</h1>
		<p>if your os isn't listed above, you can install the Aglang cli with this command:</p>
		<code>cargo install --git=https://github.com/0xF1dev/aglang.git</code>
		<sub>(ensure you have rust's cargo installed)</sub>
	</div>
	<div class="section">
		<h1>usage</h1>
		<p>
			the usage is described in the github <a href="https://github.com/0xF1dev/aglang#usage"
				>readme</a
			>
		</p>
	</div>
</div>

<style lang="scss">
	#wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 4rem;

		#btns {
			display: flex;
			gap: 2rem;
			margin-bottom: 4rem;

			.download-btn {
				border-radius: 4px;
				border: none;
				padding: 10px 16px;
				font-family: 'Tabular';
				cursor: pointer;
				transition: 0.2s;
				background-color: white;
				color: black;
				text-decoration: none;
				display: flex;
				align-items: center;
				gap: 1rem;

				&:hover:not(:disabled) {
					background-color: #757575;
				}

				&:active:not(:disabled) {
					background-color: #595959;
				}

				img {
					width: 32px;
				}
			}
		}

		.section {
			display: flex;
			flex-direction: column;
			align-items: center;
            margin-bottom: 2rem;

            h1 {
                margin: 0;
            }

			p {
				width: 80%;
				text-align: center;
                margin-bottom: 0;

				a {
					color: white;
					font-weight: bold;
				}
			}

            code {
                margin: 0.75rem 0;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                background-color: #212121;
            }
		}
	}
</style>
