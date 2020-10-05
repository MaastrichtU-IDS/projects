FROM node:12-alpine

WORKDIR /webapp

# Only install NPM packages if package.json or yarn.lock change
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install

COPY . .

# Can also be prebuilt and served from /build folder
# RUN expo build:web
# RUN serve -s web-build

EXPOSE 19006

ENTRYPOINT [ "yarn", "prod" ]