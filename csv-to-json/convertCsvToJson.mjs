import csv from 'csvtojson'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, './Kaplan20240808 (37).csv')
const jsonFilePath = path.join(__dirname, '../src/data/items.json')

const typeToHierarchy = {
	'Documents & Printed Matter': {
		'Business & Finance': [
			'Billhead',
			'Receipt',
			'Check',
			'Stock/Bond Certificate',
			'Ledger',
			'Financial Record',
			'Promissory Note',
			'Bill of Exchange',
			'Note Payable',
			'Business Card',
			'Currency',
			'Trade Card',
			'Token',
			'Lottery Ticket'
		],
		'Legal & Government': [
			'Legal Document',
			'Deed',
			'Congressional Record',
			'Government Record',
			'License',
			'Patent Application',
			'Official Document',
			'Passport',
			'Petition',
			'Contract',
			'Will'
		],
		'Correspondence & Ephemera': [
			'Letter',
			'Envelope',
			'Postcard',
			'Greeting Card',
			'Invitation',
			'Calling Card',
			'Trade Card',
			'Blotter',
			'Calendar',
			'Program',
			'Ticket',
			'Playbill',
			'Dance Card',
			'Menu'
		],
		'Publications & Books': [
			'Book',
			'Periodical',
			'Pamphlet',
			'Catalogue',
			'Almanac',
			'Report',
			'Bookplate',
			'Printed Material',
			'Sheet Music',
			'Manuscript',
			'Diary',
			'Scrapbook',
			'Archival Materials'
		],
		'Certificates & Records': [
			'Certificate',
			'Baptismal Certificate',
			'Government Record',
			'Congressional Report',
			'Marriage Document',
			'Shipping Record',
			'Military Record',
			'Birth Certificate',
			'Death Certificate'
		],
	},
	'Visual & Artistic Works': {
		'Photography': [
			'Photograph',
			'Cartes-de-visite',
			'Cabinet Photographs',
			'Stereoscopic Photographs',
			'Albumen Prints',
			'Salted Paper Prints',
			'Tintypes',
			'Daguerreotypes'
		],
		'Prints & Artwork': [
			'Print',
			'Lithograph',
			'Chromolithograph',
			'Engraving',
			'Etching',
			'Drawing',
			'Micrography',
			'Oil Painting',
			'Watercolor',
			'Map',
			'Poster',
			'Plaque',
			'Woodcuts',
			'Sculpture'
		],
		'Other Visuals': ['Visual Works'],
		'Textiles': ['Samplers']
	},
	'Objects & Artifacts': [
		'Advertising Mirror',
		'Bottle',
		'Jug',
		'Crock',
		'Glassware',
		'Lamp',
		'Sign',
		'Plaque',
		'Sampler',
		'Seal',
		'Playing Cards',
		'Match Safe',
		'Advertising Pin',
		'Brush',
		'Pouch',
		'Timepiece',
		'Three-dimensional object',
		'Advertising Object'
	],
};

const isValidTimestamp = (timestamp) => {
	const minTimestamp = Math.floor(new Date('1300-01-01T00:00:00Z').getTime() / 1000) // January 1, 1300
	const maxTimestamp = Math.floor(Date.now() / 1000) // Current date in seconds
	return timestamp >= minTimestamp && timestamp <= maxTimestamp
};
(async () => {
	try {
		const jsonArray = await csv({
			separator: ','
		}).fromFile(csvFilePath);

		const formattedData = jsonArray.map(item => {
			const datePairs = {}
			const startDates = item.start_date?.split('|').map(s => s.trim()).filter(Boolean) || []
			const endDates = item.end_date?.split('|').map(s => s.trim()).filter(Boolean) || []
			const maxLength = Math.min(startDates.length, endDates.length)

			for (let i = 0; i < maxLength; i++) {
				const startTimestamp = parseInt(startDates[i], 10) // Convert string to integer
				const endTimestamp = parseInt(endDates[i], 10)

				if (isValidTimestamp(startTimestamp)) {
					datePairs[`startDate${i + 1}`] = startTimestamp
				} else {
					console.warn(`Invalid start timestamp for item ${item.id}: ${startTimestamp}`)
				}

				if (isValidTimestamp(endTimestamp)) {
					datePairs[`endDate${i + 1}`] = endTimestamp
				} else {
					console.warn(`Invalid end timestamp for item ${item.id}: ${endTimestamp}`)
				}
			}

					const typeCategories = item.type ? item.type.split('|').map((sub) => sub.trim()) : []
					const hierarchicalPaths = []

					typeCategories.forEach((type) => {
						for (const [lvl0, subcategories] of Object.entries(typeToHierarchy)) {
							for (const [lvl1, types] of Object.entries(subcategories)) {
								if (types.includes(type)) {
									hierarchicalPaths.push({
										lvl0,
										lvl1: `${lvl0} > ${lvl1}`,
										lvl2: `${lvl0} > ${lvl1} > ${type}`
									})
								}
							}
						}
					})

					const categories = {
						'categories.lvl0': [...new Set(hierarchicalPaths.map((path) => path.lvl0))],
						'categories.lvl1': [...new Set(hierarchicalPaths.map((path) => path.lvl1))],
						'categories.lvl2': [...new Set(hierarchicalPaths.map((path) => path.lvl2))]
					}

            return {
                id: item.id?.toString() || "",
                link: item.colendalink?.toString() || "",
                slug: item.slug?.toString() || "",
                date1: item.date?.toString() || "",
                collection: item.Collection?.toString() || "",
                peopleURI: item.peopleuri?.toString() || "",
							title: item.TitleAI?.toString().trim() || item['title from colenda']?.toString() || 'Untitled',
                subtype: item.subtype ? item.subtype.split('|').map(sub => sub.trim()) : [],
                PhysicalLocation: item['Updated Location']?.toString() || "",
							description: item.AIDescription?.toString().trim() || item.description?.toString().trim() || '',
                thumbnail: item.thumbnail?.toString() || "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
							manifestUrl: item.manifestUrl ? item.manifestUrl.split('|').map(sub => sub.trim()) : [],
                franklinLink: item['Franklin Link']?.toString() || "",
							subcollection: item.collectionname?.toString() || '',
                cross: item.OBJECTS_CUSTOMFIELD_2?.toString() || "",
                column_type: item.OBJECTS_COLTYPE?.toString() || "",
                dateC: item.OBJECTS_DATE?.toString() || "",
                geography: item.geographic_subject ? item.geographic_subject.split('|').map(sub => sub.trim()) : [],
                subject: item.subject ? item.subject.split('|').map(sub => sub.trim()) : [],
                language: item.language ? item.language.split('|').map(sub => sub.trim()) : [],
                name: item.name ? item.name.split('|').map(sub => sub.trim()) : [],
                people: item.OBJECTS_CUSTOMFIELD_5 ? item.OBJECTS_CUSTOMFIELD_5.split('|').map(sub => sub.trim()) : [],
							...categories,
                ...datePairs,

                _geoloc: item._geoloc
                  ? item._geoloc.split('|').map(pair => {
                      const [lng, lat] = pair.split(',').map(coord => parseFloat(coord.trim()));
                      return { lat, lng };
                  })
                  : []
            };
        });


			await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8')
			console.log('CSV to JSON conversion completed with hierarchical categories.')
    } catch (err) {
			console.error('Error converting CSV to JSON:', err)
    }
})();