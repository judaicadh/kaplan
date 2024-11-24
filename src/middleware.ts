import { decodeManifest } from './utils/decodeManifest'

export const onRequest = async (context, next) => {
	const response = await next()

	const contentType = response.headers.get('Content-Type')
	if (contentType?.includes('application/json')) {
		const originalText = await response.text()
		let jsonResponse: any

		try {
			jsonResponse = JSON.parse(originalText)
			jsonResponse = decodeManifest(jsonResponse)
		} catch (error) {
			console.error('Error parsing or decoding JSON:', error)
			return new Response(originalText, { status: response.status, headers: response.headers })
		}

		return new Response(JSON.stringify(jsonResponse), {
			status: response.status,
			headers: response.headers
		})
	}

	return response
}