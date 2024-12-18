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
		})();
	}, [subjectUri]);

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
	);

	const notes = locData.flatMap((item) => item['http://www.loc.gov/mads/rdf/v1#note'] || []).map((note) => note['@value'])
	const variants = locData.flatMap((item) => item['http://www.loc.gov/mads/rdf/v1#variantLabel'] || []).map((variant) => variant['@value'])

	// Map URIs to sources and logos
	const getSourceLogo = (uri) => {
		if (uri.includes('worldcat.org')) return { name: 'OCLC', logo: '../../../src/images/logos/oclc-logo.png' }
		if (uri.includes('aat.getty.edu')) return { name: 'AAT', logo: '../../../src/images/logos/aat-logo.png' }
		if (uri.includes('bnf.fr')) return { name: 'BNF', logo: '../../../src/images/logos/bnf-logo.png' }
		if (uri.includes('wikidata.org')) return { name: 'Wikidata', logo: '../../../src/images/logos/wikidata-logo.png' }
		if (uri.includes('loc.gov') || uri.endsWith('.json')) return {
			name: 'LOC',
			logo: '../../../src/images/logos/loc-logo.png'
		}
		if (uri.includes('ndl.go.jp')) return { name: 'NDL', logo: '../../../src/images/logos/ndl-logo.png' }
		if (uri.includes('d-nb.info')) return { name: 'DNB', logo: '../../../src/images/logos/dnb-logo.png' }
		if (uri.includes('purl.org/bncf')) return { name: 'BNCF', logo: '../../../src/images/logos/bncf-logo.png' }
		if (uri.includes('yso.fi')) return { name: 'Finto', logo: '../../../src/images/logos/finto-logo.png' }
		if (uri.includes('bne.es')) return { name: 'BNE', logo: '../../../src/images/logos/bne-logo.png' }

		return null // Do not return Unknown
	};

	// Add LOC link explicitly
	const locLink = {
		name: 'LOC',
		logo: '../../src/images/logos/loc-logo.png',
		href: subjectUri.replace('.json', '')
	}

	// Filter out duplicates by source
	const uniqueSources = new Set()
	const filteredExternalLinks = externalLinks.filter((link) => {
		const source = getSourceLogo(link)?.name
		if (source && !uniqueSources.has(source)) {
			uniqueSources.add(source)
			return true
		}
		return false
	}).map((link) => {
		const source = getSourceLogo(link)
		return source ? { ...source, href: link } : null
	})

	// Ensure LOC link is included
	if (!uniqueSources.has('LOC')) {
		filteredExternalLinks.unshift(locLink)
		uniqueSources.add('LOC')
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

				{/* Horizontal Menu for External Links */}
				<hr class="my-6 border-gray-200 dark:border-gray-800" />

				<div>
					<h2 className="text-lg text-slate-500 font-semibold">Linked Data</h2>


					{filteredExternalLinks.length > 0 ? (
						<ul className="flex flex-wrap space-x-4 mt-2">
							{filteredExternalLinks.map((link, index) => (
								<li key={index} className="flex items-center">
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-2"
									>
										<img
											src={link.logo}
											alt={link.name}
											className="w-5 h-5"
										/>
										<span className="text-sm">{link.name}</span>
									</a>
								</li>
							))}
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
	);
}

export default SubjectInfo