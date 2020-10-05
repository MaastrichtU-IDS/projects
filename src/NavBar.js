import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from "react-router-dom";

import {AppBar, Toolbar, Button} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import DashboardIcon from '@material-ui/icons/Dashboard';


const styles = theme => ({
  menuButton: {
    color: theme.palette.default.main,
    // marginRight: '1em',
    // marginLeft: '1em',
    // textTransform: 'none',
    // textDecoration: 'none',
    // fontSize: '14px'
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  }
})
 
// export default function NavBar() {
class NavBar extends Component {
  state = { 
    searchText: '',
    open: true
  }

  // static contextType = TriplestoreContext;

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      open: true
    }
  }
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBar title="" position='sticky'>
          <Toolbar variant='dense'>
            <Link to="/" className={classes.linkButton}>
              <Tooltip title='Projects dashboard'>
                <Button className={classes.menuButton}>
                  <DashboardIcon />
                </Button>
              </Tooltip>
            </Link>
            <div className="flexGrow"></div>
            <Link to="/about" className={classes.linkButton}>
              <Tooltip title='About the Institute of Data Science'>
                <Button className={classes.menuButton}>
                  <InfoIcon />
                </Button>
              </Tooltip>
            </Link>
            <Tooltip title='Go to https://github.com/MaastrichtU-IDS'>
              <Button className={classes.menuButton} target="_blank"
              href="https://github.com/MaastrichtU-IDS">
                <GitHubIcon />
              </Button>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}
export default withRouter((withStyles(styles)(NavBar))) ;