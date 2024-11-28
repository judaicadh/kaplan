import React from 'react'
import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import Typography from '@mui/material/Typography'
import { Card, CardActionArea, CardContent, CardMedia } from '@mui/material'
import CustomPagination from '@components/Search/CustomPagination.tsx'

type HitProps = {
	hit: AlgoliaHit<{
		objectID: string;
		name: string;
		type: string[];
		categories: string[];
		subtype: string[];
		dateC: string;
		description: string;
		title: string;
		geography: string[];
		thumbnail: string;
		slug: string;
		url?: string;
		hierarchicalCategories: {
			lvl0: string[];
			lvl1: string[];
			lvl2: string[];
		};
		hasRealThumbnail: boolean;
		subject: string[];
		_geoloc?: {
			lat: number | number[];
			lng: number | number[];
		};
	}>;
	sendEvent: (eventType: string, eventName: string, eventData?: object) => void;
};

export function Hit({ hit, sendEvent }: HitProps) {
	const handleClick = () => {
		sendEvent('click', 'Item Clicked', {
			objectID: hit.objectID,
			eventName: 'Item Clicked',
		});
	};


	return (

		<Card className="max-w-[180px]   shadow-md transition hover:shadow-lg ">
			<a href={`/item/${hit.slug}`} onClick={handleClick} style={{ textDecoration: 'none' }}>
				<CardActionArea onClick={handleClick}>
					<CardMedia
						component="img"
						sx={{ height: 180, objectFit: 'contain' }}// Adjusted image height for compact view
						image={hit.thumbnail}
						alt={hit.title}
						className="rounded-t-md"
					/>
					<CardContent className="p-3  align-middle"> {/* Reduced padding */}
						<Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600, fontSize: 12 }}
												className="line-clamp-3">
							{hit.title}
						</Typography>

						<Typography
							variant="caption"
							className="text-sm text-gray-600 mt-1"
							color="textSecondary"
						>
							<strong>{hit.type}</strong> - {hit.dateC}
						</Typography>

					</CardContent>
				</CardActionArea>
			</a>
		</Card>

	);
}

