import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Button, Chip, Tooltip, Grid, Paper, Box } from "@material-ui/core";
import { IconButton, InputBase } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import GitHubIcon from '@material-ui/icons/GitHub';
import HomeIcon from '@material-ui/icons/Home';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import GavelIcon from '@material-ui/icons/Gavel';
import BugReportIcon from '@material-ui/icons/BugReport';
import SearchIcon from '@material-ui/icons/Search';
import SendIcon from '@material-ui/icons/Send';
import axios from 'axios';
import { Doughnut, Pie, Bar, HorizontalBar } from 'react-chartjs-2';
import 'chartjs-plugin-labels';

import {newEngine} from '@comunica/actor-init-sparql';
import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';
import {IQueryOptions, newEngineDynamicArged} from "@comunica/actor-init-sparql/lib/QueryDynamic";

// Import UM logo from assets
import iconImage from '../assets/icon.png';
import idsLogo from '../assets/ids_logo.png';
import githubData from '../assets/ids_github_data.json';
// import { ActionYoutubeSearchedFor } from 'material-ui/svg-icons';

// import { normalize, schema } from 'normalizr';
// import { ColorPropType } from 'react-native';

const useStyles = makeStyles(theme => ({
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '30%',
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    width: '50%',
    fontSize: '14px',
    flex: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  pos: {
    // marginBottom: 12,
  },
}))

