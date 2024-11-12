import type { Hit as AlgoliaHit } from 'instantsearch.js/es/types';
import { Snippet } from 'react-instantsearch';

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    type: string[];
    subtype: string[];
    dateC: string;
    description: string;
    title: string;
    geography: string[];
    thumbnail: string;
    slug: string;
    url?: string;
    hasRealThumbnail: boolean;
    subject: string[];
    _geoloc: number[];
    minTimestamp: number[];
    maxTimestamp: number[];
  }>;
};

export function HitTest({ hit }: HitProps) {
  return (
    <article className="hit">
      <header className="hit-image-container">
        <img src={hit.thumbnail} alt={hit.title} className="hit-image" />
      </header>
<br/>
      <div className="hit-info-container">


          <h1>
            {hit.title}
          </h1>
          <br />


        <footer>
          <p className="hit-category"> {hit.subtype[0]} - {hit.dateC}</p>

        </footer>
      </div>
    </article>
  );
}

export default HitTest;