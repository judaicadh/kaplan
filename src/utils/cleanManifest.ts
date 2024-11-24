function decodeManifest(manifest: any) {
	if (!manifest) return null

	// Decode the thumbnail `@id`
	if (manifest.thumbnail?.['@id']) {
		manifest.thumbnail['@id'] = decodeURIComponent(manifest.thumbnail['@id'])
	}

	// Decode the thumbnail's service `@id`
	if (manifest.thumbnail?.service?.['@id']) {
		manifest.thumbnail.service['@id'] = decodeURIComponent(manifest.thumbnail.service['@id'])
	}

	// Decode sequences and canvas URLs
	if (manifest.sequences?.length > 0) {
		manifest.sequences.forEach((sequence: any) => {
			if (sequence.canvases?.length > 0) {
				sequence.canvases.forEach((canvas: any) => {
					if (canvas.images?.length > 0) {
						canvas.images.forEach((image: any) => {
							if (image.resource?.['@id']) {
								image.resource['@id'] = decodeURIComponent(image.resource['@id'])
							}
						})
					}
				})
			}
		})
	}

	return manifest
}

// Export the function
export default decodeManifest