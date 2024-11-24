declare module 'tify' {
	interface TifyOptions {
		container: HTMLElement | string;
		manifestUrl: string;

		[key: string]: any;
	}

	export default class Tify {
		constructor(options: TifyOptions);
	}
}