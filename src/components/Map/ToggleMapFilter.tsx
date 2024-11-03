// ToggleMapFilter.tsx

import React from 'react';

interface ToggleMapFilterProps {
	label: string;
	filteringEnabled: boolean;
	onToggle: (enabled: boolean) => void;
}

const ToggleMapFilter: React.FC<ToggleMapFilterProps> = ({ label, filteringEnabled, onToggle }) => {
	return (
		<div className="flex items-center space-x-2">
			<input
				id="mapFilterToggle"
				type="checkbox"
				className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
				checked={filteringEnabled}
				onChange={(e) => onToggle(e.target.checked)}
			/>
			<label htmlFor="mapFilterToggle" className="text-sm font-medium text-gray-900 dark:text-gray-300">
				{label}
			</label>
		</div>
	);
};

export default ToggleMapFilter;