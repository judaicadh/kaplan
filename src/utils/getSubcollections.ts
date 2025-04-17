import items from '../data/items.json';

export const getSubcollections = () => {
  const unique = new Set<string>();
  for (const item of items) {
    if (item.subcollection) {
      unique.add(slugify(item.subcollection));
    }
  }
  return Array.from(unique);
};

// If needed elsewhere
export const slugify = (str: string): string =>
  str.toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");