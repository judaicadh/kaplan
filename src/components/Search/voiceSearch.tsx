import React from "react";

type VoiceSearchButtonProps = {
  onVoiceQuery: (query: string | null) => void;
};

const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onVoiceQuery,
}) => {
  const handleVoiceSearch = () => {
    // Example function that triggers the voice query
    const simulatedQuery = "example voice query";
    onVoiceQuery(simulatedQuery);
  };

  return <button onClick={handleVoiceSearch}>Voice Search</button>;
};

export default VoiceSearchButton;
