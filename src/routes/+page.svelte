<script>
	import bg from '$lib/assets/bg.avif';
</script>

<svelte:head>
	<title>home | aglang</title>
</svelte:head>

<div id="wrapper">
	<div id="top">
		<img src={bg} alt="" />
		<h1>the language made to be simple.</h1>
		<sub>some say too much</sub>
		<div id="btn-wrapper">
			<a href="/download" class="landing-button">download</a>
			<a href="/interpreter" class="landing-button">try it</a>
			<a href="/learn" class="landing-button">learn</a>
		</div>
	</div>
	<div id="content">
		<div class="section">
			<h1>what is Aglang?</h1>
			<p>
				Aglang is an esoteric language made to be similar to Assembly: with just two registers and
				the stack available, it forces the developer to engineer creative ways to do simple things.
			</p>
		</div>
		<div id="example-1">
			<pre>
                <code>
1001000>\ $ H $;
1100101>\ $ e $;
1101100>\ $ l $;
1101100>\ $ l $;
1101111>\ $ o $;
101100>\ $ , $;
100000>\ $ (space) $;
1010111>\ $ W $;
1101111>\ $ o $;
1110010>\ $ r $;
1101100>\ $ l $;
1100100>\ $ d $;
100001>\ $ ! $;
1010>\ $ (newline) $;
                </code>
            </pre>
			<p>
				this is a simple hello world program, and it shows how Aglang manages output: to print a
				character, its ascii value can simply be moved into the stdout.
			</p>
		</div>
		<div id="example-2">
			<pre>
                <code>
1100>'; $ counter $
0>:; $ put 0 in the stack (marks end of the loop) $
0>:; $ temporary value that'll get deleted $
[
    :!; $ pop the first value from the stack $
    1>:; $ put 1 in the stack $
    '-1; $ remove 1 from the counter $
    '>:; $ push the counter in the stack
         (when it gets to zero, the loop will stop) $
];
$ pop a value from the stack; that would have
been a zero, since its the last value of the
counter that gets pushed before the loop stops $
:!;

$ actual fibonacci logic $
0>'; $ F(0) $
1>''; $ F(1) $
$ print F(0) and F(1) $
'>\#;
1010>\; $ newline $
''>\#;
1010>\; $ newline $
[ $ fibonacci loop $
    ''>:; $ put the current number in the stack $
    ''+'; $ sum numbers and save to register 1 $
    :>'; $ put the previous number in register 0 $
    :!; $ pop it from the stack $
    ''>\#; $ print the current number $
    1010>\; $ newline $
    :!; $ pop one of the counter 1's from the stack $
]

                </code>
            </pre>
			<p>
				and this is a fibonacci example: it prints the fibonacci sequence up to 233 (since that's
				the maximum that 8-bit integers can fit) and is a great example of how things have to be
				made in Aglang. in Aglang, you only have <strong>two registers</strong>, and they have to be
				used to keep track of the fibonacci numbers, so to make a counter, you have to use values in
				the stack followed by a zero to make the loop stop at the correct iteration. (aglang now
				supports labels, so this example is considered obsolete, but still good)
			</p>
		</div>
		<div class="section">
			<h1>how can i try it?</h1>
			<p>
				Aglang can be tried online in the <a href="/interpreter">web interpreter</a>, or, if you
				want to install it, you can use the <a href="/download">cli</a>: the cli includes an
				interpreter, a transpiler and a compiler.
			</p>
			<p>
				if you want to learn it, you can try the <a href="/learn">interactive tutorial</a>, or if
				you like a more theoretical approach, check out the
				<a href="https://github.com/0xF1dev/aglang/blob/main/docs/reference.md">docs</a>
			</p>
		</div>
	</div>
</div>

<style lang="scss">
	#wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 4rem;

		#top {
			width: 100vw;
			height: 78vh;
			position: relative;
			overflow: hidden;
			border-bottom: 1px solid white;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			img {
				position: absolute;
				width: 100%;
				height: 100%;
				object-fit: cover;
				filter: brightness(30%);
				z-index: -1;
			}

			#btn-wrapper {
				margin: 2rem 0 4rem 0;
				display: flex;
				gap: 2rem;

				.landing-button {
					border-radius: 4px;
					border: none;
					padding: 10px 16px;
					font-family: 'Tabular';
					cursor: pointer;
					transition: 0.2s;
					background-color: white;
					color: black;
					text-decoration: none;

					&:hover:not(:disabled) {
						background-color: #757575;
					}

					&:active:not(:disabled) {
						background-color: #595959;
					}
				}
			}
		}

		#content {
			width: 80vw;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 2rem;

			.section {
				display: flex;
				flex-direction: column;
				align-items: center;

				p {
					width: 50%;
					text-align: center;

					a {
						color: white;
						font-weight: bold;
					}
				}
			}

			#example-1,
			#example-2 {
				display: flex;
				justify-content: center;
				width: fit-content;
				max-width: 80%;
				gap: 2rem;
				margin: 1rem 0;

				pre {
					background-color: #212121;
					padding: 0 1rem;
					border-radius: 8px;
					min-width: 50%;
				}

				p {
					text-align: end;
					max-width: 50%;
				}
			}

			#example-2 {
				flex-direction: row-reverse;

				p {
					text-align: start;
				}
			}
		}
	}
</style>
