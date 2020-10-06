import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Router, Route, Link } from "./react-router";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import './App.css';
import NavBar from "./src/NavBar";
import Footer from "./src/Footer";
import ProjectsDashboard from "./src/ProjectsDashboard";
import CreateDoapProject from "./src/CreateDoapProject";

const About = () => <Text>About</Text>;

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' },
    // primary: { light: '#63a4ff', main: blue[700], dark: blue[900] },
    // Same color as Angular into-the-graph: blue[700] / #1976d2
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    // Secondary Green: 
    secondary: { light: '#4caf50', main: '#087f23', dark: '#00600f' },
    // red: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    // default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    // "fontSize": 13,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <Router>
      <View style={{height: '100%', backgroundColor: '#eceff1'}}>
        <NavBar />
        {/* <View style={styles.nav}>
          <Link to="/">
            <Text>Home</Text>
          </Link>
          <Link to="/about">
            <Text>About</Text>
          </Link>
        </View> */}
        <Route exact path="/" component={ProjectsDashboard} />
        <Route path="/create-doap" component={CreateDoapProject} />
        <Route path="/about" component={About} />
        <Footer />
      </View>
    </Router>
  </MuiThemeProvider>
);

const styles = StyleSheet.create({
  nav:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
