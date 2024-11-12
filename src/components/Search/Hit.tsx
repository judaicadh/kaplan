import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

type HitProps = {
	hit: AlgoliaHit<{
		objectID: string;
		name: string;
		type: string[];
		subtype: string[];
		dateC: string;
		description: string;
		title: string;
		geography: string[];
		thumbnail: string;
		slug: string;
		url?: string;
		hasRealThumbnail: boolean;
		subject: string[];
		minTimestamp: number[];
		maxTimestamp: number[];
		_geoloc: {
			lat: number[] | number;
			lng: number[] | number;
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
		<Card className="max-w-[180px] mx-auto shadow-md transition hover:shadow-lg">
			<CardActionArea onClick={handleClick}>
				<CardMedia
					component="img"
					height="80" // Adjusted image height for compact view
					image={hit.thumbnail}
					alt={hit.title}
					className="rounded-t-md"
				/>
				<CardContent className="p-3  align-middle" > {/* Reduced padding */}
					<Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }} className="line-clamp-2">
						{hit.title}
					</Typography>

					<Typography
						variant="caption"
						className="text-sm text-gray-600 mt-1"
						color="textSecondary"
					>
						<strong>{hit.subtype[0]}</strong> - {hit.dateC}
					</Typography>

				</CardContent>
			</CardActionArea>
		</Card>
	);
}