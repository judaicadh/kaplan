// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
	optimizeDeps: {
		include: ['@docsearch/react'], // Pre-bundle CommonJS module
	},
	build: {
		commonjsOptions: {
			include: [/node_modules/], // Ensure Vite processes CommonJS modules in node_modules
		},
	},
});