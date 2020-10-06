import React, { Component } from "react";
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withRouter, Link } from "react-router-dom";

import {WithStyles, AppBar, Toolbar, Button} from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/Info';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import MenuBookIcon from '@material-ui/icons/MenuBook';

// const useStyles = makeStyles(theme => ({
// const styles = theme => ({
const styles = ({ palette, spacing }: Theme) => createStyles({
  menuButton: {
    color: palette.common.white,
    // textTransform: 'none',
    // textDecoration: 'none',
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  }
})

interface Props extends WithStyles<typeof styles> {
}
 
// export default function NavBar() {
// const DecoratedClass = withStyles(styles)(
class NavBar extends Component<Props> {
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
              <Tooltip title='IDS Projects dashboard'>
                <Button className={classes.menuButton}>
                  <DashboardIcon />
                </Button>
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
            <Link to="/about" className={classes.linkButton}>
              <Tooltip title='About the Institute of Data Science'>
                <Button className={classes.menuButton}>
                  <InfoIcon />
                </Button>
              </Tooltip>
            </Link>
            <Tooltip title='Go to IDS Best Practices documentation'>
              <Button className={classes.menuButton} target="_blank"
              href="https://maastrichtu-ids.github.io/best-practices">
                <MenuBookIcon />
              </Button>
            </Tooltip>
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
export default withStyles(styles)(NavBar);
// export default withRouter((withStyles(styles)(NavBar))) ;