import csv from 'csvtojson'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, './Kaplan20240808 (37).csv')
const jsonFilePath = path.join(__dirname, '../src/data/items.json')

const typeToHierarchy = {
	'Business & Finance': {
		'Financial Documents': [
			'Billhead',
			'Receipt',
			'Check',
			'Ledger',
			'Promissory Note',
			'Receipt Book',
			'Shipping Record',
			'Bill of Exchange',
			'Note Payable',
			'Stock Certificate',
			'Stock Or Bond Certificate',
			'Financial Record'
		],
		'Marketing & Advertising': [
			'Business Card',
			'Business Cards',
			'Trade Card',
			'Advertising Mirror',
			'Advertising Object',
			'Advertising Pin',
			'Poster',
			'Lottery Ticket',
			'Token'
		],
	},
	'Legal & Government': {
		'Legal Documents': [
			'Contract',
			'Deed',
			'Petition',
			'Will',
			'Legal Document'
		],
		'Official Records': [
			'Government Record',
			'Congressional Record',
			'License',
			'Military Record',
			'Military Related Letter',
			'Patent Application',
			'Official Document',
			'Certificate',
			'Passport'
		],
	},
	'Publications': {
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
	'Jewish Religious Materials': {
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
	'Correspondence': {
		'Letters & Cards': [
			'Letter',
			'Envelope',
			'Postcard',
			'Greeting Card',
			'Invitation',
			'Calling Card'
		],
	},
	'Objects & Ephemera': {
		'Promotional Giveaways': [
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
			'Dance Card',
			'Menu',
			'Playbill',
			'Program',
			'Ticket'
		],
		'Games & Recreation': [
			'Playing Cards'
		],
	},
};
const generateHierarchicalCategories = (typeField) => {
	const hierarchicalCategories = { lvl0: [], lvl1: [], lvl2: [] }

	if (!typeField) {
		console.warn('Type field is missing or empty.')
		return hierarchicalCategories
	}

	// Split the `typeField` into individual types
	const types = typeField.split('|').map((t) => t.trim())

	// Loop through the typeToHierarchy object to map the typeField values
	types.forEach((type) => {
		let foundMatch = false

		for (const [lvl0, subcategories] of Object.entries(typeToHierarchy)) {
			for (const [lvl1, items] of Object.entries(subcategories)) {
				if (items.includes(type)) {
					hierarchicalCategories.lvl0.push(lvl0)
					hierarchicalCategories.lvl1.push(`${lvl0} > ${lvl1}`)
					hierarchicalCategories.lvl2.push(`${lvl0} > ${lvl1} > ${type}`)
					foundMatch = true
				}
			}
		}

		if (!foundMatch) {
			console.warn(`No match found in hierarchy for type: "${type}"`)
		}
	})

	// Deduplicate and return the categories
	return {
		lvl0: [...new Set(hierarchicalCategories.lvl0)],
		lvl1: [...new Set(hierarchicalCategories.lvl1)],
		lvl2: [...new Set(hierarchicalCategories.lvl2)]
	}
};
const isValidTimestamp = (timestamp) => {
	const minTimestamp = Math.floor(new Date('1300-01-01T00:00:00Z').getTime() / 1000)
	const maxTimestamp = Math.floor(Date.now() / 1000)
	return timestamp >= minTimestamp && timestamp <= maxTimestamp
};

(async () => {
	try {
		const jsonArray = await csv({ separator: ',' }).fromFile(csvFilePath)


		const formattedData = jsonArray.map((item, index) => {
			const hierarchicalCategories = generateHierarchicalCategories(item.type)
			const datePairs = {}
			const startDates = item.start_date?.split('|').map((s) => s.trim()).filter(Boolean) || []
			const endDates = item.end_date?.split('|').map((s) => s.trim()).filter(Boolean) || []
			const maxLength = Math.min(startDates.length, endDates.length)

			console.log(`Processing Item ID: ${item.id}`)
			console.log(`Type Field: ${item.type}`)
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

			// Generate hierarchical categories using the correct `item.type`


			return {
				id: item.id?.toString() || '',
				link: item.colendalink?.toString() || '',
				slug: item.slug?.toString() || '',
				date1: item.date?.toString() || '',
				collection: item.Collection?.toString() || '',
				peopleURI: item.peopleuri?.toString() || '',
				title: item.TitleAI?.toString().trim() || item['title from colenda']?.toString() || 'Untitled',
				PhysicalLocation: item['Updated Location']?.toString() || '',
				description: item.AIDescription?.toString().trim() || item.description?.toString().trim() || '',
				thumbnail: item.thumbnail?.toString() || 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon',
				manifestUrl: item.manifestUrl ? item.manifestUrl.split('|').map((sub) => sub.trim()) : [],
				franklinLink: item['Franklin Link']?.toString() || '',
				subcollection: item.collectionname?.toString() || '',
				cross: item.OBJECTS_CUSTOMFIELD_2?.toString() || '',
				column_type: item.OBJECTS_COLTYPE?.toString() || '',
				dateC: item.OBJECTS_DATE?.toString() || '',
				geography: item.geographic_subject ? item.geographic_subject.split('|').map((sub) => sub.trim()) : [],
				subject: item.subject ? item.subject.split('|').map((sub) => sub.trim()) : [],
				language: item.language ? item.language.split('|').map((sub) => sub.trim()) : [],
				name: item.name ? item.name.split('|').map((sub) => sub.trim()) : [],
				people: item.OBJECTS_CUSTOMFIELD_5 ? item.OBJECTS_CUSTOMFIELD_5.split('|').map((sub) => sub.trim()) : [],
				type: item.type ? item.type.split('|').map((sub) => sub.trim()) : [],
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