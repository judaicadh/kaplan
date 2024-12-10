import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) {
	throw new Error('Root element not found. Make sure you have a <div id="root"></div> in your index.html.')
}

const root = ReactDOM.createRoot(rootElement)

root.render(
	<React.StrictMode>
		<Router>
			<App />
		</Router>
	</React.StrictMode>
)