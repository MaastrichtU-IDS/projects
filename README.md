[![Get data from GitHub GraphQL API](https://github.com/MaastrichtU-IDS/projects/workflows/Get%20data%20from%20GitHub%20GraphQL%20API/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Get+data+from+GitHub+GraphQL+API%22) [![Deploy to GitHub Pages](https://github.com/MaastrichtU-IDS/projects/workflows/Deploy%20website%20to%20GitHub%20Pages/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+website+to+GitHub+Pages%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/projects/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22CodeQL+analysis%22)

**Access the website: https://maastrichtu-ids.github.io/projects**

Website for projects and datasets published at the [Institute of Data Science](http://maastrichtuniversity.nl/ids/) at Maastricht University.

This website allows to:

* Publish and browse IDS projects in a decentralized manner with `doap-project.ttl` files
* Publish datasets using schema.org metadata as JSON-LD in the `datasets` folder
* Show the latest releases at IDS.

The website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages.

Informations about the projects and releases are retrieved from their GitHub repository in the MaastrichtU-IDS organization using a GitHub Actions workflow, and stored as a RDF knowledge graph in a triplestore.

If you want to edit the code and propose improvements, start by cloning the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/projects
cd projects
```

## Add your project repository ✔️

We automatically index `doap-project.ttl` metadata files from repositories in the [MaastrichtU-IDS organization](https://github.com/MaastrichtU-IDS) on GitHub. You can easily

For projects in GitHub repositories that are not published under the [MaastrichtU-IDS organization](https://github.com/MaastrichtU-IDS) can be  easily added in the file [`etl/EXTERNAL_REPOSITORIES.txt`](https://github.com/MaastrichtU-IDS/projects/blob/main/etl/EXTERNAL_REPOSITORIES.txt)

The `doap-project.ttl` file at the root of your repository will be indexed the next time the workflow will run.

## Start the website 🏗️

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

### Run in production 🛩️

> This website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages at https://maastrichtu-ids.github.io/projects

You can build locally in `/web-build` folder and serve on [http://localhost:5000 :package:](http://localhost:5000)

```bash
yarn build
yarn serve
```

### Run with Docker 🐳

Requires [Docker installed](https://docs.docker.com/get-docker/)

You can build the website:

```bash
docker build -t projects-website .
```

And run it on http://localhost:5000

```bash
docker run -it projects-website
```

You can also run the website and a Virtuoso triplestore with the `docker-compose.yml` file from the root folder (check the [docker-compose.yml](/docker-compose.yml) file to see how we run the Docker image)

```bash
docker-compose up
```

## Get projects data from GitHub

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

## Generate HTML pages for datasets

At the end of the workflow `deploy-website.yml` (in `.github/workflows`) we run a python script from [kodymoodley/fair-metadata-html-page-generator](https://github.com/kodymoodley/fair-metadata-html-page-generator) to generate HTML pages from JSON-LD metadata describing `schema:Dataset` following the Schema.org vocabulary.

## Contribute 🤝

Contributions are welcome! See the [guidelines to contribute](/CONTRIBUTING.md).
