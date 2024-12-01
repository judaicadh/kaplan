import { useHits } from 'react-instantsearch'
import type { CustomHit, CustomRecord } from '../../types/CustomHitType.ts'
import { Hit } from '@components/Search/Hit.tsx'

function CustomHits() {
	const { hits, sendEvent } = useHits<CustomHit>() // Type assertion

	return (
		<div className="grid grid-cols-4 sm:grid-cols-2  lg:grid-cols-4 gap-6 p-4">
			{hits.map((hit) => (
				<Hit key={hit.objectID} hit={hit} onClick={() => sendEvent('click', hit, 'Article Clicked')} />
			))}
		</div>
	)
}

export default CustomHits