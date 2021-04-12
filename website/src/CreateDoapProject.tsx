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
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    // color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'none',
    },
  },
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
    project_license: '',
    language_autocomplete: [],
    category_dropdown: '',
    project_git_repository: '',
    project_name: '',
    project_description: '',
    project_status: '',
    project_homepage: '',
    project_issues: '',
    project_mailinglist: '',
    project_downloadpage: '',
    project_wiki: '',
    project_service_endpoint: '',
    project_contributor_name: '',
    project_contributor_email: ''
  });
  // const form_category_dropdown = React.createRef(); 
  
  const handleSubmit  = (event: React.FormEvent) => {
    event.preventDefault();
    // Generate the project URI based on its name:
    const project_uri = `https://w3id.org/um/ids/projects#` + encodeURI(state.project_name.toLowerCase().trim().replaceAll(' ', '-'))
    let homepage_triple = ``
    if (state.project_homepage) {
      homepage_triple = `doap:homepage <${state.project_homepage}> ;`
    }
    let wiki_triple = ``
    if (state.project_wiki) {
      wiki_triple = `doap:wiki <${state.project_wiki}> ;`
    }
    let download_page_triple = ``
    if (state.project_downloadpage) {
      download_page_triple = `doap:download-page <${state.project_downloadpage}> ;`
    }
    let service_endpoint_triple = ``
    if (state.project_service_endpoint) {
      service_endpoint_triple = `doap:service-endpoint <${state.project_service_endpoint}> ;`
    }
    let mailinglist_triple = ``
    if (state.project_mailinglist) {
      mailinglist_triple = `doap:mailing-list <${state.project_mailinglist}> ;`
    }

    let doap_content = `@prefix doap: <http://usefulinc.com/ns/doap#> .
@prefix asf: <http://projects.apache.org/ns/asfext#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix bibo: <http://purl.org/ontology/bibo/> .

<${project_uri}>
  a doap:Project ;
  doap:name "` + state.project_name + `" ;
  doap:description '''` + state.project_description + `''' ;
  bibo:status "` + state.project_status + `" ;

  doap:programming-language "` + state.language_autocomplete.join('", "') + `" ;
  doap:license <` + state.project_license + `> ;
  doap:bug-database <` + state.project_issues + `> ;
  ${homepage_triple}
  ${wiki_triple}
  ${download_page_triple}
  ${service_endpoint_triple}
  ${mailinglist_triple}
  doap:category "` + state.category_dropdown + `" ;
  doap:repository [
    a doap:GitRepository ;
    doap:location <` + state.project_git_repository + `> ;
  ] ;
  doap:maintainer [
    a foaf:Person ;
    foaf:name "` + state.project_contributor_name + `" ;
    foaf:mbox <mailto:` + state.project_contributor_email + `>
  ] .`;
    
    // Trigger file download
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/turtle;charset=utf-8,' + encodeURIComponent(doap_content));
    element.setAttribute('download', 'doap-project.ttl');
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    setState({...state, [event.target.id]: event.target.value})
  }

  const handleCategoryDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, category_dropdown: event.target.value})
  }
  const handleStatusDropdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, project_status: event.target.value})
  }

  return(
    <Container className='mainContainer'>
      {/* <Typography variant="h4" style={{textAlign: 'center', marginBottom: '20px'}}>
        📝 Create a DOAP description for your project
      </Typography> */}

      <Typography variant="body1" style={{textAlign: 'left', marginLeft: '30px'}}>
        You can find more details about why and how we use DOAP projects descriptions at IDS <a href="https://maastrichtu-ids.github.io/best-practices/docs/create-doap" className={classes.link}>here</a>. 
        Follow those instructions to register a project as an IDS project:
        <br/>1. Fill the form
        <br/>2. Download the description file <code>doap-project.ttl</code> by clicking on the green button at the bottom of the page after filling the form.
        <br/>3. Add the file to your project GitHub repository.
      </Typography>
      <Typography variant="body1" style={{textAlign: 'left', marginLeft: '30px', marginBottom: '20px'}}>
        <br/>Your project will be automatically be added to the website tomorrow 📊
        <br/>N.B. your project needs to be in <a href="https://github.com/MaastrichtU-IDS" className={classes.link}>MaastrichtU-IDS organization</a> to be retrieved automatically, <a href="https://github.com/MaastrichtU-IDS/projects/issues" className={classes.link}>create an issue</a> if it is hosted under a different name, we will add it to the list of external repositories.
      </Typography>

      
      <form onSubmit={handleSubmit}>
        <FormControl className={classes.settingsForm}>
          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
              📋 Project informations
            </Typography>
            <FormHelperText id="helper-programming-language">Required fields are marked with an <b>*</b></FormHelperText>

            <FormControl size='small' variant="outlined" className={classes.fullWidth}>
              <InputLabel id="form-graph-overview-label">
                🗂️ Type of project *
              </InputLabel>
              <Select
                id="category_dropdown"
                // value={state.category_dropdown}
                onChange={handleCategoryDropdown}
                label="🗂️ Type of project *"
                autoWidth
              >
                <MenuItem value="Research">🧪 Research</MenuItem>
                <MenuItem value="Development">👨‍💻 Development</MenuItem>
                <MenuItem value="Education">🎓 Education</MenuItem>
              </Select>
            </FormControl>
            <FormHelperText id="helper-graphs-overview">Is your project for <b>research</b>, <b>education</b>, or <b>development</b> of a tool?</FormHelperText>

            <FormControl size='small' variant="outlined" className={classes.fullWidth}>
              <InputLabel id="form-graph-overview-label">
                ✔️ Status of the project *
              </InputLabel>
              <Select
                id="project_status"
                // value={state.category_dropdown}
                onChange={handleStatusDropdown}
                label="✔️ Status of the project *"
                autoWidth
              >
                {/* <MenuItem value="Work in Progress">🚧 Work in Progress</MenuItem> */}
                <MenuItem value="Active">🚀 Active</MenuItem>
                <MenuItem value="Inactive">🗑️ Inactive</MenuItem>
              </Select>
            </FormControl>
            <FormHelperText id="helper-status">Is your project <b>actively used</b> or <b>inactive</b> of a tool?</FormHelperText>

            <TextField
              id="project_name"
              label="Project name"
              placeholder="Project name"
              required
              className={classes.fullWidth}
              onChange={handleChange}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_description"
              label="Project description"
              placeholder="Project description"
              required
              onChange={handleChange}
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
            />

            <TextField
              id="project_license"
              label="⚖️ License URL"
              placeholder="⚖️ License URL"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <FormHelperText id="helper-sparql-endpoint">Provide the URL to the LICENSE file</FormHelperText>

            <Autocomplete
              multiple
              id="language_autocomplete"
              options={['Python', 'R', 'Java', 'JavaScript', 'TypeScript', 'React', 'Angular', 'VueJS', 'PHP', 'Drupal', 'Symfony', 'Ruby', 'Perl', 'Julia', 'Kubernetes', 'Scala', 'Go', 'Haskell', 'C', 'C#', 'C++', 'Objective-C', 'Cocoa', 'ActionScript', 'D', 'Delphi', 'Erlang', 'OCaml', 'Smalltalk', 'SVG', 'Tcl']}
              // onChange={handleAutocompleteSparqlEndpoint}
              onChange={(event, newInputValue: any) => {
                setState({...state, 'language_autocomplete': newInputValue})
              }}
              // getOptionLabel={option => option.title}
              // defaultValue={[top100Films[13]]}
              renderInput={params => (
                <TextField
                  {...params}
                  variant="outlined"
                  size='small'
                  label="☕ Programming languages *"
                  placeholder="☕ Programming languages *"
                />
              )}
            />
            <FormHelperText id="helper-programming-language">Provide the different programming languages used in the project</FormHelperText>

          </Paper>

          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
              🔗 Project links
            </Typography>
            <FormHelperText>
              Links to the resources of this project. 
            </FormHelperText>
            <TextField
              id="project_git_repository"
              label="💾 Git repository URL (GitHub/GitLab)"
              placeholder="💾 Git repository URL (GitHub/GitLab)"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_issues"
              label="🚧 Issue tracker URL"
              placeholder="🚧 Issue tracker URL"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_homepage"
              label="🏠 Project homepage URL"
              placeholder="🏠 Project homepage URL"
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_wiki"
              label="📖 Project wiki"
              placeholder="📖 Project wiki"
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_downloadpage"
              label="📥 Project download page"
              placeholder="📥 Project download page"
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_service_endpoint"
              label="🛩️ Service endpoint URL"
              placeholder="🛩️ Service endpoint URL"
              onChange={handleChange}
              className={classes.fullWidth}
              variant="outlined"
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_mailinglist"
              label="💬 Mailing list or community chat URL"
              placeholder="💬 Mailing list or community chat URL"
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />

          </Paper>
          <Paper elevation={2} className={classes.paperPadding}>
            <Typography variant="h5" className={classes.paperTitle}>
             👤 Contact details
            </Typography>
            <FormHelperText>
              Informations about the developers and responsibles of this project. 
            </FormHelperText>
            <TextField
              id="project_contributor_name"
              label="🏷️ Contributor name"
              placeholder="🏷️ Contributor name"
              required
              className={classes.fullWidth}
              onChange={handleChange}
              // defaultValue={triplestore.search_query}
              variant="outlined"
              // inputRef={this.formSearchQuery}
              size='small'
              InputProps={{
                className: classes.normalFont
              }}
              InputLabelProps={{
                className: classes.normalFont
              }}
            />
            <TextField
              id="project_contributor_email"
              label="📬 Contributor email"
              placeholder="📬 Contributor email"
              required
              className={classes.fullWidth}
              variant="outlined"
              onChange={handleChange}
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

          <Typography variant="body1" style={{textAlign: 'center', marginBottom: '20px'}}>
            Feel free to manually add more <a href="https://vemonet.github.io/doap/class-doapproject.html" className={classes.link} target="_blank">DOAP project properties</a> or contributors after downloading the turtle file.
          </Typography>

          <div style={{width: '100%', textAlign: 'center'}}>
            <Button type="submit" 
              // style={{width: '100%'}}
              variant="contained" 
              className={classes.saveButton} 
              startIcon={<GetAppIcon />}
              color="secondary" >
                Download DOAP description file
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