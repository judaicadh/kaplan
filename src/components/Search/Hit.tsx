import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { Snippet } from 'react-instantsearch';

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    type: string[];
    date: number;
    description: string;
    title: string;
    geography: string[];
    thumbnail: string;
    slug: string;
    url?: string;
    hasRealThumbnail: boolean;
    subject: string[];
  }>;
};

export function HitTest({ hit }: HitProps) {
  return (
    <article className="hit">
      <a href={`/item/${hit.slug}`}>
        <div className="hit-image">
          <img src={hit.thumbnail || 'path/to/default/image.png'} alt={hit.title} />

        </div>
      </a>
      <div className="mt-6">
        <a href={`/item/${hit.slug}`}>
        <span
          className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
          {hit.type[0]}
        </span>
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <p className="text-gray-500 dark:text-gray-400">{hit.title}</p>
        </a>
          <Snippet hit={hit} attribute="description" />
      </div>
    </article>
);
}

export default HitTest;