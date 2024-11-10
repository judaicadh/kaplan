// Define the interface for a single item in your data
export interface Item {
  id: string;
  link: string;
  slug: string;
  date: string;
  peopleURI: string;
  title: string;
  type: string;
  subtype: string[];
  PhysicalLocation: string;
  description: string;
  thumbnail: string;
  manifestUrl: string;
  franklinLink: string;
  cross: string;
  column_type: string;
  dateC: string;
  geography: string[];
  object_type: string[];
  people: string;
}

// Define the Algolia hit, which represents a search result item
export interface AlgoliaHit {
  objectID: string; // This is typically the unique identifier used by Algolia
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  type: string;
  date: string;
  people: string;
}

// Define the structure of Algolia results from the API
export interface AlgoliaSearchResponse {
  hits: AlgoliaHit[]; // An array of hits (search results)
  nbHits: number; // Total number of hits (results)
  page: number; // The current page number
  nbPages: number; // Total number of pages
  hitsPerPage: number; // Number of hits per page
}

// Define the context for preview items
export interface PreviewContext {
  preview: AlgoliaHit | null;
}

export interface Geoloc {
  lat: number;
  lng: number;
}

export interface MapHit {
  id: string;
  title: string;
  _geoloc: Geoloc | Geoloc[]; // Allow single or multiple geolocations
  // Add other relevant fields if necessary
}

interface GeoHit {
  id: string;
  name: string;
  description: string;
  _geoloc: { lat: number; lng: number }; // Update to GeoLoc type
  // Add other attributes as needed

}