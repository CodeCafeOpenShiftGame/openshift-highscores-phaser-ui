# Phaser High Scores UI

A Phaser 3 project with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds primed for OpenShift.

![Screenshot](./.screens/redscores.gif)

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open webserver for running project locally |
| `npm run build` | Builds code as a bundle for production (minification, uglification, etc..) |


## Running this
### Running Locally
Simple, that's just this:
> `npm install; npm start`

>*(edit files all you want and hotdeploy will watch/update for you)*
>
>*set the env var `export DEBUG_INPUT=true` to see the input panel and allow setting high scores*
>*set the env var `export API_SERVER_URL=localhost:5000` to hook up to an API server (if you're running one)*

### Deploying from Local Dir to OpenShift
When you run the `npm run build` command, your code will be built into a single bundle located at `dist/bundle.min.js` along with any other assets you project depends upon.

Containerizing and pushing this app into your OpenShift cluster is easy with the help of [NodeShift](https://nodeshift.dev/). It will create the OpenShift configuration needed, do a build inside the cluster, then deploy the app, and expose a URL route into it. Just run this command
  >`npx nodeshift --web-app --build.env OUTPUT_DIR=dist --expose`

>*(edit files and rerun `npx nodeshift` and it will update OpenShift for you)*
>
>*add the env config `--build.env DEBUG_INPUT=true` to true to see the input panel and allow setting highscores*
>*set the env var `--build.env API_SERVER_URL=ws://route_to_api_service:8080` to hook up to an API server*

### Deploying from GitHub to OpenShift
This is also pretty easy with the help of Source 2 Image (aka s2i). Run the following (after replacing the github URL with yours):
  >`oc new-app nodeshift/ubi8-s2i-web-app:latest~https://github.com/dudash/openshift-highscores-phaser-ui --build-env OUTPUT_DIR=dist`

>*add the env config `--build-env DEBUG_INPUT=true` to true to see the input panel and allow setting highscores*

## Credit & Thanks
Thanks to Richard Davey @ Phaser for the [tutorials here](https://phaser.io/learn/community-tutorials) that this was initially based upon.
