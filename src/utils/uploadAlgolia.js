import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises'; // Using fs/promises for async operations
import path from 'path';
import { fileURLToPath } from 'url';
import slugify from 'slugify';
import algoliasearch from 'algoliasearch';
import { JSDOM } from 'jsdom'; // Import jsdom to parse HTML

// Debugging: Log the imported algoliasearch
console.log('algoliasearch:', algoliasearch);
console.log('Type of algoliasearch:', typeof algoliasearch);

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex('Dev_Kaplan'); // Replace with your actual index name

const recordsDir = path.join(__dirname, '../../dist/item/'); // Assuming dist is at the project root

// Function to recursively read HTML files from directories
const getHtmlFiles = async (dir) => {
    let files = [];
    try {
        const items = await fs.readdir(dir); // Asynchronous directory read
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = await fs.stat(fullPath); // Get stats asynchronously
            if (stats.isDirectory()) {
                const subFiles = await getHtmlFiles(fullPath); // Recur into subdirectories
                files = files.concat(subFiles);
            } else if (item.endsWith('.html')) {
                files.push(fullPath); // Add HTML file
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }
    return files;
};

// Function to process and upload files to Algolia
const processFiles = async () => {
    try {
        const files = await getHtmlFiles(recordsDir); // Wait for the files to be fetched

        const uploadPromises = files.map(async (file) => {
            try {
                const content = await fs.readFile(file, 'utf-8'); // Read file asynchronously

                // Parse HTML and extract data
                const dom = new JSDOM(content);
                const document = dom.window.document;

                // Extract slug from the folder name
                const slug = path.basename(path.dirname(file)); // Get the name of the folder as the slug

                // Function to find the next sibling <dd> based on the <dt> text

                // Prepare the object for Algolia
                const object = {
                    objectID: slug, // Use slug from the folder name
                    title,
                    description,
                    physicalLocation,
                    type,
                    geography,
                    peopleURI,
                    people,
                };

                // Add or update the object in Algolia
                return index.saveObject({
                    objectID: slug,
                    ...object, // Spread the object properties
                });
            } catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        });

        // Execute all uploads and handle results
        const responses = await Promise.all(uploadPromises);
        console.log('Successfully uploaded objects to Algolia:', responses);
    } catch (err) {
        console.error('Error processing files:', err);
    }
};

// Start processing files
processFiles();