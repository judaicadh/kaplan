// src/components/ItemPage.jsx
import React, { useState } from 'react';
import IIIFViewer from '../IIIF/IIIFViewer.jsx'; // Adjust the path if necessary
import MultiURIDereferencer from './MultiURIDereferencer.astro';

const ItemPage = ({ itemData }) => {
    const peopleURI = itemData.peopleURI; // Replace with the actual field for people URI
    const geographyURI = itemData.geographyURI; // Replace with the actual field for geography URI
    const typeURI = itemData.typeURI; // Replace with the actual field for type URI
    const subtypeURI = itemData.subtypeURI; // Replace with the actual field for subtype URI

    const places = itemData.geography || []; // Assuming geography is an array of places
    const people = itemData.people || []; // Assuming people is an array of people

    // State to store filtered results
    const [filteredResults, setFilteredResults] = useState([]);
    const [filterType, setFilterType] = useState(null);

    const handleFilter = (value, type) => {
        setFilterType(type);
        setFilteredResults(items.filter(item => {
            if (type === 'people') {
                return item.people.includes(value);
            }
            if (type === 'geography') {
                return item.geography.includes(value);
            }
            return false;
        }));
    };


    return (
        <div className="bg-white">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:grid-cols-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{itemData.title}</h2>
                    <p className="mt-4 text-gray-500">{itemData.description}</p>
                    <dl className="mt-16 grid gap-x-6 gap-y-10 sm:gap-y-16 lg:gap-x-8">
                        <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">Physical Location</dt>
                            <dd className="mt-2 text-sm text-gray-500">{itemData.PhysicalLocation}</dd>
                        </div>

                        <div className="border-t border-gray-200 pt-1">
                            <MultiURIDereferencer
                                peopleURI={peopleURI}
                                geographyURI={geographyURI}
                                typeURI={typeURI}
                                subtypeURI={subtypeURI}
                            />
                            <dt className="font-medium text-gray-900">Type</dt>
                            <dd className="mt-2 text-sm text-gray-500">{itemData.type || "N/A"}</dd>
                            <dd className="mt-2 text-sm text-gray-500">{itemData.subtype || "N/A"}</dd>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">Geographic Information</dt>
                            <dd className="mt-2 text-sm text-gray-500">
                                {places.length > 0 ? (
                                    <ul>
                                        {places.map(place => (
                                            <li key={place} onClick={() => handleFilter(place, 'geography')} style={{ cursor: 'pointer', color: 'blue' }}>
                                                {place}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "N/A"
                                )}
                            </dd>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <dt className="font-medium text-gray-900">Associated People</dt>
                            <dd className="mt-2 text-sm text-gray-500">
                                {people.length > 0 ? (
                                    <ul>
                                        {people.map(person => (
                                            <li key={person} onClick={() => handleFilter(person, 'people')} style={{ cursor: 'pointer', color: 'blue' }}>
                                                {person}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "N/A"
                                )}
                            </dd>
                        </div>
                    </dl>

                    {filteredResults.length > 0 && (
                        <div>
                            <h3 className="mt-4 text-lg font-bold">Filtered Results:</h3>
                            <ul>
                                {filteredResults.map(result => (
                                    <li key={result.id}>
                                        <a href={`/item/${result.slug}`} className="text-blue-600 underline">{result.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <IIIFViewer manifestUrl={viewerManifest} client:only="react" />
                </div>
            </div>
        </div>
    );
};

export default ItemPage;