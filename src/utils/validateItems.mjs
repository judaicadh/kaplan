import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// **1. Define __dirname in ES Modules**
// Since __dirname is not available in ESM, we derive it using fileURLToPath and import.meta.url

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// **2. Define the Path to items.json**

const itemsPath = path.join(__dirname, '../data/items.json'); // Adjusted path based on your directory structure

// **3. Define the Wikidata ID Pattern**

const wikidataIdPattern = /^Q\d+$/;

// **4. Asynchronously Read and Validate Items**

async function validateItems() {
    try {
        // **a. Read the JSON File**
        const data = await fs.readFile(itemsPath, 'utf-8');

        // **b. Parse the JSON Data**
        const items = JSON.parse(data);

        // **c. Validate Each Item**
        items.forEach((entry, index) => {
            if (!entry.peopleURI || !wikidataIdPattern.test(entry.peopleURI)) {
                console.error(`Invalid or missing peopleURI at index ${index}:`, entry);
            }
        });

        console.log('Validation complete.');
    } catch (error) {
        // **d. Handle Errors Gracefully**
        console.error('An error occurred while validating items:', error);
    }
}

// **5. Execute the Validation Function**

validateItems();