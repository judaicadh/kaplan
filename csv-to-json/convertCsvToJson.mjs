import csv from 'csvtojson'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { slugify } from '../src/utils/slugify.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "./Collectify-07-06-2026-XLS (5).csv");
const jsonFilePath = path.join(__dirname, '../src/data/items.json')

// The AI enrichment writes the literal string "NOT ENOUGH INFO" (sometimes with a
// trailing period) when it can't fill a field. Treat those as empty everywhere.
const NOT_ENOUGH_INFO = /^not enough info\.?$/i;
const cleanScalar = (value) => {
	const s = (value ?? '').toString().trim();
	return NOT_ENOUGH_INFO.test(s) ? '' : s;
};
const cleanArray = (values) =>
	values.filter((v) => v != null && v.toString().trim() !== '' && !NOT_ENOUGH_INFO.test(v.toString().trim()));

// The `genre` column contains some values where the same label was fused with
// itself, e.g. "LetterLetter", "MapMap", "Stereoscopic PhotographsStereoscopic Photographs".
// Collapse an exact "XX" duplication back down to a single "X".
const collapseDoubledGenre = (token) => {
	const s = token.trim().replace(/\s+/g, ' ');
	const match = s.match(/^(.+)\1$/i);
	return match ? match[1].trim() : s;
};

// Map genre variants (plurals, punctuation, alternate spellings) onto the
// canonical label that exists in genreToHierarchy. Keyed by lowercased token.
const GENRE_ALIASES = {
	'tickets': 'Ticket',
	'dance cards': 'Dance Card',
	'legal documents': 'Legal Document',
	'manuscripts': 'Manuscript',
	'broadsides': 'Broadside',
	'receipts': 'Receipt',
	'carte de visite (cdv)': 'Cartes-de-visite',
	'cartes de visite': 'Cartes-de-visite',
};

const normalizeGenreToken = (token) => {
	const collapsed = collapseDoubledGenre(token);
	return GENRE_ALIASES[collapsed.toLowerCase()] || collapsed;
};

// Split a genre field on '|' and normalize each token.
const parseGenres = (genreField) =>
	(genreField || '')
		.split('|')
		.map((t) => normalizeGenreToken(t))
		.filter(Boolean);

/*
const genreToHierarchy = {
	'Commercial Activity': {
		'Financial Records': [
			'Billhead',
			'Bond',
			'Business Letter',
			'Business Report',
			'Receipt',
			'Currency',
			'Check',
			'Ledger',
			'Promissory Note',
			'Receipt Book',
			'Shipping Record',
			'Bill of Exchange',
			'Note Payable',
			'Stock Certificate',
			'Stock Or Bond Certificate',
			'Financial Record',
			'Playing Cards'
		],
		'Marketing & Advertising Materials': [
			'Advertising Postcard',
			'Business Cards',
			'Business Envelope',
			'Business Invitation',
			'Trade Card',
			'Advertising Mirror',
			'Advertising Object',
			'Advertising Pin',
			'Poster',
			'Lottery Ticket',
			'Token',
			'Ash Tray',
			'Bottle',
			'Brush',
			'Crock',
			'Glassware',
			'Jug',
			'Match Safe',
			'Pouch',
			'Sign',
			'Timepiece',
			'Blotter',
			'Calendar',
			'Menu',
			'Misc. Advertising Object',
			'Wood Crate'
		]
	},
	'Government, Legal, & Military': {
		'Government': [
			'Government Record',
			'Government Invitation',
			'Congressional Record',
			'License',
			'Patent Application',
			'Official Document',
			'Certificate',
			'Passport'
		],
		'Legal': [
			'Brief',
			'Contract',
			'Deed',
			'Estate Records',
			'Petition',
			'Will',
			'Legal Document'
		],
		'Military': [
			'Military Record',
			'Military Related Letter'
		],

	},
	'Printed Material & Manuscripts': {
		'Books & Pamphlets': [
			'Book',
			'Pamphlet',
			'Catalogue',
			'Almanac',
			'Report',
			'Bookplate',
			'Printed Material',
			'Sheet Music'
		],
		'Periodicals': [
			'Periodical',
			'Newspaper',
			'Serial'
		],
		'Archives & Manuscripts': [
			'Manuscript',
			'Diary',
			'Scrapbook',
			'Map',
			'Archival Materials'
		],
	},
	'Religious Materials': {
		'Sacred Texts & Documents': [
			'Ketubah',
			'Religious Related Books',
			'Prayer Book',
			'Torah Scroll'
		],
		'Ritual Objects': [
			'Mezuzah',
			'Menorah',
			'Kiddush Cup'
		],
	},
	'Visual Arts': {
		'Fine Art': [
			'Drawing',
			'Engraving',
			'Etching',
			'Lithograph',
			'Micrography',
			'Oil Painting',
			'Pastel',
			'Plaque',
			'Print',
			'Sculpture',
			'Sketches',
			'Watercolor',
			'Woodcuts',
			'Chromolithograph'
		],
		'Photography': [
			'Photographs',
			'Albumen Prints',
			'Cabinet Photographs',
			'Cartes-de-visite',
			'Daguerreotypes',
			'Salted Paper Prints',
			'Stereoscopic Photographs',
			'Tintypes'
		],
		'Decorative Art': [
			'Lamp',
			'Medal',
			'Sampler',
			'Silver',
			'Textiles',
			'Visual Works'
		],
	},
	'Personal and Leisure Documents and Ephemera': {
		'Letters & Cards': [
			'Calling Cards',
			'Dance Card',
			'Envelope',
			'Greeting Cards',
			'Invitation',
			'Letter',
			'Playbill',
			'Postcard',
			'Program',
			'Ticket'
		],
	},
};*/

