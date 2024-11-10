// utils/TimestampToDate.ts
export function formatUnixTimestamp(unixTimestamp: number, locale: string = 'en-US'): string {
	const timestampMs = unixTimestamp.toString().length === 10 ? unixTimestamp * 1000 : unixTimestamp;
	const date = new Date(timestampMs);

	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}