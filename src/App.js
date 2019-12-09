import React from 'react';
import './App.css';
import { AppBar, Typography, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/styles';
import MessageList from './MessageList';

const useStyles = makeStyles(theme => ({
	menuButton: {
		marginRight: '16',
	},
}));
  
function App() {
	const classes = useStyles();
	return (
		<div className="App">
			<AppBar position="fixed">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6">
						Messages
					</Typography>
				</Toolbar>
			</AppBar>
			<MessageList />
		</div>
	);
}

export default App;
