// src/utils/sparql.js
import fetch from 'node-fetch';

export async function fetchWikidata(sparqlQuery) {
    const url = 'https://query.wikidata.org/sparql';
    const params = new URLSearchParams();
    params.append('query', sparqlQuery);
    params.append('format', 'json');

    const response = await fetch(`${url}?${params.toString()}`, {
        headers: {
            'Accept': 'application/sparql-results+json',
        },
    });

    if (!response.ok) {
        throw new Error(`Wikidata query failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}