const genreToHierarchy = {
	'3D Object': {
		'Decorative Art': [
			'Lamp',
			'Medal',
			'Silver',
			'Sculpture',
			'Plaque',
			'Mezuzah',
			'Menorah',
			'Kiddush Cup',
			'Advertising Mirror',
			'Advertising Pin',
			'Brush',
			'Mirror',
			'Timepiece',
			'Spoon',
			'Pin',
			'Button',
			'Buckle Discs',
			'Seal'
		],
		'Containers': [
			'Wood Crate',
			'Pouch',
			'Bottle',
			'Crock',
			'Match Safe',
			'Jug',
			'Glassware',
			'Tzedakah Box',
			'Box',
			'Pencil Case'
		],
		'Tokens': [
			'Token'
		]
	},
	'Manuscript/Mixed Material': {
		'Cards': [
			'Calling Cards',
			'Dance Card',
			'Postcard',
			'Postal Card',
			'Trade Card',
			'Trade Cards',
			'Greeting Cards',
			'Business Cards',
			'Playing Cards'
		],
		'Correspondence': [
			'Letters',
			'Letter',
			'Envelope',
			'Envelopes'
		],
		'Manuscripts': [
			'Manuscript',
			'Diary',
			'Scrapbook',
			'Archival Materials',
			'Estate Records',
			'Petition',
			'Legal Document',
			'Will',
			'Record',
			'Brief',
			'Contract',
			'Deed',
			'Envelope',
			'Invitation',
			'Playbill',
			'Program',
			'Ticket',
			'Billhead',
			"Broadside",
			'Bond',
			'Report',
			'Receipt',
			'Ledger',
			'Promissory Note',
			'Receipt Book',
			'Shipping Record',
			'Bill of Exchange',
			'Note Payable',
			'Financial Record',
			'Stock Certificate',
			'Stock Or Bond Certificate',
			'Currency',
			'Check',
			'Government Record',
			'Military Records',
			'Lottery Ticket',
			'Resolution',
			'Archival Collection',
			'License',
			'Patent Application',
			'Court Document',
			'Statement of account',
			'Deposition',
			'Summons',
			'Testimony',
			'Sales Record',
			'Insurance Record',
			'Deposit Slip',
			'Pay Voucher'
		],
		'Certificates': [
			'Certificate',
			'Baptismal Certificate',
			'Membership Certificate',
			'Marriage Certificate',
			'Citizenship Certificate',
			'Naturalization Certificate'
		]
	},
	'Visual Arts': {
		'Photography': [
			'Photographs',
			'Albumen Prints',
			'Cabinet Photographs',
			'Cartes-de-visite',
			'Daguerreotypes',
			'Salted Paper Prints',
			'Stereoscopic Photographs',
			'Tintypes',
			'Photograph Albums'
		],
		'Needlework': [
			'Textiles',
			'Sampler'
		],
		'Paintings': [
			'Oil Painting',
			'Watercolor'
		],
		'Drawing': [
			'Drawing',
			'Pastel',
			'Sketches'
		],
		'Printing': [
			'Engraving',
			'Etching',
			'Lithograph',
			'Micrography',
			'Print',
			'Woodcuts',
			'Chromolithograph',
			'Visual Works',
			'Poster'
		],
		'Metalwork': [
			'Plaque',
			'Silver',
			'Medal'
		],
		'Sculpture': [
			'Sculpture'
		]
	},
	'Book/Printed Material': {
		'Books & Pamphlets': [
			'Book',
			'Pamphlet',
			'Catalogue',
			'Almanac',
			'Report',
			'Bookplate',
			'Printed Material',
			'Ketubah',
			'Donation Recorder',
			'Prayer Book',
			'Torah Scroll',
			'Congressional Record',
			'Calendar',
			'Advertising Booklet',
			'Blotter'
		]
	},
	'Notated Music': [
			'Sheet Music'
	],
	'Map': [
		'Map'
	],
	'Newspaper': {
		'Periodicals': [
			'Newspaper',
			'Periodical',
			'Serial',
			'Magazine'
		]
	}
};
const generateHierarchicalCategories = (genreField) => {
	const hierarchicalCategories = { lvl0: [], lvl1: [], lvl2: [] };

	if (!genreField) {
		console.warn("Genre field is missing or empty.");
		return hierarchicalCategories;
	}

	// Split the `genreField` into individual normalized genres
	const genres = parseGenres(genreField);

	genres.forEach((genre) => {
		let foundMatch = false;
		const target = genre.toLowerCase();

		// Loop through the genreToHierarchy object to map the genreField values (case-insensitive)
		for (const [lvl0, subcategories] of Object.entries(genreToHierarchy)) {
			if (Array.isArray(subcategories)) {
				// Handle flat top-level categories
				const canonical = subcategories.find((g) => g.toLowerCase() === target);
				if (canonical) {
					hierarchicalCategories.lvl0.push(lvl0);
					foundMatch = true;
				}
			} else if (typeof subcategories === 'object') {
				// Handle hierarchical subcategories
				for (const [lvl1, items] of Object.entries(subcategories)) {
					const canonical = items.find((g) => g.toLowerCase() === target);
					if (canonical) {
						hierarchicalCategories.lvl0.push(lvl0);
						hierarchicalCategories.lvl1.push(`${lvl0} > ${lvl1}`);
						hierarchicalCategories.lvl2.push(`${lvl0} > ${lvl1} > ${canonical}`);
						foundMatch = true;
					}
				}
			}
		}

		if (!foundMatch) {
			console.warn(`No match found in hierarchy for genre: "${genre}"`);
		}
	});

	// Deduplicate and return the categories
	return {
		lvl0: [...new Set(hierarchicalCategories.lvl0)],
		lvl1: [...new Set(hierarchicalCategories.lvl1)],
		lvl2: [...new Set(hierarchicalCategories.lvl2)]
	};
};

