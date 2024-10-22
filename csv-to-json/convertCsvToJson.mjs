// scripts/convertCsvToJson.mjs

import csv from 'csvtojson';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const csvFilePath = path.join(__dirname, '../src/data/input/Kaplan20240808 (19).csv');
const jsonFilePath = path.join(__dirname, '../src/data/items.json');

(async () => {
    try {
        // Convert CSV to JSON
        const jsonObj = await csv({ separator: ',' }).fromFile(csvFilePath);

        // Format the data
        const formattedData = jsonObj.map(item => {
            return {
                id: item.id || "", // Ensure this is a string
                link: item.colendalink || "", // Single string value
                slug: item.slug || "", // Single string value
                date: item.datecolenda || "", // Single string value
                peopleURI: item.peopleuri || "", // Single string value
                title: item['title from colenda'] || "", // Single string value
                type: item.type || "", // Ensure single string value
                subtype: item.subtype ? item.subtype.split('|').map(sub => sub.trim()) : [], // Array for subtypes
                PhysicalLocation: item['Updated Location'] || "", // Single string value
                description: item.Description || "", // Single string value
                thumbnail: item.thumbnail || "", // Single string value
                manifestUrl: item.manifestUrl || "", // Single string value
                franklinLink: item['Franklin Link'] || "", // Single string value
                cross: item.OBJECTS_CUSTOMFIELD_2 || "", // Single string value
                column_type: item.OBJECTS_COLTYPE || "", // Single string value
                dateC: item.OBJECTS_DATE || "", // Single string value
                geography: item.OBJECTS_CUSTOMFIELD_3 || "", // Single string value
                object_type: item.OBJECTS_OBJTYPE || "", // Single string value
                people: item.OBJECTS_CUSTOMFIELD_5 || "", // Single string value
            };
        });

        // Write JSON to file
        await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8');

        console.log('CSV to JSON conversion completed.');
    } catch (err) {
        console.error('Error converting CSV to JSON:', err);
    }
})();