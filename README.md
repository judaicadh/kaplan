# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


Files in public/ are served as static assets.

	•	assets/: Contains images and styles that don’t need processing.
	•	images/: Logos, icons, and other images.
	•	styles/: CSS files or third-party stylesheets.
	•	favicon.ico: The favicon for your website.
	
	
	Directory and File Explanations

Root Directory (my-archival-site/)

	•	package.json: Contains project metadata, dependencies, and scripts.
	•	astro.config.mjs: Astro configuration file where you can set base paths and integrations.
	•	tsconfig.json: TypeScript configuration if you’re using TypeScript.
	•	README.md: Documentation for your project.

Public Directory (public/)

Files in public/ are served as static assets.

	•	assets/: Contains images and styles that don’t need processing.
	•	images/: Logos, icons, and other images.
	•	styles/: CSS files or third-party stylesheets.
	•	favicon.ico: The favicon for your website.

Source Directory (src/)

All source code and content for your website.

Components (src/components/)

Reusable UI components, organized by functionality.

Layout Components (src/components/Layout/)

	•	Header.astro: Site header and navigation.
	•	Footer.astro: Site footer.
	•	BaseLayout.astro: Wraps around page content, includes Header and Footer.

Search Components (src/components/Search/)

	•	SearchBox.astro: Search input field component.
	•	Hits.astro: Displays search results.
	•	RefinementList.astro: Faceted filters based on metadata.
	•	Pagination.astro: Navigates through pages of search results.

IIIF Components (src/components/IIIF/)

	•	IIIFViewer.astro: Displays IIIF manifests using Clover IIIF.
	•	IIIFModal.astro: Modal component for viewing IIIF content in detail.

Map Components (src/components/Map/)

	•	MapComponent.astro: Interactive map using Leaflet, shows geolocated items.

Pages (src/pages/)

Each .astro file corresponds to a route.

	•	index.astro: Home page with search interface and featured content.
	•	about.astro: Static page with information about the site.
	•	item/[id].astro: Dynamic page for individual archival items.

Data (src/data/)

	•	manifests.json: Preprocessed metadata from IIIF manifests for build-time use.

Styles (src/styles/)

CSS files for styling components and pages.

	•	global.css: Global styles and resets.
	•	components.css: Styles specific to components.

Utilities (src/utils/)

Helper functions and configurations.

	•	algoliaClient.js: Sets up the Algolia search client.x