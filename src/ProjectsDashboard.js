import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import { Typography, Container } from "@material-ui/core";

// TODO: add search https://gist.github.com/codegeous/437da0b2afb0246a781b9e6acf00eb4d
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

  }

  render () {
    // const { classes } = this.props;
    return(
      <Container style={{marginTop: '20px'}}>
        <Typography variant="h3" style={{textAlign: 'center', marginBottom: '20px'}}>
          Institute of Data Science projects 🗂️
        </Typography>
        <Paper elevation={4} style={{padding: '15px'}}>
          <Typography variant="h5">
            Project
          </Typography>
          <Typography>
            Description
          </Typography>
        </Paper>
      </Container>
    )
  }

}
export default ProjectsDashboard;
