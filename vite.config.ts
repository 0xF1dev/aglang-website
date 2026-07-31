import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { mdsvex } from 'mdsvex'

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter(),
			preprocess: [vitePreprocess({ script: true }), mdsvex({
				extensions: ['.md']
			})],
			extensions: ['.svelte', '.md']
		}),
	],
	optimizeDeps: {
		exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/theme-one-dark", "@codemirror/language", "@codemirror/view", "@codemirror/state", "@codemirror/autocomplete", "@lezer/common", "@lezer/lr", "@lezer/highlight"]
	},
});
