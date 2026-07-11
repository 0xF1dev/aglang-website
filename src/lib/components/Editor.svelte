<script lang="ts">
	import { StreamLanguage } from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { EditorView } from '@codemirror/view';
	import CodeMirror from 'svelte-codemirror-editor';

	let { value = $bindable() } = $props();

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
</script>

<div class="wrapper">
	<CodeMirror
		bind:value
		onchange={(v) => value = v}
		lineNumbers={true}
		extensions={[aglang, baseStyle, syntaxHighlighting(highlightStyle)]}
	/>
</div>

<style>
	.wrapper {
		border: 1px solid #333;
		border-radius: 4px;
		font-family: monospace;
		max-width: 50vw;
		height: 560px;
		overflow: scroll;
		display: flex;
	}
</style>
