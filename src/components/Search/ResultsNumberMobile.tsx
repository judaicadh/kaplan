import React from 'react';
import { useInstantSearch } from 'react-instantsearch';


export function ResultsNumberMobile() {
	const {
		results: { nbHits },
	} = useInstantSearch();

	return (
		<div>
			<strong>{(nbHits)}</strong> results
		</div>
	);
}