import React, { useEffect, useState } from 'react'

function SubjectInfo({ subjectUri }) {
	const [locData, setLocData] = useState([])
	const [error, setError] = useState(null)

	const [isAccordionOpen, setIsAccordionOpen] = useState(false) // State for accordion

	useEffect(() => {
		if (!subjectUri) {
			setError('No URI provided')
			return
		}

		(async () => {
			try {
				const response = await fetch(subjectUri)
				if (!response.ok) {
					throw new Error(`Failed to fetch. Status: ${response.status}`)
				}

				const data = await response.json()
				setLocData(data) // Save raw data
			} catch (err) {
				setError(err.message)
			}
		})()
	}, [subjectUri])

	if (error) return <p className="text-red-600">Error: {error}</p>
	if (!locData.length) return <p className="text-gray-600">Loading information...</p>

	// Extract and deduplicate external links
	const externalLinks = Array.from(
		new Set(
			locData.flatMap((item) => {
				const closeMatches = item['http://www.w3.org/2004/02/skos/core#closeMatch'] || []
				const hasCloseAuthorities = item['http://www.loc.gov/mads/rdf/v1#hasCloseExternalAuthority'] || []
				return [...closeMatches, ...hasCloseAuthorities].map((link) => link['@id'])
			})
		)
	)
	const notes = locData.flatMap((item) => item['http://www.loc.gov/mads/rdf/v1#note'] || []).map((note) => note['@value'])
	const variants = locData.flatMap((item) => item['http://www.loc.gov/mads/rdf/v1#variantLabel'] || []).map((variant) => variant['@value'])

	// Map URIs to sources and logos
	const getSourceLogo = (uri) => {
		if (uri.includes('worldcat.org')) return { name: 'OCLC', logo: '/logos/oclc-logo.png' }
		if (uri.includes('aat.getty.edu')) return { name: 'AAT', logo: '/logos/aat-logo.png' }
		if (uri.includes('bnf.fr')) return { name: 'BNF', logo: '/logos/bnf-logo.png' }
		if (uri.includes('wikidata.org')) return { name: 'Wikidata', logo: '/logos/wikidata-logo.png' }
		if (uri.includes('loc.gov')) return { name: 'LOC', logo: '/logos/loc-logo.png' }
		if (uri.includes('ndl.go.jp')) return { name: 'NDL', logo: '/logos/ndl-logo.png' }
		if (uri.includes('d-nb.info')) return { name: 'DNB', logo: '/logos/dnb-logo.png' }
		if (uri.includes('purl.org/bncf')) return { name: 'BNCF', logo: '/logos/bncf-logo.png' }
		if (uri.includes('yso.fi')) return { name: 'Finto', logo: '/logos/finto-logo.png' }
		if (uri.includes('bne.es')) return { name: 'BNE', logo: '/logos/bne-logo.png' }

		return { name: 'Unknown', logo: '/logos/loc-logo.png' }
	}

	return (
		<div className="flex flex-col lg:flex-row">
			{/* Main Content */}
			<div className="flex-1 mb-6">
				{/* Notes Section */}
				{locData.some((item) => item['https://www.loc.gov/mads/rdf/v1#note']) && (
					<div>
						<h2 className="text-lg font-semibold">Notes</h2>
						<ul className="list-disc ml-4">
							{locData.flatMap((item) => item['https://www.loc.gov/mads/rdf/v1#note'] || [])
								.map((note, index) => (
									<li key={index}>{note['@value']}</li>
								))}
						</ul>
					</div>
				)}

				{/* Library of Congress Link */}
				{subjectUri && (
					<p className="text-gray-600 dark:text-gray-300 mt-4">
						View more about this subject on the{' '}
						<a
							href={subjectUri.replace('.json', '')}
							className="text-blue-600 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
							title="Library of Congress Subject Page"
						>
							Library of Congress Subject Page
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="12"
								viewBox="0 0 512 512"
								fill="currentColor"
								className="inline ml-1"
							>
								<path
									d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
							</svg>
						</a>
					</p>
				)}

				{/* Horizontal Menu for External Links */}
				<div>
					<h2 className="text-lg font-semibold">Linked Data</h2>
					{externalLinks.length > 0 ? (
						<ul className="flex flex-wrap space-x-4 mt-2">
							{externalLinks.map((link, index) => {
								const { name, logo } = getSourceLogo(link)
								return (
									<li key={index} className="flex items-center">
										<a
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center space-x-2"
										>
											<img
												src={logo}
												alt={name}
												className="w-5 h-5"
											/>
											<span className="text-sm">{name}</span>
										</a>
									</li>
								)
							})}
						</ul>
					) : (
						<p>No external links available.</p>
					)}
				</div>
			</div>

			{/* Sidebar */}
			<div className="lg:w-1/4 lg:ml-6 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow">
				{/* Accordion */}
				{variants.length > 0 && (
					<div>
						<h2>
							<button
								type="button"
								className="flex items-center justify-between w-full p-5 font-bold text-gray-800 border rounded-lg border-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
								onClick={() => setIsAccordionOpen(!isAccordionOpen)} // Toggle state
							>
								<span>Subject Name Variants</span>
								<svg
									className={`w-3 h-3 transform ${isAccordionOpen ? 'rotate-180' : ''}`}
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 10 6"
								>
									<path
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5 5 1 1 5"
									/>
								</svg>
							</button>
						</h2>
						{isAccordionOpen && ( // Show content if accordion is open
							<div className="p-5 border border-gray-200 dark:border-gray-700">
								<ul className="list-disc ml-4">
									{variants.map((variant, index) => (
										<li key={index} className="text-gray-700 dark:text-gray-300">
											{variant}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}


export default SubjectInfo

