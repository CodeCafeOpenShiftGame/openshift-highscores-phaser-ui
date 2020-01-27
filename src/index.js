import Phaser from "phaser";
import ImgStar from "./assets/tron.png";
import ImgRub from "./assets/rub.png";
import ImgEnd from "./assets/end.png";
import ImgBlock from "./assets/block.png";
import FontArcade from "./assets/fonts/bitmap/arcade.png";
import FontArcadeXml from "./assets/fonts/bitmap/arcade.xml";
import ImgOctocat from "./assets/octocat.png";
import ImgRedHatDevs from "./assets/rhdevlogo.svg";

// ----------------------------------------------------------------------------
// INPUT PANEL
// ----------------------------------------------------------------------------
class InputPanel extends Phaser.Scene {

  constructor() {
    super({ key: 'InputPanel', active: false });
    this.chars = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>']
    ];
    this.cursor = new Phaser.Math.Vector2();
    this.text;
    this.block;
    this.name = '';
    this.charLimit = 3;
  }

  create() {
    let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-');
    text.setLetterSpacing(20);
    text.setInteractive();
    this.add.image(text.x + 430, text.y + 148, 'rub');
    this.add.image(text.x + 482, text.y + 148, 'end');
    this.block = this.add.image(text.x - 10, text.y - 2, 'block').setOrigin(0);
    this.text = text;
    this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
    this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
    this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
    this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
    this.input.keyboard.on('keyup', this.anyKey, this);
    text.on('pointermove', this.moveBlock, this);
    text.on('pointerup', this.pressKey, this);
    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350
    });
  }

  moveBlock(pointer, x, y) {
    let cx = Phaser.Math.Snap.Floor(x, 52, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 64, 0, true);
    let char = this.chars[cy][cx];
    this.cursor.set(cx, cy);
    this.block.x = this.text.x - 10 + (cx * 52);
    this.block.y = this.text.y - 2 + (cy * 64);
  }

  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 52;
    }
    else {
      this.cursor.x = 9;
      this.block.x += 52 * 9;
    }
  }

  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 52;
    }
    else {
      this.cursor.x = 0;
      this.block.x -= 52 * 9;
    }
  }

  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 64;
    }
    else {
      this.cursor.y = 2;
      this.block.y += 64 * 2;
    }
  }

  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 64;
    }
    else {
      this.cursor.y = 0;
      this.block.y -= 64 * 2;
    }
  }

  anyKey(event) {
    let code = event.keyCode; //  Only allow A-Z . and -
    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    }
    else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    }
    else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
      this.cursor.set(8, 2);
      this.pressKey();
    }
    else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z) {
      code -= 65;
      let y = Math.floor(code / 10);
      let x = code - (y * 10);
      this.cursor.set(x, y);
      this.pressKey();
    }
    if (this.name.length === 3 && !(this.cursor.x === 8 && this.cursor.y === 2)) { // if all 3 characters input, limit to RUB or END
      this.cursor.set(9, 2);
      this.block.x = this.text.x - 10 + (9 * 52);
      this.block.y = this.text.y - 2 + (2 * 64);
    }
  }

  pressKey() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    this.block.x = this.text.x - 10 + (x * 52);
    this.block.y = this.text.y - 2 + (y * 64);
    let nameLength = this.name.length;
    if (x === 9 && y === 2 && nameLength > 0) {
      this.events.emit('submitName', this.name); //  Submit
    }
    else if (x === 8 && y === 2 && nameLength > 0) {
      this.name = this.name.substr(0, nameLength - 1); //  Rub
      this.events.emit('updateName', this.name);
    }
    else if (this.name.length < this.charLimit) {
      this.name = this.name.concat(this.chars[y][x]); //  Add
      this.events.emit('updateName', this.name);
    }
  }
}

// ----------------------------------------------------------------------------
// STARFIELD
// ----------------------------------------------------------------------------
class Starfield extends Phaser.Scene {

