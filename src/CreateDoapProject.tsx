import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Paper, Button } from "@material-ui/core";
import { FormControl, TextField, Input, InputLabel, FormHelperText, Select } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const useStyles = makeStyles(theme => ({
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
}))


export default function CreateDoapProject() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    dialogOpen: false,
    license_autocomplete: '',
    category_dropdown: ''
  });
  // const form_category_dropdown = React.createRef(); 
  

  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    let doap_content = `my DOAP project RDF 
category: ` + state.category_dropdown + `
license: ` + state.license_autocomplete;
    
    // Trigger file download
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(doap_content));
    element.setAttribute('download', '.doap-project.ttl');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setState({...state, open: true})
  }
  // Close Snackbar
  const handleClose = () => {
    setState({...state, open: false})
  };

  const handleLicenseAutocomplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      setState({...state, license_autocomplete: event.target.value})
    } else {
      setState({...state, license_autocomplete: event.target.innerText})
    }
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, category_dropdown: event.target.value})
  }

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
        Create a DOAP description for your project 📝
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <FormControl className={classes.settingsForm}>
          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
              Project informations
            </Typography>
            <Autocomplete
              value={state.license_autocomplete} 
              onChange={handleLicenseAutocomplete}
              options={['MIT license', 'Apache license']}
              freeSolo={true}
              includeInputInList={true}
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
                value={state.category_dropdown}
                onChange={handleCategoryChange}
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

          <Snackbar open={state.open} onClose={handleClose} autoHideDuration={3000}>
            <MuiAlert elevation={6} variant="filled" severity="success">
              Thanks!
            </MuiAlert>
          </Snackbar>
        </FormControl>
      </form>

    </Container>
  )
}