<script lang="ts">
	import { StreamLanguage } from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { EditorView, keymap } from '@codemirror/view';
	import CodeMirror from 'svelte-codemirror-editor';
	import { tick } from 'svelte';
	import { closeBracketsKeymap } from '@codemirror/autocomplete';
	import { EditorState } from '@codemirror/state';

	import logoSmall from '$lib/assets/aglanglogo-small.avif';

	const aglang = StreamLanguage.define({
		startState() {
			return { inComment: false };
		},
		token(stream, state) {
			if (state.inComment) {
				while (!stream.eol()) {
					if (stream.next() === '$') {
						state.inComment = false;
						break;
					}
				}
			}

			if (stream.eatSpace()) return null;

			if (stream.match('$')) {
				state.inComment = true;
				while (!stream.eol()) {
					if (stream.next() === '$') {
						state.inComment = false;
						break;
					}
				}
				return 'comment';
			}

			if (stream.match("''")) return 'variableName';
			if (stream.match('\\#')) return 'labelName';

			const ch = stream.next();

			if (ch === '[' || ch === ']') return 'bracket';

			if (ch === '0' || ch === '1') return 'literal';

			if (['+', '-', '*', '/', '%', '>', '!', '|'].includes(ch || '')) return 'operator';

			if (ch === '"' || ch === "'" || ch === ':') return 'variableName';

			if (ch === '\\') return 'labelName';

			if (ch === ';') return 'separator';

			return 'invalid';
		}
	});

	const highlightStyle = HighlightStyle.define([
		{ tag: tags.bracket, color: '#39ff14', fontWeight: 'bold' },
		{ tag: tags.literal, color: '#ff007f' },
		{ tag: tags.operator, color: '#ff9e00' },
		{ tag: tags.variableName, color: '#00e5ff' },
		{ tag: tags.labelName, color: '#a020f0' },
		{ tag: tags.comment, color: '#5c6370', fontStyle: 'italic' },
		{ tag: tags.separator, color: '#e0e0e0' },
		{ tag: tags.invalid, color: '#ffffff', backgroundColor: '#e06c75' }
	]);

	const baseStyle = EditorView.theme({
		'&': {
			height: '100%',
			width: '100%'
		},
		'.cm-line:not(.cm-activeLine) .cm-selectionBackground': {
			backgroundColor: '#999'
		},
		'.cm-activeLine': {
			backgroundColor: '#1f1f1fdd'
		},
		'.cm-content': {
			caretColor: '#fff'
		},
		'&.cm-focused .cm-cursor': {
			borderLeftColor: '#fff'
		},
		'.cm-gutters': {
			backgroundColor: '#333',
			borderColor: '#333'
		},
		'.cm-gutter': {
			backgroundColor: '#333'
		},
		'.cm-gutterElement': {
			backgroundColor: '#333'
		},
		'&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
			backgroundColor: '#ddd !important'
		},
		'&::selection': {
			backgroundColor: '#ddd',
			background: '#ddd'
		}
	});

	let programState = $state({
		stack: [] as number[],
		r0: 0,
		r1: 0,
		instructionPointer: 0,
		loops: [] as number[],
		stopped: true,
		executionDone: false
	});

	let example = $state('default');

	let code = $derived.by(() => {
		switch (example) {
			case 'default':
				return '';
			case 'helloWorld':
				return '1001000>\\ $ H $;\n1100101>\\ $ e $;\n1101100>\\ $ l $;\n1101100>\\ $ l $;\n1101111>\\ $ o $;\n101100>\\ $ , $;\n100000>\\ $ (space) $;\n1010111>\\ $ W $;\n1101111>\\ $ o $;\n1110010>\\ $ r $;\n1101100>\\ $ l $;\n1100100>\\ $ d $;\n100001>\\ $ ! $;\n1010>\\ $ (newline) $;\n';
			case 'fibonacci':
				return `$ this program prints fibonacci numbers up to 233 (the max for an unsigned 8bit integer) $
$ the first part of this program puts 13 values in the stack to make the fibonacci loop run 13 times $
$ there arent other ways to do this because of the 2 register limitation $

1100>'; $ counter $
0>:; $ put 0 in the stack (marks end of the actual fibonacci loop) $
0>:; $ this will get deleted at the start of the first iteration of this loop $
[
    :!; $ pop the first value from the stack $
    1>:; $ put 1 in the stack $
    '-1; $ remove 1 from the counter $
    '>:; $ push the counter in the stack (when it gets to zero, the loop will stop) $
];
:!; $ pop a value from the stack; that would have been a zero, since its the last value of the counter that gets pushed before the loop stops $

$ actual fibonacci logic $
0>'; $ F(0) $
1>''; $ F(1) $
$ print F(0) and F(1) $
'>\\#;
1010>\\; $ newline $
''>\\#;
1010>\\; $ newline $
[ $ fibonacci loop $
    ''>:; $ put the current number in the stack $
    ''+'; $ sum current and previous number to the current number register $
    :>'; $ put the previous number (the old current number) in the previous number register $
    :!; $ pop it from the stack $
    ''>\\#; $ print the current number $
    1010>\\; $ newline $
    :!; $ pop one of the counter 1's from the stack $
]

				`;
			case 'mirror':
				return `$ this program reprints whatever the user writes $

|; $ gets user input from stdin and saves it in the stack (with a 0x00 at the bottom for delimiting, the values get stored in reverse order) $
[
:>\\; $ outputs top value in the stack $
:!; $ pops from the stack $
]

				`;
			default:
				return '';
		}
	});
	let output = $state('');
	let input = $state('');

	let isWaitingInput = $state(false);

	let statements: Statement[] = $state([]);

	let resumeInterpreter: ((arg0: string) => void) | null = null;

	let outputElement: HTMLTextAreaElement;

	async function scrollToBottom() {
		await tick();
		if (outputElement) {
			outputElement.scrollTop = outputElement.scrollHeight;
		}
	}
	$effect(() => {
		if (output) {
			scrollToBottom();
		}
	});

	enum SyntaxErrorType {
		InvalidToken = 'InvalidToken',
		InvalidArguments = 'InvalidArguments',
		InvalidSource = 'InvalidSource',
		InvalidDestination = 'InvalidDestination',
		InvalidStatement = 'InvalidStatement',
		ChainedOperations = 'ChainedOperations'
	}

	class SyntaxError extends Error {
		constructor(type: SyntaxErrorType) {
			super(`SyntaxError(${type})`);
			this.name = 'SyntaxError';

			Object.setPrototypeOf(this, SyntaxError.prototype);
		}
	}

	enum RuntimeErrorType {
		EmptyStackRead = 'EmptyStackRead'
	}

	class RuntimeError extends Error {
		constructor(type: RuntimeErrorType) {
			super(`RuntimeError(${type})`);
			this.name = 'RuntimeError';

			Object.setPrototypeOf(this, RuntimeError.prototype);
		}
	}

	function error(error: Error, statementNumber: number, msg: string) {
		output += `\n----------\nError ${error.message} on statement ${statementNumber + 1}: ${msg}\n----------\n`;
		programState.stopped = true;
	}

	const VALID_TOKENS = [
		';',
		'0',
		'1',
		'[',
		']',
		"'",
		'"',
		':',
		'\\',
		'#',
		'|',
		'>',
		'!',
		'+',
		'-',
		'*',
		'/',
		'%'
	];

	enum StatementTypes {
		Input,
		Copy,
		Remove,
		Add,
		Subtract,
		Multiply,
		Divide,
		Remainder,
		LoopStart,
		LoopEnd
	}

	type Argument =
		| { type: 'literal'; value: number }
		| { type: 'r0' }
		| { type: 'r1' }
		| { type: 'stack' }
		| { type: 'stdout'; asNumber: boolean }
		| null;

	interface Statement {
		type: StatementTypes | null;
		arg0: Argument | null;
		arg1: Argument | null;
	}

	function parse() {
		let statements: Statement[] = [];

		const commentRegex = /\$[\s\S]*?\$/g;
		let cleanCode = code.replaceAll(commentRegex, '');

		let src = '';
		for (const char of cleanCode) {
			if (VALID_TOKENS.includes(char)) {
				src += char;
			}
		}
		let rawStatements = src
			.trim()
			.split(';')
			.flatMap((s) => s.split(/(?<=[[\]])/))
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		rawStatements.forEach((statement, i) => {
			statements.push(parseStatement(statement, i));
		});

		return statements;
	}

	function parseStatement(statement: string, index: number): Statement {
		let statementObj: Statement = { type: null, arg0: null, arg1: null };

		let rawArgs = statement.split(/[|>\!+\-*/%\[\]]/).filter((s) => s.length > 0);

		if (rawArgs.length > 2) {
			error(
				new SyntaxError(SyntaxErrorType.ChainedOperations),
				index,
				'Cannot chain multiple operations.'
			);
			throw new SyntaxError(SyntaxErrorType.ChainedOperations);
		}

		let args: Argument[] = [];
		rawArgs.forEach((arg) => {
			const filteredArg = arg.trim();
			if (filteredArg.length > 0) {
				args.push(parseArgument(filteredArg, index));
			}
		});

		if (statement.includes('[')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.LoopStart} requires 0 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.LoopStart;
		} else if (statement.includes(']')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.LoopEnd} requires 0 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.LoopEnd;
		} else if (statement.includes('|')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Input} requires 0 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Input;
		} else if (statement.includes('>')) {
			if (args.length != 2) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Copy} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Copy;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		} else if (statement.includes('!')) {
			if (args.length != 1) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Remove} requires 1 argument, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Remove;
			statementObj.arg0 = args[0];
		} else if (statement.includes('+')) {
			if (args.length != 2) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Add} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Add;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		} else if (statement.includes('-')) {
			if (args.length != 2) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Subtract} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Subtract;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		} else if (statement.includes('*')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Multiply} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Multiply;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		} else if (statement.includes('/')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Divide} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Divide;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		} else if (statement.includes('%')) {
			if (args.length != 0) {
				error(
					new SyntaxError(SyntaxErrorType.InvalidArguments),
					index,
					`${StatementTypes.Remainder} requires 2 arguments, ${args.length} supplied`
				);
				return statementObj;
			}
			statementObj.type = StatementTypes.Remainder;
			statementObj.arg0 = args[0];
			statementObj.arg1 = args[1];
		}

		return statementObj;
	}

	function parseArgument(arg: string, index: number): Argument {
		switch (arg) {
			case "'":
				return { type: 'r0' };

			case "''":
				return { type: 'r1' };
			case '"':
				return { type: 'r1' };

			case ':':
				return { type: 'stack' };

			case '\\':
				return { type: 'stdout', asNumber: false };

			case '\\#':
				return { type: 'stdout', asNumber: true };

			default:
				if (/^[01]+$/.test(arg)) {
					const val = parseInt(arg, 2);

					if (val > 255) {
						error(
							new SyntaxError(SyntaxErrorType.InvalidArguments),
							index,
							`Invalid binary literal: ${arg}`
						);
						return null;
					} else {
						return { type: 'literal', value: val };
					}
				} else {
					return null;
				}
		}
	}

	function getArgumentValue(arg: Argument, index: number): number {
		switch (arg?.type) {
			case 'literal':
				if (arg.value > 255) {
					error(
						new SyntaxError(SyntaxErrorType.InvalidArguments),
						index,
						`Invalid binary literal: ${arg.value}`
					);
				} else {
					return arg.value;
				}
			case 'r0':
				return programState.r0;
			case 'r1':
				return programState.r1;
			case 'stack':
				if (programState.stack.length > 0) {
					return programState.stack[programState.stack.length - 1];
				} else {
					error(
						new RuntimeError(RuntimeErrorType.EmptyStackRead),
						index,
						'Tried to access stack, but stack is empty.'
					);
					return 0;
				}
			default:
				error(
					new SyntaxError(SyntaxErrorType.InvalidSource),
					index,
					`Cannot read from argument of type: ${arg?.type}`
				);
				return 0;
		}
	}

	async function interpretStatement(statement: Statement) {
		switch (statement.type) {
			case StatementTypes.LoopStart:
				if (!programState.loops.includes(programState.instructionPointer)) {
					programState.loops.push(programState.instructionPointer);
				}
				break;

			case StatementTypes.LoopEnd:
				if (
					programState.stack.length === 0 ||
					programState.stack[programState.stack.length - 1] !== 0
				) {
					programState.instructionPointer = programState.loops[programState.loops.length - 1];
				} else if (programState.stack[programState.stack.length - 1] === 0) {
					programState.loops.pop();
				}
				break;

			case StatementTypes.Copy:
				const value = getArgumentValue(statement.arg0, programState.instructionPointer);
				switch (statement.arg1?.type) {
					case 'r0':
						programState.r0 = value;
						break;
					case 'r1':
						programState.r1 = value;
						break;
					case 'stack':
						programState.stack.push(value);
						break;
					case 'stdout':
						if (statement.arg1.type === 'stdout' && statement.arg1.asNumber === false) {
							output += String.fromCharCode(value);
						} else {
							output += value.toString();
						}
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg1?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Input:
				isWaitingInput = true;
				const i: string = await new Promise((resolve) => {
					resumeInterpreter = resolve;
				});
				programState.stack.push(0);
				const inputArray = i.split('').reverse();
				inputArray.forEach((v) => {
					programState.stack.push(v.charCodeAt(0));
				});
				isWaitingInput = false;
				break;
			case StatementTypes.Remove:
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 = 0;
						break;
					case 'r1':
						programState.r1 = 0;
						break;
					case 'stack':
						programState.stack.pop();
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Add:
				const valueToAdd = getArgumentValue(statement.arg1, programState.instructionPointer);
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 += valueToAdd;
						if (programState.r0 > 255) {
							programState.r0 %= 256;
						}
						break;
					case 'r1':
						programState.r1 += valueToAdd;
						if (programState.r1 > 255) {
							programState.r1 %= 256;
						}
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Subtract:
				const valueToSub = getArgumentValue(statement.arg1, programState.instructionPointer);
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 -= valueToSub;
						if (programState.r0 < 0) {
							programState.r0 += 256;
						}
						break;
					case 'r1':
						programState.r1 -= valueToSub;
						if (programState.r1 < 0) {
							programState.r1 += 256;
						}
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Multiply:
				const valueToMul = getArgumentValue(statement.arg1, programState.instructionPointer);
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 -= valueToMul;
						if (programState.r0 > 255) {
							programState.r0 %= 256;
						}
						break;
					case 'r1':
						programState.r1 -= valueToMul;
						if (programState.r1 > 255) {
							programState.r1 %= 256;
						}
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Divide:
				const valueToDiv = getArgumentValue(statement.arg1, programState.instructionPointer);
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 /= valueToDiv;
						break;
					case 'r1':
						programState.r1 /= valueToDiv;
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;
			case StatementTypes.Remainder:
				const valueToRem = getArgumentValue(statement.arg1, programState.instructionPointer);
				switch (statement.arg0?.type) {
					case 'r0':
						programState.r0 %= valueToRem;
						break;
					case 'r1':
						programState.r1 %= valueToRem;
						break;

					default:
						error(
							new SyntaxError(SyntaxErrorType.InvalidDestination),
							programState.instructionPointer,
							`Cannot write to argument of type: ${statement.arg0?.type}`
						);
						break;
				}
				break;

			default:
				error(
					new SyntaxError(SyntaxErrorType.InvalidStatement),
					programState.instructionPointer,
					'Invalid statement provided.'
				);
				break;
		}

		programState.instructionPointer += 1;
	}

	async function interpret() {
		statements = parse();

		programState.stopped = false;

		while (programState.instructionPointer < statements.length) {
			const statement = statements[programState.instructionPointer];

			await interpretStatement(statement);
		}

		programState.stopped = true;
		programState.executionDone = true;
		programState.instructionPointer = 0;
	}

	async function step() {
		if (programState.instructionPointer === 0) {
			statements = parse();
		} else if (
			programState.instructionPointer > statements.length ||
			programState.executionDone ||
			isWaitingInput
		) {
			return;
		}

		programState.stopped = false;

		const statement = statements[programState.instructionPointer];

		await interpretStatement(statement);

		programState.stopped = true;

		if (programState.instructionPointer >= statements.length) {
			programState.executionDone = true;
		}
	}
</script>

<div id="wrapper">
	<div id="inner-wrapper">
		<div id="header">
			<div id="left">
				<img src={logoSmall} alt="Aglang" /><a
					href="https://github.com/0xF1dev/aglang/blob/main/docs/reference.md">Docs</a
				><a href="https://github.com/0xF1dev/aglang">Main repository</a><a
					href="https://github.com/0xF1dev/aglang-website">Website repository</a
				>
			</div>
			<div id="right">
				<select name="Examples" id="" bind:value={example}>
					<option value="default" disabled selected>Select an example</option>
					<option value="helloWorld">Hello world</option>
					<option value="fibonacci">Fibonacci</option>
					<option value="mirror">Mirror</option>
				</select>
			</div>
		</div>
		<div id="top">
			<div id="editor">
				<CodeMirror
					bind:value={code}
					onchange={() => {
						programState.instructionPointer = 0;
						programState.executionDone = false;
					}}
					extensions={[
						aglang,
						baseStyle,
						syntaxHighlighting(highlightStyle),
						keymap.of(closeBracketsKeymap),
						EditorState.languageData.of(() => [{ closeBrackets: { brackets: ['['] } }])
					]}
				/>
			</div>
			<div id="actions">
				<button
					class="action-btn"
					onclick={() => {
						programState.r0 = 0;
						programState.r1 = 0;
						programState.stack = [];
						programState.executionDone = false;
						programState.instructionPointer = 0;
						programState.stopped = false;
						output = '';
						input = '';
						interpret();
					}}>run</button
				><button
					class="action-btn"
					onclick={() => {
						programState.r0 = 0;
						programState.r1 = 0;
						programState.stack = [];
						programState.executionDone = false;
						programState.instructionPointer = 0;
						programState.stopped = true;
						output = '';
						input = '';
					}}>reset</button
				><button
					class="action-btn"
					disabled={programState.executionDone || code == '' || isWaitingInput}
					onclick={() => {
						step();
					}}>step</button
				>
			</div>
		</div>
		<div id="io">
			<textarea name="" id="output" disabled bind:value={output} bind:this={outputElement}
			></textarea>
			<div id="input-wrapper">
				<input
					type="text"
					name=""
					id="input"
					placeholder="Input"
					bind:value={input}
					disabled={programState.stopped}
					onkeydown={(e) => {
						if (e.key === 'Enter' && input !== '' && !programState.stopped) {
							const i = input;
							input = '';
							output += `${i}\n`;

							if (resumeInterpreter) {
								resumeInterpreter(i);
							}
						}
					}}
				/>
				<button
					aria-label="Enter"
					disabled={programState.stopped}
					onclick={() => {
						if (input !== '') {
							const i = input;
							input = '';
							output += `${i}\n`;

							if (resumeInterpreter) {
								resumeInterpreter(i);
							}
						}
					}}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#000"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path
							d="M15 16l4 -4"
						/><path d="M15 8l4 4" /></svg
					></button
				>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	button {
		border-radius: 4px;
		border: none;
		padding: 10px 16px;
		font-family: 'Tabular';
		cursor: pointer;
		transition: 0.2s;

		&:hover:not(:disabled) {
			background-color: #757575;
		}

		&:active:not(:disabled) {
			background-color: #595959;
		}
	}

	#wrapper {
		display: flex;
		justify-content: center;

		#inner-wrapper {
			width: 55vw;

			#header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 2rem 0;
				width: 100%;

				#left {
					display: flex;
					align-items: center;
					gap: 2rem;

					img {
						width: 64px;
						height: auto;
					}

					a {
						color: #fff;
					}
				}

				#right {
					select {
						background-color: #fff;
						border: none;
						border-radius: 4px;
						padding: 10px 16px;
						font-family: 'Tabular';
					}
				}
			}

			#top {
				display: flex;
				justify-content: space-between;
				width: 100%;
				margin-bottom: 2rem;

				#editor {
					width: 50vw;
					border: 1px solid #333;
					border-radius: 4px;
					font-family: monospace;
					max-width: 50vw;
					height: 560px;
					overflow: scroll;
				}

				#actions {
					padding: 0 2rem;
					display: flex;
					flex-direction: column;
					gap: 1rem;

					&:disabled {
						background-color: #595959;
					}
				}
			}

			#io {
				display: flex;
				flex-direction: column;

				textarea {
					resize: none;
					background-color: #121212;
					border: 1px solid #333;
					border-radius: 4px 4px 0 0;
					height: 200px;
					padding: 0.8rem 0.6rem;
					color: #fff;
				}

				#input-wrapper {
					width: 100%;
					display: flex;

					input {
						flex-grow: 1;
						background-color: #121212;
						border: 1px solid #333;
						border-top: none;
						border-radius: 0 0 4px 4px;
						color: #fff;
						padding: 0 0.6rem;
						height: 48px;

						&:disabled {
							cursor: not-allowed;
						}
					}

					button {
						height: 48px;
						width: 48px;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 0 0 4px 0;

						&:disabled {
							background-color: #333;
							cursor: not-allowed;
						}
					}
				}
			}
		}
	}
</style>
