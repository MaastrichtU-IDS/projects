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
    width: '100%',
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
    dialogOpen: false,
    license_autocomplete: ''
  }

  constructor(props) {
    super(props);
    this.form_category_dropdown = React.createRef(); 
  }
  // componentDidMount() {
  // }

  handleSubmit  = (event) => {
    event.preventDefault();
    let doap_content = `my DOAP project RDF 
category: ` + this.form_category_dropdown.current.value + `
license: ` + this.state.license_autocomplete;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(doap_content));
    element.setAttribute('download', '.doap-project.ttl');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    // console.log('form submitted')
    // setTriplestore({
    //   sparql_endpoint: this.state.license_autocomplete, 
    //   graphs_overview: this.form_category_dropdown.current.value,
    //   graph_uri_resolution: this.formGraphUriResolution.current.value,
    //   openapi_url: this.state.openapi_url_autocomplete, 
    //   comunica_url: this.state.comunica_url_autocomplete,
    //   filebrowser_url: this.state.filebrowser_url_autocomplete, 
    //   search_query: this.formSearchQuery.current.value, 
    // });
    this.setState({ open: true });
  }
  // Close Snackbar
  handleClose = (event, reason) => {
    this.setState({ open: false});
  };

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
          this.handleSubmit(event)}}>
            <FormControl className={classes.settingsForm}>
              <Paper elevation={2} className={classes.paperPadding}>
                <Typography variant="h5" className={classes.paperTitle}>
                  Project informations
                </Typography>
                <Autocomplete
                  onChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                  onInputChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                  id="autocomplete-sparql-endpoint"
                  options={['MIT license', 'Apache license']}
                  // value={this.context.triplestore.sparql_endpoint}
                  freeSolo={true}
                  includeInputInList={true}
                  ListboxProps={{
                    className: classes.alignLeft,
                  }}
                  renderInput={params => <TextField {...params} 
                  label="License" 
                  variant="outlined"
                  size='small'
                  // getOptionLabel={option => option.title}
                  // style={{ width: 300 }}
                  // size='small'
                  />}
                />
              <FormHelperText id="helper-sparql-endpoint">Choose a license at...</FormHelperText>
              <FormControl variant="outlined" 
                className={classes.fullWidth}
                >
                <InputLabel id="form-graph-overview-label">
                  Project category / type
                </InputLabel>
                <Select
                  labelId="form-category-dropdown-label"
                  label="Project category / type"
                  size='small'
                  // defaultValue={triplestore.graphs_overview}
                  inputRef={this.form_category_dropdown}
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
                  <MenuItem value="Deep Learning">Deep Learning</MenuItem>
                  <MenuItem value="Data processing">Data processing</MenuItem>
                </Select>
              </FormControl>
              <FormHelperText id="helper-graphs-overview">Pick a category best describing your project</FormHelperText>
            </Paper>
            <Paper elevation={2} className={classes.paperPadding}>
              <Typography variant="h5" className={classes.paperTitle}>
                Contact details
              </Typography>
              <FormHelperText>
                Informations about the developers and responsibles of this project. 
              </FormHelperText>
              <TextField
                id="textfield-search-query"
                label="Contributor name"
                placeholder="Contributor name"
                className={classes.fullWidth}
                // defaultValue={triplestore.search_query}
                variant="outlined"
                inputRef={this.formSearchQuery}
                multiline={true}
                size='small'
                InputProps={{
                  className: classes.normalFont
                }}
                InputLabelProps={{
                  className: classes.normalFont
                }}
              />
              <TextField
                id="textfield-email"
                label="Contributor email"
                placeholder="Contributor email"
                className={classes.fullWidth}
                // defaultValue={triplestore.search_query}
                variant="outlined"
                inputRef={this.formSearchQuery}
                multiline={true}
                size='small'
                InputProps={{
                  className: classes.normalFont
                }}
                InputLabelProps={{
                  className: classes.normalFont
                }}
              />
            </Paper>
            {/* <Download file=".doap-project.ttl" content="content here"> */}
            <div style={{width: '100%', textAlign: 'center'}}>
              <Button type="submit" 
                // style={{width: '100%'}}
                variant="contained" 
                className={classes.saveButton} 
                startIcon={<GetAppIcon />}
                color="secondary" >
                  Download DOAP description
              </Button>
            </div>
            {/* </Download> */}
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
                Thanks!
              </Alert>
            </Snackbar>
          </FormControl>
        </form>


      </Container>
    )
  }

}
export default withStyles(styles) (CreateDoapProject);
