import type { Hit } from "@algolia/client-search";

export type ProductHit = Hit<{
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