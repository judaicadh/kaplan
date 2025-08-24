import React from 'react';
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Typography from '@mui/material/Typography';
import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, Divider } from '@mui/material';
import FavoritesButton from '@components/Misc/FavoritesButton.tsx';

type RecordShape = {
	objectID: string;
	startDate1?: number;
	endDate1?: number;
	name?: string;
	personAI?: string;
	businessAI?: string;
	type?: string[];
	subtype?: string;
	topic?: string[];
	dateC?: string;
	description?: string;
	title?: string;
	geographic_subject?: string[];
	thumbnail?: string;
	slug: string;
	url?: string;
	hierarchicalCategories?: {
		lvl0?: string;  // ← string, optional
		lvl1?: string;  // ← string, optional
		lvl2?: string;  // ← string, optional
	};
	hasRealThumbnail?: boolean;
	subject?: string[];
	_geoloc?: { lat: number | number[]; lng: number | number[] };
};

type HitProps = {
	hit: AlgoliaHit<RecordShape>;
	// React InstantSearch sendEvent signature:
	// sendEvent(eventType, payload, eventName)
	// where payload is a hit (or array of hits) for click/view events
	sendEvent: (eventType: 'click' | 'view' | 'conversion', payload: AlgoliaHit<RecordShape> | AlgoliaHit<RecordShape>[], eventName: string) => void;
};

const topicColors: Record<string, string> = {
	Mercantile: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	Religious: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Personal: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
	'Arts & Professions': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Military: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
};

const getTopicClass = (topic: string) =>
	topicColors[topic] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';

function TopicBadges({ hit }: { hit: HitProps['hit'] }) {
	const topics = Array.isArray(hit.topic) ? hit.topic : [];
	return (
		<>
			{topics.map((t, i) => (
				<span key={`${t}-${i}`} className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTopicClass(t)}`}>
          {t}
        </span>
			))}
		</>
	);
}

export function Hit({ hit, sendEvent }: HitProps) {
	const pos = (hit as any).__position;
	const qid = (hit as any).__queryID;

	const handleClick = () => {
		// Correct order: eventType, payload, eventName
		sendEvent('click', hit, 'Item Clicked');
		// (Optional) Also push to GTM if you want
		if (typeof window !== 'undefined' && (window as any).dataLayer) {
			(window as any).dataLayer.push({
				event: 'algolia_hit_click',
				algolia: {
					objectID: hit.objectID,
					position: pos,
					queryID: qid,
					index: (hit as any).__indexName,
					title: hit.title,
					url: hit.url ?? `/item/${hit.slug}`,
				},
			});
		}
	};

	return (
		<Card
			className="rounded-2xl shadow-sm hover:shadow-lg transition-transform hover:scale-[1.01] bg-white dark:bg-gray-800 w-full"
			// GTM-friendly attributes (can be on the card or the clickable area)
			data-insights-object-id={hit.objectID}
			data-insights-position={pos}
			data-insights-query-id={qid}
		>
			<CardActionArea
				onClick={handleClick}
				href={`/item/${hit.slug}`}
				component="a"
				aria-label={`View details for ${hit.title || 'Untitled'}`}
			>
				<CardMedia
					component="img"
					loading="lazy"
					image={hit.thumbnail || '/placeholder.png'}
					alt={hit.title || 'No title available'}
					sx={{
						height: 180,
						objectFit: 'contain',
						borderBottom: '1px solid #e5e7eb',
						backgroundColor: '#f9fafb',
						display: 'block',
						marginLeft: 'auto',
						marginRight: 'auto',
						padding: '0.5rem',
						maxWidth: '100%',
					}}
				/>
				<CardContent className="p-3 text-center">
					<Typography variant="body2" className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
						{hit.title || 'Untitled'}
					</Typography>
				</CardContent>
			</CardActionArea>

			<Divider />

			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
					<TopicBadges hit={hit} />
				</Box>

				<Box className="flex items-center gap-2">
					<FavoritesButton
						objectID={hit.objectID}         // ← use whatever the component expects
						title={hit.title || 'Untitled'}
						slug={hit.slug}
						thumbnail={hit.thumbnail || '/placeholder.png'}
					/>
				</Box>
			</Box>
		</Card>
	);
}

export default Hit;