export default function ProjectsDashboard() {
  const classes = useStyles();
  
  const [state, setState] = React.useState({
    projects_list: [],
    search: '',
    language_pie: {},
    category_pie: {}
  });

  const stateRef = React.useRef(state);

  // Avoid conflict when async calls
  // Can be done with another lib (cf. Turgay)
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // componentDidMount: Query SPARQL endpoint to get the projects infos
  React.useEffect(() => {
    console.log(githubData['recent_releases']);
    const endpointToQuery = 'https://graphdb.dumontierlab.com/repositories/ids-projects';
    console.log(endpointToQuery);

    // Query directly using Axios
    axios.get(endpointToQuery + `?query=` + encodeURIComponent(getProjectsQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;

        // Convert array to object: {0:"a", 1:"b", 2:"c"}
        const projects_converted_hash = { ...sparqlResultArray }
        let projects_hash: any = {}
        // Iterate over projects
        Object.keys(projects_converted_hash).forEach(function(project) {
          const projectName = projects_converted_hash[project]['project']['value']
          // Use the project URI as key in the hash
          if (!projects_hash[projectName]){
            projects_hash[projectName] = {programmingLanguage: [], maintainers: []}
          }
          // Iterate over project properties
          Object.keys(projects_converted_hash[project]).forEach(function(property: any) {
            const propertyHash = projects_converted_hash[project][property]
            if (propertyHash) {
              if (property == 'programmingLanguage') {
                // Exception for programming language which is a list
                projects_hash[projectName][property].push(propertyHash.value);
              } else if (property == 'maintainer_name') {
                projects_hash[projectName]['maintainers'].push({
                  name: projects_converted_hash[project]['maintainer_name']['value'],
                  email: projects_converted_hash[project]['maintainer_email']['value']
                });
              } else if (property == 'maintainer_name') {
                // Handled with maintainer_name
              } else {
                projects_hash[projectName][property] = propertyHash.value 
              }
            }
          })
        })
        // Convert back to array for filtering
        const project_final_array: any = Object.keys(projects_hash).map((key) => projects_hash[key]);
        // setState({...state, projects_list: project_final_array})
        updateState({projects_list: project_final_array})
      })
      .catch(error => {
        console.log(error)
      })

    // Get programming languages counts
    let language_pie = {
      labels: [],
      datasets: [{
        label: 'Number of projects using the programming languages',
        data: [],
        backgroundColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56', '#0277bd', '#ef6c00']
        // hoverBackgroundColor: ['#4caf50','#FF6384','#36A2EB','#FFCE56', '#0277bd', '#ef6c00']
      }]
    }
    axios.get(endpointToQuery + `?query=` + encodeURIComponent(countLanguagesQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        console.log(sparqlResultArray);

        // Typescript ridiculously requires to do a forEach to avoid its dumb warnings
        // Default Objects should accepts any fields by default.
        // for (let result of sparqlResultArray) {
        sparqlResultArray.map((result: any) =>  {
          language_pie.labels.push(result.programmingLanguage.value);
          language_pie.datasets[0].data.push(result.projectCount.value);
        });

        console.log('TODO: State of language_pie after ComponentDidMount (got labels)');
        console.log(language_pie);
        // setState({...state, language_pie: language_pie})
        updateState({language_pie: language_pie})
      })
      .catch(error => {
        console.log(error)
      })
      // TODO: do we need to add the stupid empty state array in the axios call too ? 
      // This shit: }, [])
      // Seems not, the issue is that some of the state variable are reset by React
      // to make sure the state is properly passed

      // Get project Categories count
      let category_pie = {
        labels: [],
        datasets: [{
          data: [],
          label: 'Number of projects per categories',
          backgroundColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56', '#0277bd', '#ef6c00'],
          // borderColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56'],
          // hoverBackgroundColor: ['#4caf50','#FF6384','#36A2EB', '#FFCE56'],
          // hoverBorderColor: ['#4caf50','#FF6384','#36A2EB', '#FFCE56']
        }]
      }
      axios.get(endpointToQuery + `?query=` + encodeURIComponent(countCategoryQuery))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        console.log(sparqlResultArray);

        // Typescript ridiculously requires to do a forEach to avoid its dumb warnings
        // Default Objects should accepts any fields by default.
        for (let result of sparqlResultArray) {
          category_pie.labels.push(result.category.value);
          category_pie.datasets[0].data.push(result.projectCount.value);
        }

        // setState({...state, category_pie: category_pie})
        updateState({category_pie: category_pie})
      })
      .catch(error => {
        console.log(error)
      })

    // TODO: this seems to interfer with the pies states
    // Query with the Comunica engine
    // Not working on SPARQL endpoint, only on the examples they provide
    // https://comunica.dev/docs/query/getting_started/query_app/
    // const comunicaEngine = newEngine();
    // comunicaEngine.query(`
    //   SELECT ?s ?o WHERE {
    //    ?s a ?o .
    //   } LIMIT 100`, {
    //   sources: ['https://dbpedia.org/sparql'],
    // }).then((res: any) => {
    //   console.log(res);
    //   res.bindingsStream.on('data', (binding: any) => {
    //     // console.log(binding.get('?s').value);
    //     // console.log(binding.get('?s').termType);
    //     // console.log(binding.get('?o').value);
    //   });
    // });

  }, [])
  // This useless array needs to be added for React to understand he needs to use the state inside...

  const searchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, search: event.target.value})
  }
  
  const filteredProjects = state.projects_list.filter( (project: any) =>{
    if (project.name) {
      return (project.name.toLowerCase().indexOf( state.search.toLowerCase() ) !== -1 
        || project.description.toLowerCase().indexOf( state.search.toLowerCase() ) !== -1
        || project.programmingLanguage.join(' ').toLowerCase().indexOf( state.search.toLowerCase() ) !== -1
      )
    }
  })
  console.log('Filtered project:')
  console.log(state.projects_list);

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center'}}>
        {/* <img src={iconImage} style={{height: '1em', width: '1em', marginRight: '10px'}} alt="Logo" /> */}
        <img src={idsLogo} style={{maxWidth: '200px'}} alt="IDS Logo" />
        {/* Institute of Data Science */}
      </Typography>
      {/* <div style={{textAlign: 'center'}}>
        <img src={iconImage} style={{height: '3em', width: '3em', marginRight: '10px'}} alt="Logo" />
      </div> */}

      <Typography variant="h6" style={{marginBottom: '1em'}}>
        🏷️ Recent releases
      </Typography>
      <Grid container spacing={2} style={{textAlign: 'center', marginBottom: '1em'}}>
        {/* Iterate over the 6 most recent releases from JSON file */}
        {githubData['recent_releases'].slice(0, 6).map(function(release: any, key: number){
          return <Grid item xs={4}>
            <Tooltip title={release.release_description}>
              <Card style={{height: '100%'}}>
                <CardContent style={{padding: '1em'}}>
                  <a href={release.release_url} className={classes.link}>
                    <Typography variant="h6" component="h2">
                      {release.repo}
                      <Chip label={release.release_tag} color='primary' style={{marginLeft: '0.5em', cursor: 'pointer'}}/>
                    </Typography>
                  </a>
                  <Typography className={classes.pos} color="textSecondary">
                    {release.release_name}
                  </Typography>
                  <Typography className={classes.cardSubtitle} color="textSecondary" gutterBottom>
                    📅 Released on the {release.published_at}<br/>
                    👤 By {release.release_author}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
            </Tooltip>
          </Grid>
        })}
      </Grid>

      <Typography variant="h6" style={{marginBottom: '1em', marginTop: '1em'}}>
        🗂️ Projects
      </Typography>
      {/* Pie charts https://github.com/jerairrest/react-chartjs-2 */}
      <Grid container spacing={3} style={{textAlign: 'center'}}>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h6">Categories</Typography>
            <Bar data={state.category_pie} options={pie_options}/>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h6">Programming languages</Typography>
            <HorizontalBar data={state.language_pie} options={pie_options}/>
            {/* <Pie data={state.language_pie} options={pie_options}/> */}
          </Paper>
        </Grid>
      </Grid>
    
      {/* Search box */}
      <Box display="flex" style={{marginTop: '20px' }}>
        <Paper component="form" className={classes.paperSearch}>
          <InputBase  // https://material-ui.com/api/input-base/
            className={classes.searchInput} inputProps={{ 'aria-label': 'search' }}
            placeholder={"Search projects"}
            onChange={searchChange}
          />
          <IconButton aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Typography style={{marginTop: '10px', marginLeft: '20px' }}>{filteredProjects.length} projects</Typography>
      </Box>
      
      {/* Iterate over projects */}
      {/* TODO: Changing key here at some pointbroke the search, 
          but fixed the pie chart which is completly independant!
          Fucking geniuses */}

      {/* {filteredProjects.map(function(project: any, key: number){ */}
      {/* return <Paper key={key} elevation={4} style={{padding: '15px', marginTop: '25px', marginBottom: '25px'}}> */}
      {filteredProjects.map(function(project: any, key: number){
        return <Paper key={key.toString()} elevation={4} style={{padding: '15px', marginTop: '25px', marginBottom: '25px'}}>
          <Typography variant="h5">
            {project.name}&nbsp;&nbsp;
            {project.programmingLanguage.map((language: string, key: number) => {
              return <Chip label={language} color='primary' style={{marginRight: '5px'}} key={key.toString()}/>
            })}
            {project.category && ( 
              <Chip label={project.category} color='secondary' style={{marginRight: '5px'}}/>
            )}
            {project.status && ( 
              <Chip label={project.status} color='default' style={{marginRight: '5px'}}/>
            )}
          </Typography>
          <Typography style={{marginBottom: '10px', marginTop: '5px'}}>
            {project.description}
          </Typography>
          {project.gitUrl && ( 
            <div>
              <a href={project.gitUrl} key={project.gitUrl} >
                <img src={'https://gh-card.dev/repos/' + project.gitUrl.replace('https://github.com/', '') + '.svg?fullname'} alt={project.gitUrl} key={'img' + project.gitUrl}/>
              </a>
            </div>
          )}
          {project.gitUrl && ( 
            <Tooltip title='Git repository'>
              <Button target="_blank"
              href={project.gitUrl}>
                <GitHubIcon />
              </Button>
            </Tooltip>
          )}
          {project.homepage && ( 
            <Tooltip title='Project homepage'>
              <Button target="_blank"
              href={project.homepage}>
                <HomeIcon />
              </Button>
            </Tooltip>
          )}
          {project.downloadpage && ( 
            <Tooltip title='Download page'>
              <Button target="_blank"
              href={project.downloadpage}>
                <CloudDownloadIcon />
              </Button>
            </Tooltip>
          )}
          {project.bugdatabase && ( 
            <Tooltip title='Issue tracker'>
              <Button target="_blank"
              href={project.bugdatabase}>
                <BugReportIcon />
              </Button>
            </Tooltip>
          )}
          {project.license && (
            <Tooltip title='License'>
              <Button target="_blank"
              href={project.license}>
                <GavelIcon />
              </Button>
            </Tooltip> 
          )}
          {project.service_endpoint && (
            <Tooltip title={'Service endpoint: ' + project.service_endpoint}>
              <Button target="_blank"
              href={project.service_endpoint}>
                <SendIcon />
              </Button>
            </Tooltip> 
          )}
          <Typography>
            Maintainers:&nbsp;
            {project.maintainers.map((maintainer: any, key: number) => {
              return <Tooltip title={maintainer.name + ' ' + maintainer.email}>
                <a href={maintainer.email} target='_blank'>
                  <Chip label={maintainer.name} color='default' 
                    style={{marginRight: '5px', cursor: 'pointer'}} key={key.toString()}/>
                </a>
                </Tooltip>
            })}
          </Typography>
        </Paper>
      })}
    </Container>
  )
}

