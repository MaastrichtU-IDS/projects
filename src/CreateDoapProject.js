import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { Typography, Container, Paper, Button } from "@material-ui/core";
import { FormControl, TextField, Input, InputLabel, FormHelperText, Select } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import GetAppIcon from '@material-ui/icons/GetApp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const styles = theme => ({
  settingsForm: {
    width: '90%',
    // textAlign: 'center',
    '& .MuiFormControl-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(1),
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(2, 2),
    // maxWidth: '400px'
  },
  fullWidth: {
    width: '100%',
  },
  normalFont: {
    fontSize: '14px',
  },
  smallerFont: {
    fontSize: '12px',
  },
  alignLeft: {
    textAlign: 'left'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  }
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class CreateDoapProject extends Component {

  state = {open: false, 
    dialogOpen: false
  }

  // componentDidMount() {
  // }

  handleSubmit  = (event, setTriplestore) => {
    event.preventDefault();
    console.log('form submitted')
    // setTriplestore({
    //   sparql_endpoint: this.state.sparql_endpoint_autocomplete, 
    //   graphs_overview: this.formGraphsOverview.current.value,
    //   graph_uri_resolution: this.formGraphUriResolution.current.value,
    //   openapi_url: this.state.openapi_url_autocomplete, 
    //   comunica_url: this.state.comunica_url_autocomplete,
    //   filebrowser_url: this.state.filebrowser_url_autocomplete, 
    //   search_query: this.formSearchQuery.current.value, 
    // });
    // this.setState({ open: true });
  }

  handleAutocomplete = (stateToUpdate, searchText) => {
    console.log('stateToUpdate, searchText')
    console.log(stateToUpdate)
    console.log(searchText)
    // Generate specific state key for this autocomplete
    const autocompleteStateKey = stateToUpdate + '_autocomplete';
    if (searchText && searchText.target){
      if (searchText.target.value) {
        this.setState({ [autocompleteStateKey]: searchText.target.value})
      } else {
        this.setState({ [autocompleteStateKey]: searchText.target.innerText})
      }
    } 
    else {
      // If nothing in field, we get from the context
      // const fromContext = this.context.triplestore[]
      this.setState({ [autocompleteStateKey]: this.context.triplestore[[stateToUpdate]]})
    }
  }

  render () {
    const { classes } = this.props;
    return(
      <Container style={{marginTop: '20px'}}>
        <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
          Create a DOAP description for your project 📝
        </Typography>
        

        <form onSubmit={(event) => {
          this.handleSubmit(event, setTriplestore)}}>
            <FormControl className={classes.settingsForm}>
              <Paper elevation={2} className={classes.paperPadding}>
                <Typography variant="h5" className={classes.paperTitle}>
                  URI resolution
                </Typography>
                <Autocomplete
                  onChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                  onInputChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                  id="autocomplete-sparql-endpoint"
                  options={['https://graphdb.dumontierlab.com/repositories/trek', 'https://graphdb.dumontierlab.com/repositories/bio2vec']}
                  // value={this.context.triplestore.sparql_endpoint}
                  freeSolo={true}
                  includeInputInList={true}
                  ListboxProps={{
                    className: classes.alignLeft,
                  }}
                  renderInput={params => <TextField {...params} 
                  label="SPARQL endpoint URL" 
                  variant="outlined" 
                  // getOptionLabel={option => option.title}
                  // style={{ width: 300 }}
                  // size='small'
                  />}
                />
              <FormHelperText id="helper-sparql-endpoint">SPARQL endpoint URL used by the into-the-graph app to resolve URIs.</FormHelperText>
              <FormControl variant="outlined" 
                className={classes.fullWidth}
                >
                <InputLabel id="form-graph-overview-label">
                  Graphs overview query type
                </InputLabel>
                <Select
                  labelId="form-graph-overview-label"
                  label="Graphs overview query type"
                  // defaultValue={triplestore.graphs_overview}
                  inputRef={this.formGraphsOverview}
                  // MenuProps={{
                  //   className: classes.fullWidth,
                  // }}
                  // SelectDisplayProps={{
                  //   className: classes.smallerFont,
                  //   style: {width: '100%'}
                  // }}
                  InputProps={{
                    className: classes.smallerFont,
                    // style: {width: '100%'}
                  }}
                  autoWidth
                >
                  <MenuItem value="hcls">HCLS descriptive metadata</MenuItem>
                  <MenuItem value="all">Get all graphs (optimized in Virtuoso)</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText id="helper-graphs-overview">2 possibilities: "hcls" gets only graphs described using HCLS metadata and "all" get all graphs (optimized in Virtuoso)</FormHelperText>
              <FormControl variant="outlined" 
                className={classes.fullWidth}
                >
                <InputLabel id="form-graph-uri-resolution-label">
                  Resolution of Graph URIs
                </InputLabel>
                <Select
                  labelId="form-graph-uri-resolution-label"
                  label="Resolution of Graph URIs"
                  // defaultValue={triplestore.graph_uri_resolution}
                  inputRef={this.formGraphUriResolution}
                  // MenuProps={{
                  //   className: classes.fullWidth,
                  // }}
                  // SelectDisplayProps={{
                  //   className: classes.smallerFont,
                  //   style: {width: '100%'}
                  // }}
                  InputProps={{
                    className: classes.smallerFont,
                    // style: {width: '100%'}
                  }}
                  autoWidth
                >
                  <MenuItem value="classes">Show only classes in the graph</MenuItem>
                  <MenuItem value="triples">Show all triples in the graph (LDP, Nanopubs)</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText id="helper-graph-uri-resolution">What is shown when resolving a URI as a graph</FormHelperText>
            </Paper>
            <Paper elevation={2} className={classes.paperPadding}>
              <Typography variant="h5" className={classes.paperTitle}>
                Search query
              </Typography>
              <FormHelperText>
                Change here the SPARQL query used when searching in the navbar search box. 
                Use $TEXT_TO_SEARCH to define where the text to search will be replaced in the query.
                It should return a ?foundUri and a ?foundLabel to be displayed by the app.
              </FormHelperText>
              <TextField
                id="textfield-search-query"
                label="Search query used by the app"
                placeholder="Search query used by the app"
                className={classes.fullWidth}
                // defaultValue={triplestore.search_query}
                variant="outlined"
                inputRef={this.formSearchQuery}
                multiline={true}
                // size='small'
                InputProps={{
                  className: classes.normalFont
                }}
                InputLabelProps={{
                  className: classes.normalFont
                }}
              />
              <FormHelperText>
                You can use those examples queries to use GraphDB or Virtuoso Search Index (it needs to have been enabled in the triplestore before):
              </FormHelperText>
              <TextField 
                className={classes.fullWidth}
                id="search-graphdb" 
                label="Search query for Ontotext GraphDB" 
                variant="outlined" multiline={true}
                // value={example_search_graphdb}
                size='small'
                InputProps={{
                  className: classes.smallerFont
                }}
                InputLabelProps={{
                  className: classes.smallerFont
                }}
              />
              <TextField 
                className={classes.fullWidth}
                id="search-virtuoso" 
                label="Search query for OpenLink Virtuoso" 
                variant="outlined" multiline={true}
                // value={example_search_virtuoso}
                size='small'
                InputProps={{
                  className: classes.smallerFont
                }}
                InputLabelProps={{
                  className: classes.smallerFont
                }}
              />
            <TextField 
                className={classes.fullWidth}
                id="search-default" 
                label="Default search query" 
                variant="outlined" multiline={true}
                // value={example_search_default}
                size='small'
                InputProps={{
                  className: classes.smallerFont
                }}
                InputLabelProps={{
                  className: classes.smallerFont
                }}
              />
            </Paper>
            <Button type="submit"
            variant="contained" 
            className={classes.saveButton} 
            startIcon={<GetAppIcon />}
            color="primary" >
              Download DOAP description
            </Button>
            {/* <Button
            variant="contained" size="small" 
            className={classes.saveButton} 
            onClick={this.confirmDeleteCache}
            startIcon={<Icon>delete</Icon>}
            color="secondary" >
              Delete cache
            </Button> */}
            <Snackbar open={this.state.open} onClose={this.handleClose} autoHideDuration={3000}>
              <Alert severity="success">
                Settings has been saved
              </Alert>
            </Snackbar>
          </FormControl>
        </form>


      </Container>
    )
  }

}
export default  withStyles(styles) (CreateDoapProject);
