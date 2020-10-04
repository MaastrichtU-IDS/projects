import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from "react-native";
import { Router, Route, Link } from "../react-router";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import axios from 'axios';

class ProjectsDashboard extends Component {

  // Query SPARQL endpoint to get the URI infos
  componentDidMount() {
    const getServicesQuery = `select * where { 
      ?s a <https://schema.org/WebApplication> .
    } limit 100`
    const endpointToQuery = 'https://graphdb.dumontierlab.com/repositories/umids-kg';
    console.log(endpointToQuery);
    axios.get(endpointToQuery + `?query=` + encodeURIComponent(getServicesQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        let searchResults = [];
        sparqlResultArray.forEach((sparqlResultRow) => {
          console.log(sparqlResultRow.s.value)
          // searchResults.push({
          //   foundUri: sparqlResultRow.foundUri.value , 
          //   foundLabel: sparqlResultRow.foundLabel.value
          // })
        })
        // this.setState({ searchResults });
        // this.setState({ isLoading: false });
      })
      .catch(error => {
        console.log(error)
        // this.setState({ requestError: true });
        // this.setState({ isLoading: false });
      })

    // let endpointToQuery = this.state.endpointToQuery;
    // if (!this.state.endpointToQuery || 0 === this.state.endpointToQuery.length) {
    //   // No endpoint provided in URL, use Context API one
    //   endpointToQuery = this.context.triplestore.sparql_endpoint;
    //   this.setState({ endpointToQuery: this.context.triplestore.sparql_endpoint});
    // } else if (this.state.endpointToQuery !== this.context.triplestore.sparql_endpoint) {
    //   // If an endpoint is provided in URL params: snackbar to propose to change settings
    //   this.setState({ openChangeEndpoint: true});
    // } 

    // if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(this.state.describeUri)) {
    // axios.get(endpointToQuery + `?query=` + this.getSearchQuery(this.state.describeUri))
    //   .then(res => {
    //     const sparqlResultArray = res.data.results.bindings;
    //     let searchResults = [];
    //     sparqlResultArray.forEach((sparqlResultRow) => {
    //       searchResults.push({
    //         foundUri: sparqlResultRow.foundUri.value , 
    //         foundLabel: sparqlResultRow.foundLabel.value
    //       })
    //     })
    //     this.setState({ searchResults });
    //     this.setState({ isLoading: false });
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     this.setState({ requestError: true });
    //     this.setState({ isLoading: false });
    //   })

  }

  render () {
    // const { classes } = this.props;
    return(
      <Card>
        <Card.Title title="Card Title" subtitle="Card Subtitle" />
        <Card.Content>
          <Title>Card content title</Title>
          <Paragraph>Card content</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>Cancel</Button>
          <Button>Ok</Button>
        </Card.Actions>
      </Card>
    )
  }

}
export default ProjectsDashboard;
