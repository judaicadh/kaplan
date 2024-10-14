import dotenv from 'dotenv';
import algoliasearch from 'algoliasearch';
import items from '../data/items.json'; // Adjust path as needed

// Load environment variables
dotenv.config();

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_API_KEY);
const index = client.initIndex('items');

// Push items to Algolia, using the existing ID as objectID
const objectsWithIDs = items.map(item => ({
    ...item,
    objectID: item.id // Use the existing ID as the objectID
}));

index.saveObjects(objectsWithIDs, { autoGenerateObjectIDIfNotExist: false })
    .then(({ objectIDs }) => {
        console.log('Items indexed in Algolia with objectIDs:', objectIDs);
    })
    .catch(err => {
        console.error('Error indexing items:', err);
    });