import React, { useState } from 'react'
import Viewer from '@samvera/clover-iiif/viewer'

interface CloverProps {
	manifestUrls: string[]; // Array of IIIF manifest URLs
}

const Clover: React.FC<CloverProps> = ({ manifestUrls }) => {
	const [selectedManifest, setSelectedManifest] = useState(manifestUrls[0])

	// Define Viewer options
	const viewerOptions = {
		showTitle: false,
		informationPanel: {
			open: false // Example: Configure information panel visibility
		},
		openSeadragon: {
			gestureSettingsMouse: {
				scrollToZoom: true
			}
		}
	}

	// Handle selection change in dropdown
	const handleManifestChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedManifest(event.target.value)
	}

	return (
		<div className="space-y-4">
			{/* Show dropdown only if there are multiple manifests */}
			{manifestUrls.length > 1 && (
				<div className="manifest-selector space-y-2">
					<label
						htmlFor="manifest-dropdown"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Select a Manifest:
					</label>
					<select
						id="manifest-dropdown"
						value={selectedManifest}
						onChange={handleManifestChange}
						className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
					>
						{manifestUrls.map((url, index) => (
							<option key={index} value={url}>
								Manifest {index + 1}
							</option>
						))}
					</select>
				</div>
			)}

			{/* Viewer Container */}
			<div
				className="viewer-container border border-gray-300 rounded-md p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
				{selectedManifest ? (
					<Viewer iiifContent={selectedManifest} options={viewerOptions} />
				) : (
					<p className="text-gray-500 dark:text-gray-400">No manifest selected.</p>
				)}
			</div>
		</div>
	)
}

export default Clover