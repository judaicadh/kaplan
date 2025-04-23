import { useInstantSearch, useSearchBox } from 'react-instantsearch'
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";

type CustomSearchBoxProps = {
	onResetQuery?: () => void;
};

function CustomSearchBox({ onResetQuery }: CustomSearchBoxProps) {
	const { query, refine } = useSearchBox();
	const { status } = useInstantSearch()
	const [inputValue, setInputValue] = useState(query)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setInputValue(query);
	}, [query]);

	function setQuery(newQuery: string) {
		setInputValue(newQuery)
		refine(newQuery)
	}

	return (
		<form
			role="search"
			noValidate
			onSubmit={(e) => {
				e.preventDefault();
				refine(inputValue);
			}}
			onReset={(e) => {
				e.preventDefault();
				setQuery('')
				onResetQuery?.();
				inputRef.current?.focus();
			}}
			className="w-full"
		>
			<div className="relative w-full">
				{/* Search icon */}
				<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-300 text-sm" />
				</div>

				{/* Search input */}
				<input
					ref={inputRef}
					type="search"
					placeholder="Search the collection..."
					spellCheck={false}
					aria-label="Search the collection"
					value={inputValue}
					onChange={(e) => setQuery(e.currentTarget.value)}
					className="block w-full pl-10 pr-12 py-3 text-sm sm:text-base border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>

				{/* Help icon link */}
				<a
					href="/help"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Search help"
					title="How to use search"
					className="absolute inset-y-0 right-3 flex items-center"
				>
					<FontAwesomeIcon
						icon={faCircleQuestion}
						className="text-gray-500 hover:text-indigo-600 focus:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 dark:focus:text-indigo-400"
					/>
				</a>
			</div>
		</form>
	)
}

export default CustomSearchBox