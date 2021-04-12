import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

import { AppBar, Toolbar, Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import MenuBookIcon from '@material-ui/icons/MenuBook';

// @ts-ignore
import iconImage from '../assets/icon.png';

const useStyles = makeStyles(theme => ({
  menuButton: {
    color: theme.palette.common.white
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  },
  linkLogo: {
    // Seems to fit the 48px navbar height...
    // height: '48px',
    alignItems: 'center',
    display: 'flex',
  },
}))
  
export default function NavBar() {
  const classes = useStyles();

  return (
    <AppBar title="" position='sticky'>
      <Toolbar variant='dense'>
        <Link to="/" className={classes.linkLogo}>
          <Tooltip title='IDS Projects dashboard'>
            <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" />
          </Tooltip>
        </Link>
        <Link to="/create-doap" className={classes.linkButton}>
          <Tooltip title='Create a DOAP description for your project'>
            <Button className={classes.menuButton}>
              <CreateNewFolderIcon />
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>
        {/* <Link to="/about" className={classes.linkButton}>
          <Tooltip title='About the Institute of Data Science'>
            <Button className={classes.menuButton}>
              <InfoIcon />
            </Button>
          </Tooltip>
        </Link> */}
        <Tooltip title='Go to IDS Best Practices documentation'>
          <Button className={classes.menuButton} target="_blank"
          href="https://maastrichtu-ids.github.io/best-practices">
            <MenuBookIcon />
          </Button>
        </Tooltip>
        <Tooltip title='Go to https://github.com/MaastrichtU-IDS/projects'>
          <Button className={classes.menuButton} target="_blank"
          href="https://github.com/MaastrichtU-IDS/projects">
            <GitHubIcon />
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}