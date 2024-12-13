import { useRefinementList } from 'react-instantsearch'

export function VirtualFilters() {
	useRefinementList({ attribute: 'geographic_subject.name' })


	return null
}

export default VirtualFilters