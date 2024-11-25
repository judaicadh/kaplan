import React from 'react'
import { algoliasearch } from 'algoliasearch'
import { InstantSearch, LookingSimilar } from 'react-instantsearch'

const searchClient = algoliasearch('ZLPYTBTZ4R', 'be46d26dfdb299f9bee9146b63c99c77')

interface LookingSimilarComponentProps {
	objectID: string;
}

function Item({ item }: { item: any }) {
	return (
		<div>
			<h3>{item.title}</h3>
			<p>{item.description}</p>
		</div>
	)
}

const LookingSimilarComponent: React.FC<LookingSimilarComponentProps> = ({ objectID }) => {
	if (!objectID) {
		return <div>No ID found for this page.</div>
	}

	return (
		<InstantSearch
			indexName="Dev_Kaplan"
			searchClient={searchClient}
			future={{
				preserveSharedStateOnUnmount: true
			}}
		>
			<LookingSimilar objectIDs={[objectID]} itemComponent={Item} />
		</InstantSearch>
	)
}

export default LookingSimilarComponent