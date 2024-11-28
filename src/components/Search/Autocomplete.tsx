import { algoliasearch } from 'algoliasearch'
import React, { useEffect, useRef, createElement, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js'
import { createRedirectUrlPlugin } from '@algolia/autocomplete-plugin-redirect-url'

import type { AutocompleteComponents } from '@algolia/autocomplete-js'
import type { Hit } from '@algolia/client-search'
import type { Root } from 'react-dom/client'
import '@algolia/autocomplete-theme-classic/dist/theme.css'
import { useSearchBox } from 'react-instantsearch'
import type { ProductHit } from '../../types/types'
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions'

const searchClient = algoliasearch(
	'ZLPYTBTZ4R',
	'be46d26dfdb299f9bee9146b63c99c77'
)

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
	searchClient,
	indexName: 'Dev_Kaplan_query_suggestions2',
	getSearchParams({ state }) {
		return { hitsPerPage: state.query ? 5 : 10 }
	},
	categoryAttribute: [
		'hierarchicalCategories.lvl0'
	],
	itemsWithCategories: 2,
	categoriesPerItem: 2,
	transformSource: ({ source, onTapAhead }) => {
		return {
			...source,
			templates: {
				...source.templates,
				item({ item, components }) {

					return (
						<div className="aa-ItemWrapper">
							<div className="aa-ItemContent">
								<div className="aa-ItemIcon aa-ItemIcon--noBorder">
									<svg
										viewBox="0 0 24 24"
										width="18"
										height="18"
										fill="currentColor"
									>
										<path
											d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z" />
									</svg>
								</div>
								<div className="aa-ItemContentBody">
									<div className="aa-ItemContentTitle">
										<components.ReverseHighlight hit={item} attribute="query" />
										{item.__autocomplete_qsCategory && (
											<span className="aa-ItemContentSubtitle aa-ItemContentSubtitle--inline">
                        <span className="aa-ItemContentSubtitleIcon" /> in{' '}
												<span className="aa-ItemContentSubtitleCategory">
                          {item.__autocomplete_qsCategory}
                        </span>
                      </span>
										)}
									</div>
								</div>
							</div>

							<div className="aa-ItemActions">
								<button
									aria-label={`Fill query with "${item.query}"`}
									className="aa-ItemActionButton"
									title={`Fill query with "${item.query}"`}
									onClick={(event) => {
										event.preventDefault()
										event.stopPropagation()
										onTapAhead(item)
									}}
								>
									<svg
										viewBox="0 0 24 24"
										width="18"
										height="18"
										fill="currentColor"
									>
										<path
											d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z" />
									</svg>
								</button>
							</div>
						</div>
					)
				}
			}
		}
	}

})

function NavAutocomplete() {

	const containerRef = useRef<HTMLDivElement | null>(null)
	const panelRootRef = useRef<Root | null>(null)
	const rootRef = useRef<HTMLElement | null>(null)
	useEffect(() => {
		if (!containerRef.current) {
			return undefined
		}


		const search = autocomplete<ProductHit>({
			container: containerRef.current,
			placeholder: 'Search',
			detachedMediaQuery: '',
			plugins: [querySuggestionsPlugin],
			insights: true,
			getSources({ query }) {
				return [
					{
						sourceId: 'items',
						getItems() {
							return getAlgoliaResults<ProductHit>({
								searchClient: searchClient,
								queries: [
									{
										indexName: 'Dev_Kaplan',
										params: {
											query
										}


									}
								]
							})
						},

						templates: {
							header() {
								return 'Suggestions'
							},

							item({ item, components }) {
								return <ProductItem hit={item} components={components} />
							},
							noResults() {
								return (
									<div className="aa-NoResults font-semibold text-center">
										<p>No results were found for your query.</p>
									</div>
								)
							},
							footer({ state }) {
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
						},
						onSelect({
											 item, state, event
										 }) {
							const { query } = state
							// Redirect to item detail page or search page with query
							window.location.href = `/search/?q=${encodeURIComponent(query)}`
						}
					}
				]
			},
			onSubmit({ state }) {
				const query = state.query
				if (query.trim()) {
					window.location.href = `/search/?q=${encodeURIComponent(query)}`
				}
			},
			renderer: {
				createElement, Fragment, render: () => {
				}
			},
			render({ children }, root) {
				if (!panelRootRef.current || rootRef.current !== root) {
					rootRef.current = root

					panelRootRef.current?.unmount()
					panelRootRef.current = createRoot(root)
				}

				panelRootRef.current.render(children)
			}
		})

		return () => {
			search.destroy()
		}
	}, [])

	return <div ref={containerRef} />
}

function ProductItem({
											 hit,
											 components
										 }: {
	hit: ProductHit;
	components: AutocompleteComponents;
}) {
	return (
		<article className="aa-ItemWrapper">
			<div className="aa-ItemContent">
				<div className="aa-ItemIcon--picture">
					<a href={`/item/${hit.slug}`}>
						<img src={hit.thumbnail} alt={hit.title} />
					</a>
				</div>
				<a href={`/item/${hit.slug}`}>
					<div className="mt-6 aa-ItemContentTitle">
						<components.Highlight hit={hit} attribute="title" />
					</div>
					<div className="aa-ItemContentDescription">
						<components.Snippet hit={hit} attribute="description" />
					</div>
				</a>


			</div>
			<hr />


		</article>
	)
}

export default NavAutocomplete