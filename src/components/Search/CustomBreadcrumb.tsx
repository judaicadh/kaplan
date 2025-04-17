import { useBreadcrumb } from 'react-instantsearch'

function CustomBreadcrumb({ attributes }: { attributes: string[] }) {
	const { items, canRefine, refine, createURL } = useBreadcrumb({ attributes })

	if (!canRefine || items.length === 0) {
		return null;
	}

	return (
		<nav
			className="flex items-center px-4 py-3 text-sm sm:text-base text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
			aria-label="Breadcrumb"
		>
			<ol className="inline-flex items-center flex-wrap gap-x-1 md:gap-x-2 rtl:space-x-reverse">
				{items.map((item, index) => (
					<li key={item.label} className="inline-flex items-center">
						{/* Arrow separator */}
						{index > 0 && (
							<svg
								className="w-3 h-3 text-gray-400 mx-1"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 6 10"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M1 9L5 5 1 1"
								/>
							</svg>
						)}

						<a
							href={createURL(item.value)}
							className={`${
								(item as any).isRefined
									? "text-blue-600 dark:text-blue-400 font-semibold"
									: "text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
							}`}
							onClick={(event) => {
								event.preventDefault()
								refine(item.value)
							}}
						>
							{item.label}
						</a>
					</li>
				))}
			</ol>
		</nav>
	)
}

export default CustomBreadcrumb