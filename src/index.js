import Phaser from "phaser";
const path = require('path');

import {InputPanel} from "./inputPanelScene"
import {Starfield} from "./starfieldScene"
import {Highscore} from "./highscoreScene"

// ----------------------------------------------------------------------------
// THE GAME
// ----------------------------------------------------------------------------
console.warn("debug input = " + process.env.DEBUG_INPUT);
var defaultScenes = [Starfield, Highscore];
if (process.env.DEBUG_INPUT === 'true') {
  defaultScenes = [Starfield, Highscore, InputPanel];
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-game',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  backgroundColor: '#290d0d',
  scene: defaultScenes
};
let game = new Phaser.Game(config);
