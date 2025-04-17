import { useHits } from "react-instantsearch";
import type { CustomHit } from "../../types/CustomHitType.ts";
import { Hit } from "@components/Search/Hit.tsx";
import { useEffect, useState } from "react";

function CustomHits() {
	const { hits, sendEvent } = useHits<CustomHit>();
	const [renderKey, setRenderKey] = useState(Date.now());

	useEffect(() => {
		const handleFavoritesUpdated = () => {
			setRenderKey(Date.now()); // Trigger re-render
		};

		window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
		return () => window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
	}, []);

	return (
		<div key={renderKey} className="grid sm:grid-cols-1 lg:grid-cols-4 gap-6 p-4">
			{hits.map((hit) => (
				<Hit key={hit.objectID} hit={hit} onClick={() => sendEvent('click', hit, 'Article Clicked')} />
			))}
		</div>
	);
}

export default CustomHits;