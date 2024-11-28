import { algoliasearch } from "algoliasearch";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const appID = "ZLPYTBTZ4R";
const apiKey = "d020c7e559db5854ac9f75c026d0734a";

const client = algoliasearch(appID, apiKey);

const siteBaseUrl = "https://kaplancollection.org/";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonFilePath = path.join(__dirname, '../data/items.json')

// Flatten hierarchical categories for Algolia
const flattenHierarchicalCategories = (categories) => {
  if (!categories) return {}

  return {
    'hierarchicalCategories.lvl0': categories.lvl0?.[0] || null,
    'hierarchicalCategories.lvl1': categories.lvl1?.[0] || null,
    'hierarchicalCategories.lvl2': categories.lvl2?.[0] || null
  }
};

const formatRecord = (record) => {
  return {
    ...record,
    objectID: record.id,
    url: `${siteBaseUrl}item/${record.slug}`,
    hasRealThumbnail: record.thumbnail !== 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon',

    ...flattenHierarchicalCategories(record.hierarchicalCategories) // Include hierarchical categories
  };
};

async function pushDataToAlgolia(records) {
  try {
    const formattedRecords = records.map(formatRecord);

    console.log('Formatted Records:', JSON.stringify(formattedRecords, null, 2))

    // Push records to Algolia
    const response = await client.saveObjects({
      indexName: 'Dev_Kaplan',
      objects: formattedRecords
    })
    console.log('Objects saved successfully:', response.objectIDs)
  } catch (error) {
    console.error('Error pushing data to Algolia:', error.message, error.stack)
  }
}

// Load data from JSON and push to Algolia
(async () => {
  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8')
    const records = JSON.parse(fileContent)

    console.log('Loaded Records:', records.length)

    await pushDataToAlgolia(records)
  } catch (error) {
    console.error('Error loading or processing JSON file:', error.message, error.stack)
  }
})()
    // Use saveObjects to add or update records in Algolia


