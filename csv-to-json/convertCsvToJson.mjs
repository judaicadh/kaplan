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
        const formattedData = jsonObj.map(item => ({
            id: item.id?.toString() || "", // Ensure id is a string, in case it's a number
            link: item.colendalink?.toString() || "", // Convert to string if not already
            slug: item.slug?.toString() || "", // Ensure slug is a string
            date: item.date?.toString() || "", // Ensure date is a string
            peopleURI: item.peopleuri?.toString() || "", // Ensure peopleURI is a string
            title: item['title from colenda']?.toString() || "Untitled", // Ensure title is a string
            type: item.type ? item.type.split('|').map(sub => sub.trim()) : [], // Array from pipe-separated values
            subtype: item.subtype ? item.subtype.split('|').map(sub => sub.trim()) : [], // Same logic for subtype
            PhysicalLocation: item['Updated Location']?.toString() || "", // Ensure PhysicalLocation is a string
            description: item.description?.toString() || "", // Ensure description is a string
            thumbnail: item.thumbnail?.toString() || "https://placehold.co/600x600.jpg?text=Image+Coming+Soon", // Ensure thumbnail is a string
            manifestUrl: item.manifestUrl?.toString() || "", // Ensure manifestUrl is a string
            franklinLink: item['Franklin Link']?.toString() || "", // Ensure franklinLink is a string
            cross: item.OBJECTS_CUSTOMFIELD_2?.toString() || "", // Ensure cross is a string
            column_type: item.OBJECTS_COLTYPE?.toString() || "", // Ensure column_type is a string
            dateC: item.OBJECTS_DATE?.toString() || "", // Ensure dateC is a string
            geography: item.OBJECTS_CUSTOMFIELD_3 ? item.OBJECTS_CUSTOMFIELD_3.split('|').map(sub => sub.trim()) : [], // Array from pipe-separated geography
            object_type: item.OBJECTS_OBJTYPE ? item.OBJECTS_OBJTYPE.split('|').map(sub => sub.trim()) : [], // Array for object_type
            people: item.OBJECTS_CUSTOMFIELD_5 ? item.OBJECTS_CUSTOMFIELD_5.split('|').map(sub => sub.trim()) : [] , // Array for people
        }));

        // Write JSON to file
        await fs.writeFile(jsonFilePath, JSON.stringify(formattedData, null, 2), 'utf-8');

        console.log('CSV to JSON conversion completed.');
    } catch (err) {
        console.error('Error converting CSV to JSON:', err);
    }
})();