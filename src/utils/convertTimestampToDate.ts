export const convertTimestampToDate = (timestamp: number): string => {
	const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
	return date.toLocaleDateString(); // Formats the date based on user's locale
};