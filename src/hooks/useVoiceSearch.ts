// hooks/useVoiceSearch.ts
import { useConnector } from "react-instantsearch";
import connectVoiceSearch from "instantsearch.js/es/connectors/voice-search/connectVoiceSearch";
import type {
  VoiceSearchConnectorParams,
  VoiceSearchWidgetDescription,
} from "instantsearch.js/es/connectors/voice-search/connectVoiceSearch";

export type UseVoiceSearchProps = VoiceSearchConnectorParams;

export function useVoiceSearch(props?: UseVoiceSearchProps) {
  return useConnector<VoiceSearchConnectorParams, VoiceSearchWidgetDescription>(
    connectVoiceSearch,
    props,
  );
}
