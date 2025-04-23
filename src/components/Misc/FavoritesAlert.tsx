import { useState } from "react";

export default function FavoritesAlert() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md my-4 relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
        aria-label="Dismiss alert"
      >
        &times;
      </button>
      <p className="font-semibold">PLEASE NOTE:</p>
      <p>
        The favorites feature uses your browser’s cache to store selections. If
        you switch browsers or clear your cache, your saved favorites will be
        lost.
      </p>
    </div>
  );
}