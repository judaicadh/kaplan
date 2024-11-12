// utils/dateConversion.ts

import { fromUnixTime, getUnixTime } from 'date-fns';

/**
 * Converts a Unix timestamp (in seconds) to a JavaScript Date object.
 * @param timestamp Unix timestamp in seconds.
 * @returns Date object.
 */
export const convertUnixToDate = (timestamp: number): Date => {
	return fromUnixTime(timestamp);
};

/**
 * Converts a JavaScript Date object to a Unix timestamp (in seconds).
 * @param date Date object.
 * @returns Unix timestamp in seconds.
 */
export const convertDateToUnix = (date: Date): number => {
	return getUnixTime(date);
};