  constructor() {
    super({ key: 'Starfield', active: true });
    this.stars;
    this.distance = 300;
    this.speed = 200;
    this.max = 500;  // use 500 for star-small, and 100 for larger images
    this.xx = [];
    this.yy = [];
    this.zz = [];
  }

  preload() {
    this.load.image("star", ImgStar);
  }

  create() {
    //  Do this, otherwise this Scene will steal all keyboard input
    this.input.keyboard.enabled = false;
    this.stars = this.add.blitter(0, 0, 'star');

    for (let i = 0; i < this.max; i++) {
      this.xx[i] = Math.floor(Math.random() * window.innerWidth) - window.innerWidth/2;
      this.yy[i] = Math.floor(Math.random() * window.innerHeight) - window.innerHeight/2;
      this.zz[i] = Math.floor(Math.random() * 1700) - 100;
      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = window.innerWidth/2 + this.xx[i] * perspective;
      let y = window.innerHeight/2 + this.yy[i] * perspective;
      this.stars.create(x, y);
    }
  }

  update(time, delta) {
    for (let i = 0; i < this.max; i++) {
      let perspective = this.distance / (this.distance - this.zz[i]);
      let x = window.innerWidth/2 + this.xx[i] * perspective;
      let y = window.innerHeight/2 + this.yy[i] * perspective;
      this.zz[i] += this.speed * (delta / 1000);
      if (this.zz[i] > 300) { this.zz[i] -= 600; }
      let bob = this.stars.children.list[i];
      bob.x = x;
      bob.y = y;
    }
  }

}

// ----------------------------------------------------------------------------
// HIGH SCORE
// ----------------------------------------------------------------------------
class Highscore extends Phaser.Scene {

  constructor() {
    super({ key: 'Highscore', active: true });
    this.playerText;
    this.headerText;
  }

  preload() {
    this.load.image('block', ImgBlock);
    this.load.image('rub', ImgRub);
    this.load.image('end', ImgEnd);
    this.load.bitmapFont('arcade', FontArcade, FontArcadeXml);
  }

  create() {
    this.headerText = this.add.bitmapText(0, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
    this.headerText.setX(window.innerWidth/2 - this.headerText.width/2);
    let tempFirst = this.add.bitmapText(0, 310, 'arcade', '1ST   50000').setTint(0xff0000);
    tempFirst.setX(window.innerWidth/2 - this.headerText.width/2);
    this.playerText = this.add.bitmapText(0, 310, 'arcade', '').setTint(0xff0000);
    this.playerText.setX(window.innerWidth/2 - this.headerText.width/2 + 14*32); // 14 spaces over times the character width of 32
    this.input.keyboard.enabled = false; //  Do this, otherwise this Scene will steal all keyboard input
    this.scene.launch('InputPanel');
    let panel = this.scene.get('InputPanel');
    panel.events.on('updateName', this.updateName, this); //  Listen to events from the Input Panel scene
    panel.events.on('submitName', this.submitName, this); //  Listen to events from the Input Panel scene
  }

  submitName() {
    this.scene.stop('InputPanel');
    
    let secondText = this.add.bitmapText(0, 360, 'arcade', '2ND   40000   ANT').setTint(0xff8200);
    secondText.setX(window.innerWidth/2 - this.headerText.width/2);
    let thirdText = this.add.bitmapText(0, 410, 'arcade', '3RD   30000   .-.').setTint(0xffff00);
    thirdText.setX(window.innerWidth/2 - this.headerText.width/2);
    let fourthText = this.add.bitmapText(0, 460, 'arcade', '4TH   20000   BOB').setTint(0x00ff00);
    fourthText.setX(window.innerWidth/2 - this.headerText.width/2);
    let fifthText = this.add.bitmapText(0, 510, 'arcade', '5TH   10000   ZIK').setTint(0x00bfff);
    fifthText.setX(window.innerWidth/2 - this.headerText.width/2);
  }

  updateName(name) {
    this.playerText.setText(name);
  }

}

// ----------------------------------------------------------------------------
// THE GAME
// ----------------------------------------------------------------------------
let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  scene: [Starfield, Highscore, InputPanel]
};
let game = new Phaser.Game(config);
