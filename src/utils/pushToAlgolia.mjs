import algoliasearch from 'algoliasearch';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const records = require('../data/items.json'); // Path to your JSON file

// Initialize the Algolia client
const client = algoliasearch('ZLPYTBTZ4R', 'd020c7e559db5854ac9f75c026d0734a');
const index = client.initIndex('Dev_Kaplan');

// Define your site's base URL
const siteBaseUrl = 'https://kaplancollection.org/';  // Replace with your actual site base URL

// Function to format the record
function formatRecord(record) {
    return {
        ...record,
        objectID: record.id, // Use the ID as the objectID
        url: `${siteBaseUrl}item/${record.slug}`,
        hasRealThumbnail: record.thumbnail !== "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",// Construct URL with /item/ in the path
    };
}
// Format and push data to Algolia
async function pushDataToAlgolia() {
    try {
        const formattedRecords = records.map((record) => {
            console.log("Original Record:", record); // Log the original record

            const formattedRecord = formatRecord(record);

            console.log("Formatted Record:", formattedRecord); // Log the formatted record
            return formattedRecord;
        });

        // Push the formatted records to Algolia
        const response = await index.saveObjects(formattedRecords);
        console.log('Algolia response:', response);
    } catch (error) {
        console.error('Error pushing data to Algolia:', error.message, error.stack);
    }
}

// Run the function to push the data to Algolia
pushDataToAlgolia();