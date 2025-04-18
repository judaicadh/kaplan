import { useState } from "react";

export default function DefaultCollectionBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="relative text-sm text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded p-3 mb-4">
      You're viewing results from the <strong>Arnold and Deanne Kaplan Collection of Early American Judaica</strong> by
      default.
      To explore other Kaplan collections, use the <strong>Collection</strong> filter.
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
        aria-label="Dismiss message"
      >
        &times;
      </button>
    </div>
  );
}