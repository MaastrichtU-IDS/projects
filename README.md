[![Get data from GitHub GraphQL API](https://github.com/MaastrichtU-IDS/projects/workflows/Get%20data%20from%20GitHub%20GraphQL%20API/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Get+data+from+GitHub+GraphQL+API%22) [![Build Docker Image](https://github.com/MaastrichtU-IDS/projects/workflows/Build%20Docker%20Image/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Build+Docker+Image%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/projects/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22CodeQL+analysis%22) [![Deploy to GitHub Pages](https://github.com/MaastrichtU-IDS/projects/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/MaastrichtU-IDS/projects/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22)

Website for projects at the [Institute of Data Science](http://maastrichtuniversity.nl/ids/) at Maastricht University.

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

### Run in development :construction:

Clone the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/projects
cd projects
```

Install dependencies :inbox_tray:

```bash
yarn
```

Run on http://localhost:19006

```bash
yarn web
```

> The website should reload automatically at each changes to the code :arrows_clockwise:

Upgrade the packages in `yarn.lock`

```bash
yarn upgrade
```

### Run in production :rocket:

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

## Get data from GitHub GraphQL API

A workflow runs everyday via GitHub Actions at 03:00am and 13:00pm to:

* Update the file [`assets/ids_github_data.json`](https://github.com/MaastrichtU-IDS/projects/blob/main/assets/ids_github_data.json) on the `main` branch using a Python script. This JSON file is then used to display informations on the IDS projects website, such as the latest releases of the MaastrichtU-IDS organization on GitHub.
* Retrieve DOAP files (`doap-project.ttl` in RDF turtle) from MaastrichtU-IDS GitHub repositories using a Python script, then load their RDF data to the SPARQL endpoint https://graphdb.dumontierlab.com/repositories/ids-projects/statements in the graph https://w3id.org/umids/graph/projects

> Checkout the [`get-github-data.yml` workflow file](https://github.com/MaastrichtU-IDS/projects/blob/main/.github/workflows/get-github-data.yml) to see how to run the Python script to retrieve data from the GitHub GraphQL API.

You can find the scripts and requirements in the [`get_github_data`](https://github.com/MaastrichtU-IDS/projects/tree/main/get_github_data) folder.

Use this command to locally define the `GITHUB_APIKEY` environment variable:

```bash
export GITHUB_APIKEY=MYKEY000
```

> You can create a new GitHub API key (aka. personal access token) at https://github.com/settings/tokens

Install requirements:

```bash
pip3 install -r get_github_data/requirements.txt
```

Run script:

```bash
python3 get_github_data/query_graphql.py
```

> Try out the GitHub GraphQL API [here](https://developer.github.com/v4/explorer/).

## Contribute

Contributions are welcome! See the [guidelines to contribute 👨‍💻](/CONTRIBUTING.md).

### Deploy to Netlify

When you visit pages other than the root (ex: `coolproject.netlify.com/about`), Netlify won't know how to redirect the route. To fix it, create a `web/_redirects` file to redirect all routes to the `index.html` with this content:

```
/*    /index.html   200
```

> Creating files in the `web/` folder will copy them to the build folder (`web-build/`). Think of this like `public/` in React projects.