const parseNameUriField = (field) => {
	if (!field || field.trim() === "") {
		console.warn("Field is missing or empty.");
		return [];
	}

	// Split and parse entries
	return field.split("|").map((entry) => {
		const [namePart, uriPart] = entry.split(", uri:").map((part) => part.trim());
		const name = namePart?.replace("name:", "").trim();
		const uri = uriPart?.trim();

		if (name && uri) {
			return { name, uri };
		} else {
			console.warn(`Invalid entry: "${entry}"`);
			return null;
		}
	}).filter(Boolean);
};

const isValidTimestamp = (timestamp) => {
	const minTimestamp = Math.floor(new Date("1300-01-01T00:00:00Z").getTime() / 1000);
	const maxTimestamp = Math.floor(Date.now() / 1000);
	return timestamp >= minTimestamp && timestamp <= maxTimestamp;
};
const parseGeographyField = (geographyField) => {
	if (!geographyField || geographyField.trim() === "") {
		// Return an empty array if the field is missing or empty
		console.warn("Geography field is missing or empty.");
		return [];
	}

	// Split by '|' and parse each entry
	return geographyField.split("|").map((entry) => {
		const [namePart, uriPart] = entry.split(", uri:").map((part) => part.trim());
		const name = namePart?.replace("name:", "").trim();
		const uri = uriPart?.trim();

		if (name && uri) {
			return { name, uri };
		} else {
			console.warn(`Invalid geography entry: "${entry}"`);
			return null;
		}
	}).filter(Boolean); // Filter out invalid entries
};


