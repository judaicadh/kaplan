/// <reference path="../.astro/types.d.ts" />
// env.d.ts
interface ImportMetaEnv {
	readonly VITE_ALGOLIA_API_KEY: string;
	readonly VITE_ALGOLIA_APP_ID: string;


	// ... other environment variables
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare global {
	var importMeta: ImportMeta;
}

export {};