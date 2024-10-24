// /env.d.ts
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly VITE_ALGOLIA_APP_ID: string;
    readonly VITE_ALGOLIA_INDEX_NAME: string;
    readonly VITE_ALGOLIA_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

import * as preact from 'preact';

// Parcel picks the `source` field of the monorepo packages and thus doesn't
// apply the Babel config. We therefore need to manually override the constants
// in the app, as well as the React pragmas.
// See https://twitter.com/devongovett/status/1134231234605830144
(global as any).__DEV__ = process.env.NODE_ENV !== 'production';
(global as any).__TEST__ = false;
(global as any).h = preact.h;
(global as any).React = preact;

import algoliasearch from 'algoliasearch/lite';
import instantsearch from 'instantsearch.js/dist/instantsearch.production.min';

declare global {
    interface Window {
        algoliasearch: typeof algoliasearch;
        instantsearch: typeof instantsearch;
    }
}