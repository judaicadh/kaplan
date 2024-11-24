import React, { useState, useEffect } from 'react'

interface IIIFManifest {
	sequences: { canvases: IIIFCanvas[] }[];
}

interface IIIFCanvas {
	id: string;
	label: string;
	images: { resource: { service: { '@id': string } } }[];
}

interface IIIFViewerProps {
	manifestUrls?: string[];
}

function IIIFViewer({ manifestUrls }: IIIFViewerProps) {
	const [manifest, setManifest] = useState<IIIFManifest | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchManifest = async () => {
			setIsLoading(true)
			try {
				if (manifestUrls && manifestUrls.length > 0) {
					const response = await fetch(manifestUrls[0])
					if (!response.ok) {
						throw new Error(`HTTP error! Status: ${response.status}`)
					}
					const data = await response.json() as IIIFManifest
					setManifest(data)
				} else {
					throw new Error('No manifest URL provided.')
				}
			} catch (error) {
				setError(error as Error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchManifest()
	}, [manifestUrls])

	// Helper to generate image URL
	const getImageUrl = (serviceId: string | undefined): string | null => {
		if (!serviceId) {
			console.error('Service ID is undefined or null.')
			return null
		}

		try {
			// Decode the service ID to handle encoded components like %2F
			const decodedId = decodeURIComponent(serviceId)

			// Construct the image URL
			return `${decodedId}/full/max/0/default.jpg`
		} catch (error) {
			console.error('Error generating image URL:', error)
			return null
		}
	};

	if (isLoading) {
		return <div>Loading manifest...</div>
	}

	if (error) {
		return <div>Error loading manifest: {error.message}</div>
	}

	if (!manifest) {
		return <div>No manifest data available.</div>
	}

	return (
		<div>
			{manifest.sequences[0]?.canvases?.map((canvas, index) => {
				const serviceId = canvas.images[0]?.resource?.service?.['@id']
				const imageUrl = getImageUrl(serviceId)

				if (!imageUrl) {
					return (
						<div key={index}>
							<p>Canvas {index + 1}: No valid image service available.</p>
						</div>
					)
				}

				return (
					<div key={index} style={{ marginBottom: '20px' }}>
						<h2>{canvas.label}</h2>
						<img
							src={imageUrl}
							alt={canvas.label}
							style={{ maxWidth: '100%' }}
							onError={(e) => {
								(e.target as HTMLImageElement).src = '/fallback-image.jpg'
							}}
						/>
					</div>
				)
			})}
		</div>
	)
}

export default IIIFViewer