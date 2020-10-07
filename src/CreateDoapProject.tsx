import React, { Component } from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { WithStyles, Typography, Container, Paper, Button } from "@material-ui/core";
import { FormControl, TextField, Input, InputLabel, FormHelperText, Select } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const styles = (theme: Theme) => createStyles({
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

interface Props extends WithStyles<typeof styles> {
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class CreateDoapProject extends Component<Props> {

  state = {open: false, 
    dialogOpen: false,
    license_autocomplete: ''
  }
  form_category_dropdown = React.createRef(); 

  // constructor(props) {
  //   super(props);
  //   this.form_category_dropdown = React.createRef(); 
  // }
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
    this.setState({ open: true });
  }
  // Close Snackbar
  handleClose = () => {
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
  }

  render () {
    const { classes } = this.props;
    return(
      <Container className='mainContainer'>
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
                // inputRef={this.formSearchQuery}
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
                variant="outlined"
                multiline={true}
                size='small'
                InputProps={{
                  className: classes.normalFont
                }}
                InputLabelProps={{
                  className: classes.normalFont
                }}
                // inputRef={this.formSearchQuery}
                // defaultValue={triplestore.search_query}
              />
            </Paper>

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
