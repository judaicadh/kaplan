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
      <div className="hit-image">
        <a href={`/item/${hit.slug}`}>
          <img src={hit.thumbnail || 'path/to/default/image.png'} alt={hit.title} />
        </a>
      </div>
      <a href={`/item/${hit.slug}`}>
        <div className="mt-6">
        <span
          className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300">
          {hit.type[0]}
        </span>
          <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <p className="text-gray-500 dark:text-gray-400">{hit.title}</p>

        </div>
      </a>
    </article>
);
}

export default HitTest;