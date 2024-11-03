declare namespace JSX {
  interface IntrinsicElements {
    "clover-viewer": {
      manifest?: string; // The manifest URL
      showAttribution?: boolean; // Show attribution
      showTitle?: boolean; // Show title
      enableImageRotation?: boolean; // Enable image rotation
      canvasIndex?: number; // Start with a specific canvas index
      showThumbnails?: boolean; // Show thumbnails
      showToolbar?: boolean; // Show toolbar
    };
  }
}
