import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom'

// eslint-disable-next-line default-param-last
const downloadDialogReducer = (state = {}, action) => {
	if (action.type === 'OPEN_WINDOW_DIALOG') {
		return {
			...state,
			[action.windowId]: {
				openDialog: action.dialogType
			}
		}
	}

	if (action.type === 'CLOSE_WINDOW_DIALOG') {
		return {
			...state,
			[action.windowId]: {
				openDialog: null
			}
		}
	}
	return state
}

const mapDispatchToProps = (dispatch, { windowId }) => ({
	openDownloadDialog: () => dispatch({ type: 'OPEN_WINDOW_DIALOG', windowId, dialogType: 'download' })
})

class MiradorDownload extends Component {
	openDialogAndCloseMenu() {
		const { handleClose, openDownloadDialog } = this.props

		openDownloadDialog()
		handleClose()
	}

	render() {
		return (
			<MenuItem onClick={() => this.openDialogAndCloseMenu()}>
				<ListItemIcon>
					<VerticalAlignBottomIcon />
				</ListItemIcon>
				<ListItemText primaryTypographyProps={{ variant: 'body1' }}>
					Download
				</ListItemText>
			</MenuItem>
		)
	}
}

MiradorDownload.propTypes = {
	handleClose: PropTypes.func,
	openDownloadDialog: PropTypes.func
}

MiradorDownload.defaultProps = {
	handleClose: () => {
	},
	openDownloadDialog: () => {
	}
}

export default {
	target: 'WindowTopBarPluginMenu',
	mode: 'add',
	name: 'MiradorDownloadPlugin',
	component: MiradorDownload,
	mapDispatchToProps,
	reducers: {
		windowDialogs: downloadDialogReducer
	}
}
