import React from 'react'

footer({ state })
{
	const { query } = state
	return (
		<div>
			{/* Dummy content for scrollability */}


			<div
				id="informational-banner"
				className="aa-PanelFooter z-1055 w-full bg-white border-t border-gray-200 sticky bottom-0 left-0 z-20"

			>

				<div className="mb-4 md:mb-0 md:me-4">
					<a
						href={`/search/?q=${encodeURIComponent(query)}`}
						className="inline-flex items-center justify-center px-3 py-2 me-2 text-xs font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					>
						See More Results
						<svg
							className="w-3 h-3 ms-2 rtl:rotate-180"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M1 5h12m0 0L9 1m4 4L9 9"
							/>
						</svg>
					</a>
				</div>
				<div className="flex items-center flex-shrink-0">
					<a
						href="#"
						className="inline-flex items-center justify-center px-3 py-2 me-3 text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
					>
						<svg
							className="w-3 h-3 me-2"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 18"
						>
							<path
								d="M9 1.334C7.06.594 1.646-.84.293.653a1.158 1.158 0 0 0-.293.77v13.973c0 .193.046.383.134.55.088.167.214.306.366.403a.932.932 0 0 0 .5.147c.176 0 .348-.05.5-.147 1.059-.32 6.265.851 7.5 1.65V1.334ZM19.707.653C18.353-.84 12.94.593 11 1.333V18c1.234-.799 6.436-1.968 7.5-1.65a.931.931 0 0 0 .5.147.931.931 0 0 0 .5-.148c.152-.096.279-.235.366-.403.088-.167.134-.357.134-.55V1.423a1.158 1.158 0 0 0-.293-.77Z" />
						</svg>
						Help
					</a>
				</div>
			</div>
		</div>

	)

}
,
},
onSelect({
	item, state, event
})
{
	const { query } = state
	// Redirect to item detail page or search page with query
	window.location.href = `/search/?q=${encodeURIComponent(query)}`
}
,
}