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
		<div
			key={renderKey}
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-full overflow-x-hidden"
		>
			{hits.map((hit) => (
				<Hit key={hit.objectID} hit={hit} onClick={() => sendEvent('click', hit, 'Article Clicked')} />
			))}
		</div>
	);
}

export default CustomHits;