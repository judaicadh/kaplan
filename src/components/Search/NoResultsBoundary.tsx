import React, { useEffect, useRef } from 'react';
import { useInstantSearch } from 'react-instantsearch';

type Props = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

declare global {
  interface Window { dataLayer?: any[] }
}

export function NoResultsBoundary({ children, fallback }: Props) {
  const { results, status, error, indexUiState } = useInstantSearch();
  const sentRef = useRef<string>("");

  const nbHits = results?.nbHits ?? 0;
  const isArtificial = (results as any)?.__isArtificial ?? true; // true until first real results
  const isLoading = status === 'loading';
  const isError = status === 'error';

  // Optional GTM ping when we have a stable “no results” state
  useEffect(() => {
    if (isLoading || isArtificial || isError) return;
    if (nbHits > 0) { sentRef.current = ""; return; }

    const q = indexUiState?.query ?? "";
    const payload = JSON.stringify({ q, nbHits });
    if (payload !== sentRef.current) {
      window.dataLayer?.push({
        event: 'algolia_no_results',
        algolia: {
          query: q,
          nbHits,
          index: (results as any)?.index ?? undefined,
        },
      });
      sentRef.current = payload;
    }
  }, [nbHits, isLoading, isArtificial, isError, indexUiState?.query, results]);

  // Don’t show fallback while loading/first artificial render
  if (!isArtificial && !isLoading && !isError && nbHits === 0) {
    return (
      <>
        <div role="status" aria-live="polite">{fallback}</div>
        {/* keep children mounted but hidden to preserve layout/state if needed */}
        <div hidden>{children}</div>
      </>
    );
  }

  // If there’s an error, you might choose to show children or your own error UI.
  // For now, just render children so the page doesn’t go blank.
  return <>{children}</>;
}