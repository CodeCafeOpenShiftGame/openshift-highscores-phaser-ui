# OpenShift Example - Phaser Game

A Phaser 3 project with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds primed for OpenShift.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open webserver for running project locally |
| `npm run build` | Builds code as a bundle for production (minification, uglification, etc..) |


## Running Locally
Simple, that's just this:
> `npm install; npm start`

**(edit files all you want and hotdeploy will watch/update for you)**


## Deploying from Local Dir to OpenShift
When you run the `npm run build` command, your code will be built into a single bundle located at `dist/bundle.min.js` along with any other assets you project depends upon.

Containerizing and pushing this app into your OpenShift cluster is easy with the help of [NodeShift](https://nodeshift.dev/). It will create the OpenShift configuration needed, do a build inside the cluster, then deploy the app, and expose a port into it. Just run this command
  >`npx nodeshift --web-app --build.env OUTPUT_DIR=dist --expose`

**(edit files and rerun `npx nodeshift` and it will update OpenShift for you)**


## Deploying from GitHub to OpenShift
This is also pretty easy with the help of Source 2 Image (aka s2i). Runt the following (after replacing the github URL with yours):
  >`oc new-app nodeshift/ubi8-s2i-web-app:latest~https://github.com/dudash/openshiftexamples-phaser-game --build-env OUTPUT_DIR=dist`


## Credit & Thanks
Thanks to Richard Davey @ Phaser for the [tutorial here](http://phaser.io/tutorials/retro-highscore-table) that this was initially based upon.
