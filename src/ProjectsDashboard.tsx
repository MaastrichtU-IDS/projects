import React, { Component } from 'react';
import { withStyles, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { WithStyles, Typography, Container, Button, Chip, Tooltip, Grid, Paper } from "@material-ui/core";
import { IconButton, InputBase } from "@material-ui/core";
import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import GavelIcon from '@material-ui/icons/Gavel';
import BugReportIcon from '@material-ui/icons/BugReport';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { Doughnut, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import iconImage from '../assets/icon.png';

import {newEngine} from '@comunica/actor-init-sparql';
import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';
import {IQueryOptions, newEngineDynamicArged} from "@comunica/actor-init-sparql/lib/QueryDynamic";


// const styles = (theme: Theme) => createStyles({
const useStyles = makeStyles(theme => ({
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    // 50% of top appbar
    width: '30%',
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    // Hardcoded width for search input
    width: '50%',
    fontSize: '14px',
    flex: 1,
  },
}))

// interface Props extends WithStyles<typeof styles> {
// }
// class ProjectsDashboard extends Component<Props> {

export default function ProjectsDashboard() {
  const classes = useStyles();
  // Set state in functional style:
  const [state, setState] = React.useState({projects_list: [], search: ''});

  // state = {
  //   projects_list: [],
  //   search: ''
  // }

  // Query SPARQL endpoint to get the projects infos
  React.useEffect(() => {
  // componentDidMount() {
    const endpointToQuery = 'https://graphdb.dumontierlab.com/repositories/ids-projects';
    console.log(endpointToQuery);
    // Query directly using Axios
    axios.get(endpointToQuery + `?query=` + encodeURIComponent(getProjectsQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        // setState({ projects_list: sparqlResultArray});
        setState({...state, projects_list: sparqlResultArray})
        // sparqlResultArray.forEach((sparqlResultRow) => {
        //   console.log(sparqlResultRow.name.value)
        //   searchResults.push({
        //     foundUri: sparqlResultRow.foundUri.value , 
        //     foundLabel: sparqlResultRow.foundLabel.value
        //   })
        // })
      })
      .catch(error => {
        console.log(error)
      })

    // Query with the Comunica engine
    // https://comunica.dev/docs/query/getting_started/query_app/
    const comunicaEngine = newEngine();
    comunicaEngine.query(`
      SELECT ?s ?o WHERE {
        ?s a ?o .
      } LIMIT 100`, {
      sources: ['https://dbpedia.org/sparql'],
    }).then(res => {
      console.log(res);
      res.bindingsStream.on('data', (binding) => {
        console.log(binding.get('?s').value);
        console.log(binding.get('?s').termType);
        console.log(binding.get('?o').value);
      });
    });

    // TODO: error Could not retrieve URL. 400 unknown error
    // comunicaEngine.query(getProjectsQuery, {
    //   sources: ['https://graphdb.dumontierlab.com/repositories/ids-projects'],
    // }).then(res => {
    //   console.log(res);
    //   res.bindingsStream.on('data', (binding) => {
    //     console.log(binding.get('?name').value);
    //   });
    // });
  // })
  }, []) 

  const searchChange = (event: Event) => {
    // this.setState({search: event.target.value});
    console.log(state.search);
    setState({...state, search: event.target.value})
  }

  const filteredProjects = state.projects_list.filter( project =>{
      return (project.name.value.toLowerCase().indexOf( state.search.toLowerCase() ) !== -1 
        || project.description.value.toLowerCase().indexOf( state.search.toLowerCase() ) !== -1
        || project.programmingLanguage.value.toLowerCase().indexOf( state.search.toLowerCase() ) !== -1
      )
  })

  // render () {
  //   const { classes } = this.props;
  //   const {search, projects_list} = this.state;

  //   // Search in name, description and programming language
  //   const filteredProjects = projects_list.filter( project =>{
  //       return (project.name.value.toLowerCase().indexOf( search.toLowerCase() ) !== -1 
  //         || project.description.value.toLowerCase().indexOf( search.toLowerCase() ) !== -1
  //         || project.programmingLanguage.value.toLowerCase().indexOf( search.toLowerCase() ) !== -1
  //       )
  //   })

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: '30px'}}>
        <img src={iconImage} style={{height: '1em', width: '1em', marginRight: '10px'}} alt="Logo" />
        Institute of Data Science projects 🗂️
      </Typography>

      {/* Pie charts */}
      <Grid container spacing={3} style={{textAlign: 'center'}}>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h6">Categories</Typography>
            <Doughnut data={pie_data} options={pie_options}/>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h6">Programming languages</Typography>
            <Pie data={pie_data} options={pie_options}/>
          </Paper>
        </Grid>
      </Grid>
    
      {/* Search box */}
      <Paper component="form" className={classes.paperSearch}
        style={{marginTop: '20px' }}
      >
        <InputBase  // https://material-ui.com/api/input-base/
          className={classes.searchInput} inputProps={{ 'aria-label': 'search' }}
          placeholder={"Search projects"}
          onChange={searchChange}
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
      
      {/* Iterate over projects */}
      {filteredProjects.map(function(project, key){
        return <Paper key={key} elevation={4} style={{padding: '15px', marginTop: '25px', marginBottom: '25px'}}>
          <Typography variant="h5">
            {project.name.value}&nbsp;&nbsp;
            <Chip label={project.programmingLanguage.value} color='primary' />
          </Typography>
          <Typography style={{marginBottom: '10px', marginTop: '5px'}}>
            {project.description.value}
          </Typography>
          {project.category && ( 
            <Typography style={{marginBottom: '10px'}}>
              Category: {project.category.value}
            </Typography>
          )}
          {project.gitUrl && ( 
            <Tooltip title='Git repository'>
              <Button target="_blank"
              href={project.gitUrl.value}>
                <GitHubIcon />
              </Button>
            </Tooltip>
          )}
          {project.homepage && ( 
            <Tooltip title='Project homepage'>
              <Button target="_blank"
              href={project.homepage.value}>
                <HomeIcon />
              </Button>
            </Tooltip>
          )}
          {project.downloadpage && ( 
            <Tooltip title='Download page'>
              <Button target="_blank"
              href={project.downloadpage.value}>
                <CloudDownloadIcon />
              </Button>
            </Tooltip>
          )}
          {project.bugdatabase && ( 
            <Tooltip title='Issue tracker'>
              <Button target="_blank"
              href={project.bugdatabase.value}>
                <BugReportIcon />
              </Button>
            </Tooltip>
          )}
          {project.license && (
            <Tooltip title='License'>
              <Button target="_blank"
              href={project.license.value}>
                <GavelIcon />
              </Button>
            </Tooltip> 
          )}
        </Paper>
      })}
    </Container>
  )
}

