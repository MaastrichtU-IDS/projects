[![Get data from GitHub GraphQL API](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/Get%20data%20from%20GitHub%20GraphQL%20API/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22Get+data+from+GitHub+GraphQL+API%22) [![Build Docker Image](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/Build%20Docker%20Image/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22Build+Docker+Image%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22CodeQL+analysis%22) [![Deploy IDS projects website](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/Deploy%20IDS%20projects%20website/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22Deploy+IDS+projects+website%22)

Website for projects at the [Institute of Data Science](http://maastrichtuniversity.nl/ids/) at Maastricht University.

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

### Run in development :construction:

Clone the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/ids-projects-website
cd ids-projects-website
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

A Python script runs everyday at 03:00am and 13:00pm via GitHub Actions, and automatically updates the file [`assets/ids_github_data.json`](https://github.com/MaastrichtU-IDS/ids-projects-website/blob/main/assets/ids_github_data.json) on the `main` branch. This JSON file is then used to display informations on the IDS projects website, such as the latest releases of the MaastrichtU-IDS organization on GitHub.

> Checkout the [`get-github-data.yml` workflow file](https://github.com/MaastrichtU-IDS/ids-projects-website/blob/main/.github/workflows/get-github-data.yml) to see how to run the Python script to retrieve data from the GitHub GraphQL API.

You can find the scripts and requirements in the [`get_github_data`](https://github.com/MaastrichtU-IDS/ids-projects-website/tree/main/get_github_data) folder.

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