(async () => {
	try {
		const jsonArray = await csv({ separator: "," }).fromFile(csvFilePath);

		const formattedData = jsonArray.map((item, index) => {
			const hierarchicalCategories = generateHierarchicalCategories(item.genre);

			// This CSV has no name:/uri: subject or geography columns, so these stay empty.
			const parsedTestField = [];
			const parsedGeographyField = [];

			// Process start and end dates
			const startDates = item.start_date?.split("|").map((s) => s.trim()).filter(Boolean) || [];
			const endDates = item.end_date?.split("|").map((s) => s.trim()).filter(Boolean) || [];
			const datePairs = {};
			const maxLength = Math.min(startDates.length, endDates.length);

			for (let i = 0; i < maxLength; i++) {
				const startTimestamp = parseInt(startDates[i], 10);
				const endTimestamp = parseInt(endDates[i], 10);

				if (isValidTimestamp(startTimestamp)) {
					datePairs[`startDate${i + 1}`] = startTimestamp;
				} else {
					console.warn(`Invalid start timestamp for item ${item.id || `index ${index}`}: ${startTimestamp}`);
				}

				if (isValidTimestamp(endTimestamp)) {
					datePairs[`endDate${i + 1}`] = endTimestamp;
				} else {
					console.warn(`Invalid end timestamp for item ${item.id || `index ${index}`}: ${endTimestamp}`);
				}
			}


			for (let i = 0; i < maxLength; i++) {
				const startTimestamp = parseInt(startDates[i], 10);
				const endTimestamp = parseInt(endDates[i], 10);

				if (isValidTimestamp(startTimestamp)) {
					datePairs[`startDate${i + 1}`] = startTimestamp;
				} else {
					console.warn(`Invalid start timestamp for item ${item.id || `index ${index}`}: ${startTimestamp}`);
				}

				if (isValidTimestamp(endTimestamp)) {
					datePairs[`endDate${i + 1}`] = endTimestamp;
				} else {
					console.warn(`Invalid end timestamp for item ${item.id || `index ${index}`}: ${endTimestamp}`);
				}
			}

			console.log(`Processing Item ID: ${item.THING_UUID}`)
			console.log(`genre Field: ${item.genre}`)
			console.log(`Generated Hierarchical Categories:`, JSON.stringify(hierarchicalCategories, null, 2))



			// Generate hierarchical categories using the correct `item.genre`


			return {
				id: item.THING_UUID?.toString() || '',
				wikibaseid: item.wikibaseid?.toString() || "",
				link: item.link?.toString() || "",
				date1: item.date?.toString() || '',
				collection: item.Collection?.toString() || '',
				peopleURI: item.peopleuri?.toString() || '',
				// A slug is valid only if it's non-empty and doesn't start with '-'
				// (a leading dash means an earlier pass slugified an empty title, e.g. "-feb8bf4e").
				// Otherwise regenerate from the AI title plus a short UUID suffix for uniqueness.
				slug: (item.slug && item.slug.trim() && !item.slug.trim().startsWith('-'))
					? item.slug.trim()
					: `${slugify(cleanScalar(item.TitleAI)) || 'untitled'}-${(item.THING_UUID || `${index}`).replace(/[{}]/g, '').slice(0, 8).toLowerCase()}`,
				title: cleanScalar(item.TitleAI) || cleanScalar(item.colenda_title) || 'Untitled',
				PhysicalLocation: item.Updated_Location?.toString() || '',
				description: cleanScalar(item.AIDescription) || cleanScalar(item.colenda_description) || '',
				thumbnail: (item.thumbnail?.toString().trim().replace(/^http:\/\//i, 'https://')) || 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon',
				manifestUrl: item.manifestUrl
					? item.manifestUrl.split('|').map((sub) => sub.trim().replace(/^http:\/\//i, 'https://')).filter(Boolean)
					: [],
				franklinLink: item['Franklin Link']?.toString() || '',
				subcollection: item.collectionname?.toString() || '',
				cross: item.OBJECTS_CUSTOMFIELD_2l?.toString() || '',
				dateC: item.OBJECTS_DATE?.toString() || '',
				subject: cleanArray(item.SubjectAI ? item.SubjectAI.split('|').map((sub) => sub.trim()) : []),
				language: cleanArray(item.language ? item.language.split('|').map((sub) => sub.trim()) : []),
				name: cleanArray(item.name ? item.name.split('|').map((sub) => sub.trim()) : []),
				people: cleanArray(item.OBJECTS_CUSTOMFIELD_5l ? item.OBJECTS_CUSTOMFIELD_5l.split('/').map((sub) => sub.trim()) : []),
				personAI: cleanArray(item.PersonAI ? item.PersonAI.split('|').map((sub) => sub.trim()) : []),
				businessAI: cleanArray(item.BusinessName_AI ? item.BusinessName_AI.split('|').map((sub) => sub.trim()) : []),
				topic: cleanArray(item.Topic ? item.Topic.split('|').map((sub) => sub.trim()) : []),
				type: parseGenres(item.genre),
				subjectAI: parsedTestField,
				geography: parsedGeographyField,
				hierarchicalCategories,
				...datePairs,
				_geoloc: item._geoloc
					? item._geoloc.split('|').map((pair) => {
						const [lng, lat] = pair.split(',').map((coord) => parseFloat(coord.trim()))
						if (isNaN(lat) || isNaN(lng)) {
							console.warn(`Invalid _geoloc pair for item ${item.id || 'unknown'}: ${pair}`)
							return null
						}
						return { lat, lng }
					}).filter(Boolean)
					: []
			}
		});

		await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8')
		console.log('CSV to JSON conversion completed with hierarchical categories.')
	} catch (err) {
		console.error('Error converting CSV to JSON:', err)
	}
})();