import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { Router, Route, Link } from "./react-router";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import ProjectsDashboard from "./src/ProjectsDashboard";

const Home = () => (
  <Text>Home</Text>
);

const About = () => <Text>About</Text>;


const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    // primary: '#3498db',
    // accent: '#f1c40f',
  },
};

const App = () => (
  <PaperProvider>
    <Router>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Link to="/">
            <Text>Home</Text>
          </Link>
          <Link to="/about">
            <Text>About</Text>
          </Link>
        </View>

        <Route exact path="/" component={ProjectsDashboard} />
        <Route path="/about" component={About} />
      </View>
    </Router>
  </PaperProvider>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 10
  },
  nav:{
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
