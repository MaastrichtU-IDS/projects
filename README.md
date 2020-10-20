[![Build Docker Image](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/Build%20Docker%20Image/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22Build+Docker+Image%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/ids-projects-website/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/ids-projects-website/actions?query=workflow%3A%22CodeQL+analysis%22)

Website for projects at the [Institute of Data Science](http://maastrichtuniversity.nl/ids/) at Maastricht University.

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

### Run in development ⚙️

Clone the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/ids-projects-website
cd ids-projects-website
```

Install dependencies 📥

```bash
yarn
```

Run at http://localhost:19006

```bash
yarn web
```

> The website should reload automatically at each changes to the code 🔃

Upgrade the packages:

```bash
yarn upgrade
```

### Run in production 🚀

You can build locally in `/web-build` folder and serve at http://localhost:5000 📦

```bash
yarn build
yarn serve
```

Or run directly using [Docker 🐳](https://docs.docker.com/get-docker/) (requires [docker installed](https://docs.docker.com/get-docker/))

```bash
docker-compose up
```

> Checkout the [docker-compose.yml](/docker-compose.yml) file to see how the Docker container is run.

### Deploy to Netlify

When you visit pages other than the root (ex: `coolproject.netlify.com/about`), Netlify won't know how to redirect the route. To fix it, create a `web/_redirects` file to redirect all routes to the `index.html` with this content:

```
/*    /index.html   200
```

> Creating files in the `web/` folder will copy them to the build folder (`web-build/`). Think of this like `public/` in React projects.