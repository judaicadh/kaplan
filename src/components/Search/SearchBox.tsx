import { useHits, useSearchBox } from 'react-instantsearch'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { algoliasearch } from 'algoliasearch'

const searchClient = algoliasearch(
	'ZLPYTBTZ4R',
	'be46d26dfdb299f9bee9146b63c99c77'
)
const AutocompleteSearch = () => {
	const [isOpen, setIsOpen] = useState(false)
	const { query, refine } = useSearchBox()
	const { hits } = useHits()
	const navigate = useNavigate()

	const handleSelect = (hit) => {
		if (hit.category) {
			// Navigate to a category-specific page
			navigate(`/category/${hit.category}`)
		} else {
			// Navigate to a search results page
			navigate(`/search?query=${query}`)
		}
		setIsOpen(false)
	}

	return (
		<div className="relative w-full max-w-md">
			<input
				type="text"
				value={query}
				onChange={(e) => {
					refine(e.target.value)
					setIsOpen(true)
				}}
				placeholder="Search..."
				className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
			/>
			{isOpen && hits.length > 0 && (
				<div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg mt-2">
					<ul>
						{hits.map((hit) => (
							<li
								key={hit.objectID}
								onClick={() => handleSelect(hit)}
								className="p-2 cursor-pointer hover:bg-gray-100"
							>
								<span className="font-bold">{hit.title}</span>
								{hit.category && (
									<span className="text-sm text-gray-500 ml-2">in {hit.category}</span>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
};

export default AutocompleteSearch