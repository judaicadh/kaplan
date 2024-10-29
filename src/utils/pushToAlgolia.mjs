import { algoliasearch } from "algoliasearch";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const records = require('../data/items.json'); // Path to your JSON file

const client = algoliasearch('ZLPYTBTZ4R', 'd020c7e559db5854ac9f75c026d0734a');
const indexName = 'Dev_Kaplan';

const siteBaseUrl = 'https://kaplancollection.org/';

function processDate(dateString) {
    if (dateString.startsWith('circa')) {
        const year = parseInt(dateString.match(/\d+/)[0], 10);
        return {
            minTimestamp: new Date(`${year - 5}-01-01`).getTime() / 1000,
            maxTimestamp: new Date(`${year + 5}-12-31`).getTime() / 1000,
        };
    } else {
        const timestamp = new Date(dateString).getTime() / 1000;
        return { minTimestamp: timestamp, maxTimestamp: timestamp };
    }
}

function formatRecord(record) {
    const dateInfo = processDate(record.dateC);
    return {
        ...record,
        objectID: record.id,
        url: `${siteBaseUrl}item/${record.slug}`,
        hasRealThumbnail: record.thumbnail !== "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
        minTimestamp: dateInfo.minTimestamp,
        maxTimestamp: dateInfo.maxTimestamp,
    };
}
var response = await client.GetTaskAsync("Dev_Kaplan", 123L);

async function pushDataToAlgolia() {
    try {
        const formattedRecords = records.map(formatRecord);

        const { taskID } = await client.partialUpdateObjects({
            indexName: "Dev_Kaplan",
            objects: formattedRecords,
        });
        console.log(`Records uploaded with task ID: ${taskID}`);

        // Wait for indexing to complete with custom maxRetries and timeout
        await client.waitForTask({
            indexName,
            taskID,
            maxRetries: 5,
            timeout: (retryCount) => 1000 * (retryCount + 1) // Exponential backoff
        });
        console.log('Indexing complete.');

        const results = await client.searchSingleIndex({
            indexName,
            searchParams: { query: "sample query" }
        });
        console.log('Search results:', results.hits);

    } catch (error) {
        console.error('Error pushing data to Algolia:', error.message, error.stack);
    }
}

pushDataToAlgolia();