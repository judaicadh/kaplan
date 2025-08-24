import { useHits } from "react-instantsearch";
import type { CustomHit } from "../../types/CustomHitType";
import { Hit } from "@components/Search/Hit";
import { useEffect, useState } from "react";

declare global {
	interface Window { dataLayer?: any[] }
}

function CustomHits() {
	const { hits, sendEvent } = useHits<CustomHit>();
	const [renderKey, setRenderKey] = useState(Date.now());

	useEffect(() => {
		const handleFavoritesUpdated = () => setRenderKey(Date.now());
		window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
		return () => window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
	}, []);

	// 🔎 Results viewed (Algolia + GTM)
	useEffect(() => {
		if (!hits.length) return;

		// 1) Algolia Insights view
		sendEvent('view', hits, 'Results Viewed');

		// 2) GTM dataLayer push
		const entries = hits.map(h => ({
			objectID: h.objectID,
			position: (h as any).__position,     // Algolia decorates hits with these
			queryID:  (h as any).__queryID,
			index:    (h as any).__indexName
		}));

		window.dataLayer?.push({
			event: 'algolia_results_viewed',
			algolia: {
				queryID: (hits[0] as any).__queryID ?? null,
				index:   (hits[0] as any).__indexName ?? null,
				resultsCount: hits.length,
				entries
			}
			// tip: clear/overwrite ecommerce if you also use GA4 ecommerce
			// ecommerce: null
		});
	}, [hits, sendEvent]);

	return (
		<div
			key={renderKey}
			data-insights-index="Dev_Kaplan"
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full max-w-full overflow-x-hidden"
		>
			{hits.map((hit) => (
				<Hit
					key={hit.objectID}
					hit={hit}
					sendEvent={sendEvent}   // ← pass sendEvent through
				/>
			))}
		</div>
	);
}

export default CustomHits;