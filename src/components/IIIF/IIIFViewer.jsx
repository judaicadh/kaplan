import React from 'react';
import openSeadragon from 'openseadragon';
import Viewer from '@samvera/clover-iiif/viewer';

const IIIFViewer = (props) => {
    const { manifestUrl } = props;

    // Handle case where manifestUrl is not provided
  if (!manifestUrl) {
    return <div>No manifest URL provided.</div>; // Optionally, handle missing URL
  }

  return (
    <Viewer
      iiifContent={manifestUrl} // Pass the manifest URL directly to the Viewer
      options={{
        openSeadragon: {

          gestureSettingsMouse: {
            scrollToZoom: true,
          },
        },

        showThumbnail: false, // Enable thumbnail display
        thumbnailSize: "small", // Choose thumbnail size (e.g., "small", "medium", "large")
        thumbnailPosition: "left", // Set thumbnail position
        showIIIFBadge: true,
        showTitle: false,

        showDownload: true,
        informationPanel: {
          open: false,
          renderAbout: true,
          // renderContentSearch: true,

        },
      }}
      customTheme={{
        colors: {
          primary: "#4e798d",
          primaryMuted: "#436477",
          primaryAlt: "#436477",
          accent: "#4e798d",
          accentMuted: "#436477",
          accentAlt: "#436477",
          secondary: "#FFFFFF",
          secondaryMuted: "#e7e7e7",
          secondaryAlt: "#707070",
        },
        fonts: {
          sans: 'basic-sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          display: 'mokoko-variable, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
      }}
    />
  );
};

export default IIIFViewer;