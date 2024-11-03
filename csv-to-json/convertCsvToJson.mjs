import csv from 'csvtojson';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const csvFilePath = path.join(__dirname, '../src/data/input/Kaplan20240808 (25).csv');
const jsonFilePath = path.join(__dirname, '../src/data/items.json');

(async () => {
    try {
        // Convert CSV to JSON
        const jsonObj = await csv({ separator: ',' }).fromFile(csvFilePath);

        // Format the data
        const formattedData = jsonObj.map(item => ({
            id: item.id?.toString() || "",
            link: item.colendalink?.toString() || "",
            slug: item.slug?.toString() || "",
            date: item.date?.toString() || "",
            collection: item.Collection?.toString() || "",
            peopleURI: item.peopleuri?.toString() || "",
            title: item['title from colenda']?.toString() || "Untitled",
            type: item.type ? item.type.split('|').map(sub => sub.trim()) : [],
            subtype: item.subtype ? item.subtype.split('|').map(sub => sub.trim()) : [],
            PhysicalLocation: item['Updated Location']?.toString() || "",
            description: item.description?.toString() || "",
            thumbnail: item.thumbnail?.toString() || "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
            manifestUrl: item.manifestUrl?.toString() || "",
            franklinLink: item['Franklin Link']?.toString() || "",
            cross: item.OBJECTS_CUSTOMFIELD_2?.toString() || "",
            column_type: item.OBJECTS_COLTYPE?.toString() || "",
            dateC: item.OBJECTS_DATE?.toString() || "",
            geography: item.geographic_subject ? item.geographic_subject.split('|').map(sub => sub.trim()) : [],
            subject: item.subject ? item.subject.split('|').map(sub => sub.trim()) : [],
            language: item.language ? item.language.split('|').map(sub => sub.trim()) : [],
            name: item.name ? item.name.split('|').map(sub => sub.trim()) : [],
            object_type: item.OBJECTS_OBJTYPE ? item.OBJECTS_OBJTYPE.split('|').map(sub => sub.trim()) : [],
            people: item.OBJECTS_CUSTOMFIELD_5 ? item.OBJECTS_CUSTOMFIELD_5.split('|').map(sub => sub.trim()) : [],

            // New _geoloc field
            _geoloc: item._geoloc
              ? item._geoloc.split('|').map(pair => {
                  const [lng, lat] = pair.split(',').map(coord => parseFloat(coord.trim()));
                  return { lat, lng };
              })
              : []
        }));

        // Write JSON to file
        await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8');

        console.log('CSV to JSON conversion completed.');
    } catch (err) {
        console.error('Error converting CSV to JSON:', err);
    }
})();