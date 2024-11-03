// src/components/PriceRangeFilter.tsx

import React, { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { useRange, type RangeInputProps } from 'react-instantsearch';
import { convertTimestampToDate } from '../../utils/convertTimestampToDate';
import debounce from 'lodash.debounce';
import type { RangeBoundaries } from '../../types/RangeBoundaries'
import { useRange } from 'react-instantsearch';

/**
 * Props for the PriceRangeFilter component.
 * Extends RangeInputProps from react-instantsearch.
 */
interface PriceRangeFilterProps extends RangeInputProps {}

/**
 * PriceRangeFilter Component
 *
 * Renders two range inputs and two number inputs for selecting
 * a range of Unix timestamps, including negative values.
 * Converts Unix timestamps to human-readable dates.
 */
const PriceRangeFilter: React.FC<PriceRangeFilterProps> = (props) => {
  const { attribute, ...restProps } = props;

  // Utilize the generic type parameter to define the structure of 'range'
  const { range, start, canRefine, refine } = useRange<RangeBoundaries>({
    attribute,
    ...restProps,
  });

  // Safeguard to ensure the 'range' object exists
  if (!range) {
    return null; // Alternatively, render a fallback UI
  }

  const { min, max } = range;

  // State for input fields as strings to handle partial or invalid inputs
  const [inputMin, setInputMin] = useState<string>(String(start?.min ?? min));
  const [inputMax, setInputMax] = useState<string>(String(start?.max ?? max));

  /**
   * Debounced refine function to limit the rate of refinement calls.
   * Enhances performance by reducing unnecessary renders.
   */
  const debouncedRefine = useCallback(
    debounce((minVal: number, maxVal: number) => {
      refine({ [attribute]: minVal, [`${attribute}max`]: maxVal });
    }, 300),
    [refine, attribute]
  );

  /**
   * useEffect hook to synchronize state when external range changes.
   */
  useEffect(() => {
    const updatedMin = start?.min ?? min;
    const updatedMax = start?.max ?? max;
    setInputMin(String(updatedMin));
    setInputMax(String(updatedMax));
  }, [start, min, max]);

  /**
   * Handler for the min range input.
   */

  /**
   * Handler for the max range input.
   */


  /**
   * Handler for input field blur events to validate and correct values.
   */


  return (
    <div className="w-full max-w-md p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">Unix Timestamp Range</h2>

      {/* Range Sliders */}
      <div className="flex flex-col space-y-4">
        {/* Min Slider */}
        <div>
          <label htmlFor="min-slider" className="block mb-1 text-sm font-medium text-gray-700">
            Min: {inputMin} ({convertTimestampToDate(Number(inputMin))})
          </label>
          <input
            id="min-slider"
            type="range"
            min={min}
            max={max}
            value={inputMin}

            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
          />
        </div>

        {/* Max Slider */}
        <div>
          <label htmlFor="max-slider" className="block mb-1 text-sm font-medium text-gray-700">
            Max: {inputMax} ({convertTimestampToDate(Number(inputMax))})
          </label>
          <input
            id="max-slider"
            type="range"
            min={min}
            max={max}
            value={inputMax}
            onChange={handleMaxChange}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer dark:bg-blue-700"
          />
        </div>
      </div>

      {/* Input Fields */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col space-y-4 mt-6">
          <div className="flex items-center space-x-4">
            {/* Min Input */}
            <div className="flex flex-col">
              <label htmlFor="min-input" className="mb-1 text-sm font-medium text-gray-700">
                Min Timestamp
              </label>
              <input
                id="min-input"
                name="min"
                type="number"
                value={inputMin}
                onChange={handleMinChange}
                onBlur={handleBlur}
                min={min}
                max={max}
                step={1}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Min"
              />
              <span className="mt-1 text-xs text-gray-500">
                {inputMin ? convertTimestampToDate(Number(inputMin)) : 'Invalid'}
              </span>
            </div>

            {/* Max Input */}
            <div className="flex flex-col">
              <label htmlFor="max-input" className="mb-1 text-sm font-medium text-gray-700">
                Max Timestamp
              </label>
              <input
                id="max-input"
                name="max"
                type="number"
                value={inputMax}
                onChange={handleMaxChange}
                onBlur={handleBlur}
                min={min}
                max={max}
                step={1}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Max"
              />
              <span className="mt-1 text-xs text-gray-500">
                {inputMax ? convertTimestampToDate(Number(inputMax)) : 'Invalid'}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          <button
            type="submit"
            onClick={() => refine({ [attribute]: Number(inputMin), [`${attribute}max`]: Number(inputMax) })}
            disabled={!canRefine}
            className={`w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !canRefine ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

export default PriceRangeFilter;