const getProjectsQuery = `PREFIX doap: <http://usefulinc.com/ns/doap#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX bibo: <http://purl.org/ontology/bibo/>

select distinct * where { 
    ?project a doap:Project ;
        doap:name ?name ;
        doap:description ?description ;
        doap:programming-language ?programmingLanguage .
    OPTIONAL {
        ?project doap:repository [
            a doap:GitRepository ;
            doap:location ?gitUrl
          ] .
    }
    OPTIONAL {
        ?project doap:bug-database ?bugdatabase .
    }
    OPTIONAL {
        ?project doap:category ?category .
    }
    OPTIONAL {
        ?project bibo:status ?status .
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
    OPTIONAL {
        ?project doap:service-endpoint ?service_endpoint .
    }
    OPTIONAL {
      ?project doap:maintainer [
          a foaf:Person ;
          foaf:name ?maintainer_name ;
          foaf:mbox ?maintainer_email
        ] .
    }
}`

const countLanguagesQuery = `PREFIX doap: <http://usefulinc.com/ns/doap#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
select ?programmingLanguage (count(?project) as ?projectCount) where { 
    ?project a doap:Project ;
             doap:programming-language ?programmingLanguage .
} GROUP BY ?programmingLanguage`

const countCategoryQuery = `PREFIX doap: <http://usefulinc.com/ns/doap#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
select ?category (count(?project) as ?projectCount) where { 
    ?project a doap:Project ;
             doap:category ?category .
} GROUP BY ?category`

// const pie_data = {
//   labels: [
//     'Python',
//     'PHP',
//     'Java'
//   ],
//   datasets: [{
//     data: [4, 1, 2],
//     backgroundColor: ['#4caf50','#FF6384', '#36A2EB', '#FFCE56'],
//     hoverBackgroundColor: ['#4caf50','#FF6384','#36A2EB','#FFCE56']
//   }]
// };

const pie_options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      }
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true
      }
    }]
  },
  // legend: {
  //   display: false
  // },
  // maintainAspectRatio: false,
  plugins: {
    labels: {
      // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
      render: 'value',
      // fontSize: 12,

      // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
      // fontColor: '#fff',
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
