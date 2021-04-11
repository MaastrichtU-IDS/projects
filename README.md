[![Get data from GitHub GraphQL API](https://github.com/MaastrichtU-IDS/projects/workflows/Get%20data%20from%20GitHub%20GraphQL%20API/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Get+data+from+GitHub+GraphQL+API%22) [![Deploy to GitHub Pages](https://github.com/MaastrichtU-IDS/projects/workflows/Deploy%20website%20to%20GitHub%20Pages/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+website+to+GitHub+Pages%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/projects/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22CodeQL+analysis%22)

Website for projects at the [Institute of Data Science](http://maastrichtuniversity.nl/ids/) at Maastricht University.

This website allow to browse IDS projects and show the latest releases at IDS. Informations about the projects and releases are retrieved from their GitHub repository in the MaastrichtU-IDS organization using a GitHub Actions workflow.

The website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages at https://maastrichtu-ids.github.io/projects

If you want to edit the code and propose improvements, start by cloning the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/projects
cd projects
```

## Add an external GitHub repository

GitHub repositories not published under the MaastrichtU-IDS organization can be added in the [`etl/EXTERNAL_REPOSITORIES.txt`](https://github.com/MaastrichtU-IDS/projects/blob/main/etl/EXTERNAL_REPOSITORIES.txt)

Your project will be indexed the next time the workflow will run.

## Start the website

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

Go to the `website` folder:

```bash
cd website
```

### Run in development :construction:

Install dependencies :inbox_tray:

```bash
yarn
```

Web app will run on http://localhost:19006

```bash
yarn dev
```

> The website should reload automatically at each changes to the code :arrows_clockwise:

Upgrade the packages versions in `yarn.lock`

```bash
yarn upgrade
```

### Run in production :rocket:

> This website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages at https://maastrichtu-ids.github.io/projects

You can build locally in `/web-build` folder and serve on [http://localhost:5000 :package:](http://localhost:5000)

```bash
yarn build
yarn serve
```

Or run directly using [Docker :whale:](https://docs.docker.com/get-docker/) (requires [docker installed](https://docs.docker.com/get-docker/))

```bash
docker-compose up
```

> Checkout the [docker-compose.yml](/docker-compose.yml) file to see how we run the Docker image.

## Get Projects data from GitHub API

A workflow runs everyday via GitHub Actions at 03:00am and 13:00pm to get Projects metadata from GitHub GraphQL API:

* Update the file [`assets/ids_github_data.json`](https://github.com/MaastrichtU-IDS/projects/blob/main/assets/ids_github_data.json) on the `main` branch using a Python script. This JSON file is then used to display informations on the IDS projects website, such as the latest releases of the MaastrichtU-IDS organization on GitHub.
* Retrieve DOAP files (`doap-project.ttl` in RDF turtle) from MaastrichtU-IDS GitHub repositories using a Python script, then load their RDF data to the SPARQL endpoint https://graphdb.dumontierlab.com/repositories/ids-projects/statements in the graph https://w3id.org/um/ids/projects/graph

> Checkout the [`get-projects-data.yml` workflow file](https://github.com/MaastrichtU-IDS/projects/blob/main/.github/workflows/get-projects-data.yml) to see how to run the Python script to retrieve data from the GitHub GraphQL API.

You can find the scripts and requirements in the [`datasets/doap-github`](https://github.com/MaastrichtU-IDS/projects/tree/main/datasets/doap-github) folder.

Use this command to locally define the `GITHUB_APIKEY` environment variable:

```bash
export GITHUB_APIKEY=MYKEY000
```

> You can create a new GitHub API key (aka. personal access token) at https://github.com/settings/tokens

Install requirements:

```bash
pip3 install -r etl/requirements.txt
```

Run script to retrieve IDS projects DOAP metadata using GitHub GraphQL API:

```bash
python3 etl/get_doap_projects.py
```

> Try out the GitHub GraphQL API [here](https://developer.github.com/v4/explorer/).

## Generate HTML pages for schema:Dataset

At the end of the workflow `deploy-website.yml` (in `.github/workflows`) we run a python script from [kodymoodley/fair-metadata-html-page-generator](https://github.com/kodymoodley/fair-metadata-html-page-generator) to generate HTML pages from JSON-LD metadata describing datasets following the Schema.org vocabulary.

## Contribute

Contributions are welcome! See the [guidelines to contribute 👨‍💻](/CONTRIBUTING.md).
