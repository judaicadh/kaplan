import React, { useEffect } from 'react'

interface UniversalViewerProps {
	manifestUrl: string;
}

const UniversalViewer: React.FC<UniversalViewerProps> = ({ manifestUrl }) => {
	useEffect(() => {
		const uv = new UV({
			target: document.getElementById('uv-container'),
			configUri: 'https://universalviewer.io/config.json'
		})
		uv.loadManifest(manifestUrl)
	}, [manifestUrl])

	return <div id="uv-container" style={{ height: '500px' }} />
}

export default UniversalViewer