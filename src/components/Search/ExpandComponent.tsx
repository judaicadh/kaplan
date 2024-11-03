// ExpandButton.tsx
import React from "react";
import { useMap } from "react-leaflet";
import L, { Control } from "leaflet";

interface ExpandButtonProps {
  onClick: () => void;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({ onClick }) => {
  const map = useMap();

  React.useEffect(() => {
    const expandControl = new Control({ position: "topright" });

    expandControl.onAdd = function () {
      const div = L.DomUtil.create("div", "leaflet-control leaflet-bar");
      const button = L.DomUtil.create("a", "", div);
      button.innerHTML = "⤢"; // Unicode character for expand
      button.title = "Expand Map";
      button.href = "#";

      L.DomEvent.on(button, "click", L.DomEvent.stop).on(
        button,
        "click",
        onClick,
      );

      return div;
    };

    expandControl.addTo(map);

    // Clean up the control when the component is unmounted
    return () => {
      map.removeControl(expandControl);
    };
  }, [map, onClick]);

  return null;
};

export default ExpandButton;
