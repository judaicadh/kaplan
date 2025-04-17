export default function BackToSearch() {
  if (typeof window !== 'undefined' && document.referrer.includes("/search")) {
    return (
      <a
        href={document.referrer}
        aria-label="Back to search results"
        className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 transition"
      >
        ← Back to search results
      </a>
    );
  }
  return null;
}