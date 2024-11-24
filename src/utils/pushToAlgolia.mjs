import { algoliasearch } from "algoliasearch";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import csv from 'csvtojson';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const appID = "ZLPYTBTZ4R";
const apiKey = "d020c7e559db5854ac9f75c026d0734a";

const client = algoliasearch(appID, apiKey);

const siteBaseUrl = "https://kaplancollection.org/";
// Function to process dates with multiple ranges separated by '|'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, './Kaplan20240808 (31).csv');
const jsonFilePath = path.join(__dirname, '../src/data/items.json');


const dateToTimestamp = (dateString) => {
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) {
    console.warn(`Invalid date string: ${dateString}`);
    return null;
  }
  return Math.floor(timestamp / 1000);
};


const timestampToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid timestamp: ${timestamp}`);
    return null;
  }
  return date.toISOString().split('T')[0];
};


const processDateRanges = (dateArray) => {
  const datePairs = [];

  if(!Array.isArray(dateArray)) return [];

  dateArray.forEach(dateObj => {
    if (!dateObj.start || !dateObj.end) return; // Skip if either is missing

    const startTimestamp = dateToTimestamp(dateObj.start);
    const endTimestamp = dateToTimestamp(dateObj.end);

    //Crucial: Check if the timestamps are valid *before* adding.
    if (startTimestamp !== null && endTimestamp !== null) {
      datePairs.push({ startDate: startTimestamp, endDate: endTimestamp });
    }
    else {
      console.warn(`Invalid date pair in object:`, dateObj);
    }
  });
  // Sort by startDate
  datePairs.sort((a, b) => a.startDate - b.startDate);
  return datePairs.map(pair => ({ start: timestampToDate(pair.startDate), end: timestampToDate(pair.endDate) }));
};


const formatRecord = (record) => {
  const dateRangeResults = processDateRanges(record.date || []); //Correctly handle missing 'date' field
  return {
    ...record,
    objectID: record.id,
    url: `${siteBaseUrl}item/${record.slug}`,
		hasRealThumbnail: (record.thumbnail && record.thumbnail.trim()) !== 'https://placehold.co/600x600.jpg?text=Image+Coming+Soon',
    date_ranges: dateRangeResults,

  };
};



/*function isValidTimestamp(timestamp) {
  return (
    typeof timestamp === "number" &&
    !isNaN(timestamp) &&
    timestamp > -62167219200 &&
    timestamp < 32503680000
  );
}*/
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