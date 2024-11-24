import React from 'react'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error }
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught in ErrorBoundary:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return <p>Something went wrong: {this.state.error?.message}</p>
		}
		return this.props.children
	}
}

export default ErrorBoundary