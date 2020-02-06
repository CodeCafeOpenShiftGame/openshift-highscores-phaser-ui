import Phaser from 'phaser';

import ImgRub from './assets/rub.png';
import ImgEnd from './assets/end.png';
import ImgBlock from './assets/block.png';
import FontArcade from './assets/fonts/bitmap/arcade.png';
import FontArcadeXml from './assets/fonts/bitmap/arcade.xml';

export class Highscore extends Phaser.Scene {

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
        global.ws.addEventListener('message', this.onmessage);
    }

    create() {
        let loadingScreen = document.getElementById('loading-screen')
        if (loadingScreen) { // remove the loading screen
            loadingScreen.classList.add('transparent')
            this.time.addEvent({delay: 1000,callback: () => { loadingScreen.remove()}})
        }

        this.headerText = this.add.bitmapText(0, 260, 'arcade', 'RANK  SCORE   NAME').setTint(0xff00ff);
        this.headerText.setX(window.innerWidth / 2 - this.headerText.width / 2);

        if (this.scene.get('InputPanel') != null) { // only if input panel is configured
            let tempFirst = this.add.bitmapText(0, 310, 'arcade', '1ST   99999').setTint(0xffffff);
            tempFirst.setX(window.innerWidth / 2 - this.headerText.width / 2);
            this.playerText = this.add.bitmapText(0, 310, 'arcade', '').setTint(0xffffff);
            this.playerText.setX(window.innerWidth / 2 - this.headerText.width / 2 + 14 * 32); // 14 spaces over times the character width of 32
            this.input.keyboard.enabled = false; //  Do this, otherwise this Scene will steal all keyboard input
            this.scene.launch('InputPanel');
            let panel = this.scene.get('InputPanel');
            panel.events.on('updateName', this.updateName, this); //  Listen to events from the Input Panel scene
            panel.events.on('submitName', this.submitName, this); //  Listen to events from the Input Panel scene
        } else {
            let tempFirst = this.add.bitmapText(0, 310, 'arcade', 'NO    SCORES   YET').setTint(0xffffff);
            tempFirst.setX(window.innerWidth / 2 - this.headerText.width / 2);
            this.playerText = this.add.bitmapText(0, 310, 'arcade', '').setTint(0xff0000);
            this.playerText.setX(window.innerWidth / 2 - this.headerText.width / 2 + 14 * 32); // 14 spaces over times the character width of 32

            // let API server'swebsocket tell us when new scores are in
        }
    }

    getLatestScores() {
        // TODO call the API service and display them (support the case websocket isn't working)
    }

    updateName(name) {
        this.playerText.setText(name);
    }

    submitName() {
        if (this.scene.get('InputPanel') != null) {
            this.scene.stop('InputPanel');
            // TODO: we should still send a GET request for high scores paged to where your score is
            let secondText = this.add.bitmapText(0, 360, 'arcade', '2ND   40000   ANT').setTint(0xff8200);
            secondText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let thirdText = this.add.bitmapText(0, 410, 'arcade', '3RD   30000   .-.').setTint(0xffff00);
            thirdText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let fourthText = this.add.bitmapText(0, 460, 'arcade', '4TH   20000   BOB').setTint(0x00ff00);
            fourthText.setX(window.innerWidth / 2 - this.headerText.width / 2);
            let fifthText = this.add.bitmapText(0, 510, 'arcade', '5TH   10000   ZIK').setTint(0x00bfff);
            fifthText.setX(window.innerWidth / 2 - this.headerText.width / 2);
        } else {
            // nothing, can't submit without the input panel
        }
    }

    onmessage(event) {
        console.log('HS - thanks for the message');
    }
}