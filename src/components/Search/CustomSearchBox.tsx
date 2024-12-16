import { useInstantSearch, useSearchBox } from 'react-instantsearch'
import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function CustomSearchBox(props) {
	const { query, refine } = useSearchBox(props)
	const { status } = useInstantSearch()
	const [inputValue, setInputValue] = useState(query)
	const [isInputVisible, setIsInputVisible] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	const isSearchStalled = status === 'stalled'

	function setQuery(newQuery: string) {
		setInputValue(newQuery)
		refine(newQuery)
	}

	/*	function toggleSearchInput() {
			setIsInputVisible(!isInputVisible)
			if (!isInputVisible && inputRef.current) {
				inputRef.current.focus()
			}
		}*/

	return (
		<>
		<form
			action=""
			role="search"
			noValidate
			onSubmit={(event) => {
				event.preventDefault()
				window.location.href = `/search?query=${encodeURIComponent(inputValue)}`
			}}
			onReset={(event) => {
				event.preventDefault()
				event.stopPropagation()
				setQuery('')
				if (inputRef.current) {
					inputRef.current.focus()
				}
			}}

		>

			<label htmlFor="default-search"
						 className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
			<div className="relative  ">
				<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
					<button
						// onClick={toggleSearchInput}
						className="text-gray-400"
						aria-label="Open search input"
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</div>
				<input
					ref={inputRef} placeholder="Search..."
					spellCheck={false} type="search"
					value={inputValue}
					onChange={(event) => {
						setQuery(event.currentTarget.value)
					}}
					autoFocus
					className="  md:w-full   p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				/>

			</div>
		</form>
		</>

	)
}

export default CustomSearchBox