// }
// export default withStyles(styles) (ProjectsDashboard);

const getProjectsQuery = `PREFIX doap: <http://usefulinc.com/ns/doap#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    select * where { 
        ?project a doap:Project ;
           doap:name ?name ;
           doap:description ?description ;
           doap:programming-language ?programmingLanguage .
        OPTIONAL {
            ?project doap:repository [
                a doap:GitRepository ;
                doap:browse ?gitUrl
              ] .
        }
        OPTIONAL {
            ?project doap:bug-database ?bugdatabase .
        }
        OPTIONAL {
            ?project doap:category ?category .
        }
        OPTIONAL {
            ?project doap:created ?created .
        }
        OPTIONAL {
            ?project doap:download-page ?downloadpage .
        }
        OPTIONAL {
            ?project doap:homepage ?homepage .
        }
        OPTIONAL {
            ?project doap:license ?license .
        }
        OPTIONAL {
            ?project doap:shortdesc ?shortdesc .
        }
    }`

const pie_data = {
  labels: [
    'Python',
    'PHP',
    'Java'
  ],
  datasets: [{
    data: [4, 1, 2],
    backgroundColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56'],
    hoverBackgroundColor: ['#4caf50','#FF6384','#36A2EB','#FFCE56']
  }]
};

const pie_options = {
  legend: {
    display: false
  },
  plugins: {
    labels: {
      // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
      render: 'label',
      // fontSize: 12,

      // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
      fontColor: '#fff',

      // // draw text shadows under labels, default is false
      // textShadow: true,
      // text shadow intensity, default is 6
      // shadowBlur: 10,
      // // text shadow X offset, default is 3
      // shadowOffsetX: -5,
      // // text shadow Y offset, default is 3
      // shadowOffsetY: 5,
      // // text shadow color, default is 'rgba(0,0,0,0.3)'
      // shadowColor: 'rgba(255,0,0,0.75)',
      // position to draw label, available value is 'default', 'border' and 'outside'
      // bar chart ignores this
      // default is 'default'
      // position: 'default',

      // set images when `render` is 'image'
      // images: [
      //   {
      //     src: 'image.png',
      //     width: 16,
      //     height: 16
      //   }
      // ]
    }
  }
}
