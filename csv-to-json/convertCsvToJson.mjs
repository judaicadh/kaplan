import csv from 'csvtojson'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, './Kaplan20240808 (38).csv')
const jsonFilePath = path.join(__dirname, '../src/data/items.json')
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
			'Sampler',
			'Silver',
			'Textiles',
			'Visual Works',
			'Plaque',
			'Sculpture'
		],

		'Ritual Objects': [
			'Mezuzah',
			'Menorah',
			'Kiddush Cup'
		],
		'Advertising Objects': [
			'Advertising Mirror',
			'Advertising Pin',
			'Brush',
			'Wood Crate',
			'Pouch',
			'Bottle',
			'Crock',
			'Match Safe',
			'Jug',
			'Glassware'
		]

	},
	'Manuscript/Mixed Material': {
		'Manuscripts': [
			'Manuscript',
			'Diary',
			'Scrapbook',
			'Archival Materials',
			'Estate Records',
			'Petition',
			'Legal Document',
			'Will',
			'Military Record',
			'Military Related Letter',
			'Brief',
			'Contract',
			'Deed'
		],
		'Letters & Cards': [
			'Calling Cards',
			'Dance Card',
			'Envelope',
			'Greeting Cards',
			'Invitation',
			'Letter',
			'Postcard',
			'Playbill',
			'Program',
			'Trade Card',
			'Ticket'
		],

		'Financial Records': [
			'Billhead',
			'Bond',
			'Business Letter',
			'Business Report',
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
			'Check'
		]
	},
	'Photo, Print, Drawing': {
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
		'Fine Art': [
			'Drawing',
			'Engraving',
			'Etching',
			'Lithograph',
			'Micrography',
			'Oil Painting',
			'Pastel',
			'Print',
			'Sketches',
			'Watercolor',
			'Woodcuts',
			'Chromolithograph'
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
			'Printed Material'
		],

		'Religious Texts': [
			'Ketubah',
			'Religious Related Books',
			'Prayer Book',
			'Torah Scroll'
		]
	},
	'Notated Music': {
		'Music': [
			'Sheet Music'
		]
	},
	'Map': {
		'Cartographic': [
			'Map'
		]
	},
	'Newspaper': {
		'Periodicals': [
			'Newspaper',
			'Periodical',
			'Newspaper',
			'Serial'
		]
	}
};
const generateHierarchicalCategories = (genreField) => {
	const hierarchicalCategories = { lvl0: [], lvl1: [], lvl2: [] }

	if (!genreField) {
		console.warn('genre field is missing or empty.')
		return hierarchicalCategories
	}

	// Split the `genreField` into individual genres
	const genres = genreField.split('|').map((t) => t.trim())

	// Loop through the genreToHierarchy object to map the genreField values
	genres.forEach((genre) => {
		let foundMatch = false

		for (const [lvl0, subcategories] of Object.entries(genreToHierarchy)) {
			for (const [lvl1, items] of Object.entries(subcategories)) {
				if (items.includes(genre)) {
					hierarchicalCategories.lvl0.push(lvl0)
					hierarchicalCategories.lvl1.push(`${lvl0} > ${lvl1}`)
					hierarchicalCategories.lvl2.push(`${lvl0} > ${lvl1} > ${genre}`)
					foundMatch = true
				}
			}
		}

		if (!foundMatch) {
			console.warn(`No match found in hierarchy for genre: "${genre}"`)
		}
	})

	// Deduplicate and return the categories
	return {
		lvl0: [...new Set(hierarchicalCategories.lvl0)],
		lvl1: [...new Set(hierarchicalCategories.lvl1)],
		lvl2: [...new Set(hierarchicalCategories.lvl2)]
	}
};
// Function to create a slug
const createSlug = (value, fallback = 'untitled') => {
	if (!value) return fallback // Default to "untitled" if the value is missing
	return value
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters
}
const isValidTimestamp = (timestamp) => {
	const minTimestamp = Math.floor(new Date('1300-01-01T00:00:00Z').getTime() / 1000)
	const maxTimestamp = Math.floor(Date.now() / 1000)
	return timestamp >= minTimestamp && timestamp <= maxTimestamp
};

(async () => {
	try {
		const jsonArray = await csv({ separator: ',' }).fromFile(csvFilePath)


		const formattedData = jsonArray.map((item, index) => {
			const hierarchicalCategories = generateHierarchicalCategories(item.genre)
			const datePairs = {}
			const startDates = item.start_date?.split('|').map((s) => s.trim()).filter(Boolean) || []
			const endDates = item.end_date?.split('|').map((s) => s.trim()).filter(Boolean) || []
			const maxLength = Math.min(startDates.length, endDates.length)

			console.log(`Processing Item ID: ${item.id}`)
			console.log(`genre Field: ${item.genre}`)
			console.log(`Generated Hierarchical Categories:`, JSON.stringify(hierarchicalCategories, null, 2))

			for (let i = 0; i < maxLength; i++) {
				const startTimestamp = parseInt(startDates[i], 10)
				const endTimestamp = parseInt(endDates[i], 10)

				if (isValidTimestamp(startTimestamp)) {
					datePairs[`startDate${i + 1}`] = startTimestamp
				} else {
					console.warn(`Invalid start timestamp for item ${item.id || `index ${index}`}: ${startTimestamp}`)
				}

				if (isValidTimestamp(endTimestamp)) {
					datePairs[`endDate${i + 1}`] = endTimestamp
				} else {
					console.warn(`Invalid end timestamp for item ${item.id || `index ${index}`}: ${endTimestamp}`)
				}
			}

			// Generate hierarchical categories using the correct `item.genre`
			const title = item.TitleAI?.toString().trim() || item['title from colenda']?.toString() || 'Untitled'


			return {
				id: item.id?.toString() || '',
				link: item.colendalink?.toString() || '',
				date1: item.date?.toString() || '',
				collection: item.Collection?.toString() || '',
				peopleURI: item.peopleuri?.toString() || '',
				slug: createSlug(title),
				title,
				PhysicalLocation: item['Updated Location']?.toString() || '',
				description: item.AIDescription?.toString().trim() || item.description?.toString().trim() || '',
				thumbnail: item.thumbnail?.toString() || 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon',
				manifestUrl: item.manifestUrl ? item.manifestUrl.split('|').map((sub) => sub.trim()) : [],
				franklinLink: item['Franklin Link']?.toString() || '',
				subcollection: item.collectionname?.toString() || '',
				cross: item.OBJECTS_CUSTOMFIELD_2?.toString() || '',
				column_type: item.OBJECTS_COLgenr?.toString() || '',
				dateC: item.OBJECTS_DATE?.toString() || '',
				geography: item.geographic_subject ? item.geographic_subject.split('|').map((sub) => sub.trim()) : [],
				subject: item.subject ? item.subject.split('|').map((sub) => sub.trim()) : [],
				language: item.language ? item.language.split('|').map((sub) => sub.trim()) : [],
				name: item.name ? item.name.split('|').map((sub) => sub.trim()) : [],
				people: item.OBJECTS_CUSTOMFIELD_5 ? item.OBJECTS_CUSTOMFIELD_5.split('|').map((sub) => sub.trim()) : [],
				topic: item.Topic ? item.Topic.split('|').map((sub) => sub.trim()) : [],
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