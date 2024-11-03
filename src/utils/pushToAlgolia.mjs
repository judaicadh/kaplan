import { algoliasearch } from "algoliasearch";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const appID = "ZLPYTBTZ4R";
const apiKey = "d020c7e559db5854ac9f75c026d0734a";

const client = algoliasearch(appID, apiKey);

const siteBaseUrl = "https://kaplancollection.org/";

// Function to process dates
function processDate(dateString) {
  if (!dateString) return { minTimestamp: 0, maxTimestamp: 0 };

  if (dateString.startsWith("circa")) {
    const year = parseInt(dateString.match(/\d+/)[0], 10);
    return {
      minTimestamp: new Date(`${year - 5}-01-01`).getTime() / 1000,
      maxTimestamp: new Date(`${year + 5}-12-31`).getTime() / 1000,
    };
  } else {
    try {
      // Handle invalid date formats gracefully
      const timestamp = new Date(dateString).getTime() / 1000;
      return { minTimestamp: timestamp, maxTimestamp: timestamp };
    } catch (error) {
      console.warn(`Invalid date format: ${dateString}`, error);
      return { minTimestamp: 0, maxTimestamp: 0 };
    }
  }
}

// Function to format each record
function formatRecord(record) {
  const dateInfo = processDate(record.dateC);
  // Check if timestamps are valid
  const minTimestamp = isValidTimestamp(dateInfo.minTimestamp)
    ? dateInfo.minTimestamp
    : null;
  const maxTimestamp = isValidTimestamp(dateInfo.maxTimestamp)
    ? dateInfo.maxTimestamp
    : null;

  return {
    ...record,
    objectID: record.id,
    url: `${siteBaseUrl}item/${record.slug}`,
    hasRealThumbnail:
      record.thumbnail !==
      "https://placehold.co/600x600.jpg?text=Image+Coming+Soon",
    minTimestamp,
    maxTimestamp,
  };
}

function isValidTimestamp(timestamp) {
  return (
    typeof timestamp === "number" &&
    !isNaN(timestamp) &&
    timestamp > -62167219200 &&
    timestamp < 32503680000
  );
}
// Function to push data to Algolia
async function pushDataToAlgolia(records) {
  try {
    // Format each record
    const formattedRecords = records.map(formatRecord);

    console.log("Attempting to save objects to Algolia...");
    console.log("Records being sent to Algolia:", formattedRecords);

    // Use saveObjects to add or update records in Algolia
    const response = await client.saveObjects({
      indexName: "Dev_Kaplan",
      objects: formattedRecords,
    });

    console.log("Objects saved successfully:", response.objectIDs);
  } catch (error) {
    console.error("Error pushing data to Algolia:", error.message, error.stack);
  }
}

// Load data from the JSON file
try {
  const records = require("../data/items.json");
  pushDataToAlgolia(records); // Call pushDataToAlgolia with the records
} catch (error) {
  console.error("Error loading data from JSON file:", error.message);
}
