import React from "react";
import { Text, View, Platform } from "react-native";
// import { Router, Route, Link } from "./react-router";

import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import './App.css';
import NavBar from "./src/NavBar";
import Footer from "./src/Footer";
import ProjectsDashboard from "./src/ProjectsDashboard";
import CreateDoapProject from "./src/CreateDoapProject";
import About from "./src/About";

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' },
    secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' },
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // red: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
    // "fontSize": 13
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Router basename="/projects/">
      <Switch>
        <View style={{height: '100%', backgroundColor: '#eceff1'}}>
          <NavBar />

          <Route exact path="/" component={ProjectsDashboard} />
          <Route path="/create-doap" component={CreateDoapProject} />
          <Route path="/about" component={About} />
          <Footer />
        </View>
      </Switch>
    </Router>
  </MuiThemeProvider>
);
export default App;
