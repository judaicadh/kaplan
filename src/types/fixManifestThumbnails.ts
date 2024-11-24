export function fixEncodedUrls(manifest: any): any {
	if (typeof manifest === 'string') {
		return manifest.replace(/%2F/g, '/')
	}

	if (Array.isArray(manifest)) {
		return manifest.map((item) => fixEncodedUrls(item))
	}

	if (typeof manifest === 'object' && manifest !== null) {
		return Object.fromEntries(
			Object.entries(manifest).map(([key, value]) => [key, fixEncodedUrls(value)])
		)
	}

	return manifest
}