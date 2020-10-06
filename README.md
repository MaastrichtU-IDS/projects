Website for projects at the **Institute of Data Science** at Maastricht University.

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

### Run in production 🚀

You can build locally in `/web-build` folder and serve at http://localhost:5000 📦

```bash
yarn build
yarn serve
```

Or run directly using Docker 🐳

```bash
docker-compose up
```

### Deploy to Netlify

When you visit pages other than the root (ex: `coolproject.netlify.com/about`), Netlify won't know how to redirect the route. To fix it, create a `web/_redirects` file to redirect all routes to the `index.html` with this content:

```
/*    /index.html   200
```

> Creating files in the `web/` folder will copy them to the build folder (`web-build/`). Think of this like `public/` in React projects.