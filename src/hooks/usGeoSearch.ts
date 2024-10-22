// src/hooks/useGeoSearch.ts
import {
    useConnector,
    AdditionalWidgetProperties,
} from 'react-instantsearch';
import connectGeoSearch, {
    GeoSearchConnectorParams,
    GeoSearchWidgetDescription,
} from 'instantsearch.js/es/connectors/geo-search/connectGeoSearch';

export type UseGeoSearchProps = GeoSearchConnectorParams;

export function useGeoSearch(
    props: UseGeoSearchProps,
    additionalWidgetProperties: AdditionalWidgetProperties
): GeoSearchWidgetDescription {
    return useConnector<GeoSearchConnectorParams, GeoSearchWidgetDescription>(
        connectGeoSearch,
        props,
        additionalWidgetProperties
    );
}