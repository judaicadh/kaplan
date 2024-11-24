export function decodeManifest(manifest) {
	if (!manifest) return null

	// Decode thumbnails and other content
	if (manifest.thumbnail?.['@id']) {
		try {
			manifest.thumbnail['@id'] = decodeURIComponent(manifest.thumbnail['@id'])
		} catch {
			manifest.thumbnail['@id'] = '' // Or set a fallback
		}
	}

	if (manifest.sequences?.length > 0) {
		manifest.sequences.forEach((sequence) => {
			if (sequence.canvases?.length > 0) {
				sequence.canvases.forEach((canvas) => {
					if (canvas.images?.length > 0) {
						canvas.images.forEach((image) => {
							try {
								if (image.resource?.['@id']) {
									image.resource['@id'] = decodeURIComponent(image.resource['@id'])
								}
							} catch {
								image.resource['@id'] = ''
							}
						})
					}
				})
			}
		})
	}

	return manifest
}