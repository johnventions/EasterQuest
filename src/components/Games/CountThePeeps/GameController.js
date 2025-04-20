/* eslint-disable no-unused-vars */
import grass from '@/assets/games/bg_grass.jpg';
import peeps from '@/assets/games/peep.png';
import ding from '@/assets/games/sounds/ding.mp3';
import pop from '@/assets/games/sounds/pop.mp3';

import { loadAssets } from '../loader';
import { soundControls  } from '../soundControls';

import { Application, Assets, Sprite, Filter, Container, Graphics, Text } from 'pixi.js';
import { Howl } from 'howler';

const pinkTintShader = `
    precision mediump float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main() {
        vec4 color = texture2D(uSampler, vTextureCoord);
        // Apply a blue tint by reducing red and green channels
        gl_FragColor = vec4(color.r * 0.967, color.g * 0.451, color.b * 0.686, color.a);
    }
`;

const yellowTintShader = `
    precision mediump float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main() {
        vec4 color = texture2D(uSampler, vTextureCoord);
        // Apply a yellow tint by blending the original color with the yellow shade
        gl_FragColor = vec4(color.r * 0.992, color.g * 0.855, color.b * 0.022, color.a);
    }
`;

class GameController {
    constructor(canvas, width = 300, height = 450, soundEnabled  = true) {
        const app = new Application({
            width,
            height,
            autoDensity: canvas,
            resolution: window.devicePixelRatio || 1,
            background: 'white',
        });

        canvas.appendChild(app.view);
        this.app = app;
        this.ratio = width / height;
                
        const sound = soundControls(soundEnabled);
        Object.assign(this, sound);
    }

    async init() {
        const assetsToLoad = [
            { alias: 'grass', src: grass },
            { alias: 'cp_peep', src: peeps },
          ];

        await loadAssets(this.app, assetsToLoad, 'countPeeps');
        const dingSound = new Howl({
            src: [ding],
            preload: true
        });

        const popSound = new Howl({
            src: [pop],
            preload: true
        });

        this.loadGrass(this.app);
        const bunnies = this.loadBunnies(this.app, this.ratio);

        // Pointer down event listener to add black dots to the mask
        const onPointerDown = (bunny) => {
            popSound.play();
        };

        bunnies.forEach((b) => {
            b.on('pointerdown', (e) => onPointerDown(b));
        })

        const qty = bunnies.filter(b => b.isYellow).length;
        const onFinish = () => {
            bunnies.forEach((b, i) => {
                setTimeout(() => {
                    b.visible = false;
                }, i * 200)
            })
        }

        this.createBottomUI(qty, dingSound, popSound, onFinish);
    }

    loadGrass(app) {
        const baseImage = Assets.get('grass');
        const grassTexture = Sprite.from(baseImage);
        grassTexture.width = app.screen.width;
        grassTexture.height = app.screen.height;
        grassTexture.x = 0;
        grassTexture.y = 0;
        app.stage.addChild(grassTexture);
    }

    loadBunnies(app, ratio) {
        let bunnies = [];

        const getRandomPos = (existing, range) => {
            let x = 0;
            let y = 0;
            let attempts = 0;
            let found = false;
            while (attempts < 10 && !found) {
                x = Math.floor(Math.random() * (app.screen.width - 100) + 25);
                y = Math.floor(Math.random() * (app.screen.height - 150) + 50);
                attempts++;
                // check if no other item in existing is within {range} px of this item
                found = existing.every(item => {
                    const dx = item.x - x;
                    const dy = item.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    return distance >= range; // Ensure distance is greater than or equal to range
                });
            }
            return { x, y };
        }


        for (let i = 0; i < 12; i++) {
            const baseImage = Assets.get('cp_peep');
            const baseSprite = new Sprite(baseImage);
            const bunnyWidth = app.screen.width < 600 ? 50 : 100;
            baseSprite.width = bunnyWidth;
            baseSprite.height = baseSprite.width * 1.5;
            const { x, y } = getRandomPos(bunnies, baseSprite.width * 1);
            baseSprite.x = x;
            baseSprite.y = y;
            baseSprite.eventMode = 'static';
            baseSprite.rotation = 0;
            baseSprite.anchor.set(0.5);
            app.stage.addChild(baseSprite);
            bunnies.push(baseSprite);
            // shader code
            if (Math.random() < 0.25) {
                const pinkFilter = new Filter(null, pinkTintShader);
                baseSprite.filters = [pinkFilter];
                baseSprite.isYellow = false;
            } else {
                const yellowFilter = new Filter(null, yellowTintShader);
                baseSprite.filters = [yellowFilter];
                baseSprite.isYellow = true;
            }
        }
        return bunnies;
    }

    createBottomUI(correctAnswer, dingSound, popSound, finishCallback) {
        const { app } = this;
    
        // Create a container for the UI
        const uiContainer = new Container();
        uiContainer.y = app.screen.height - 100; // Position at the bottom 100px
        app.stage.addChild(uiContainer);
    
        // Guess number in the center of the screen
        let guess = 0;
        const guessText = new Text(`${guess}`, {
            fontFamily: 'Arial',
            fontSize: 42,
            fill: 'yellow', // Yellow text
            align: 'center',
            fontWeight: 'bold',
        });
        guessText.anchor.set(0.5);
        guessText.x = app.screen.width / 2; // Center horizontally
        guessText.y = app.screen.height / 2; // Center vertically
        app.stage.addChild(guessText); // Add directly to the stage
    
        // Create buttons
        const createButton = (label, x, onClick) => {
            const button = new Container();
    
            // Button background
            const bg = new Graphics();
            bg.beginFill(0x10B981);
            bg.drawRoundedRect(-40, -20, 80, 40, 10);
            bg.endFill();
            button.addChild(bg);
    
            // Button text
            const text = new Text(label, {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 'white',
                align: 'center',
            });
            text.anchor.set(0.5);
            button.addChild(text);
    
            button.x = x;
            button.y = 50;
            button.eventMode = 'dynamic';
            button.buttonMode = true;
            button.on('pointerdown', onClick);
    
            return button;
        };
    
        // Minus button
        const minusButton = createButton('-', app.screen.width / 4, () => {
            if (guess > 0) {
                guess--;
                guessText.text = `${guess}`; // Update the central guess text
            }
        });
        uiContainer.addChild(minusButton);
    
        // Plus button
        const plusButton = createButton('+', (app.screen.width / 4) * 3, () => {
            guess++;
            guessText.text = `${guess}`; // Update the central guess text
        });
        uiContainer.addChild(plusButton);
    
        // Guess button
        const guessButton = createButton('SUBMIT', app.screen.width / 2, () => {
            console.log(`Player guessed: ${guess}`);
            if (guess == correctAnswer) {
                dingSound.play(); // Play the ding sound on guess
                uiContainer.visible = false;
                finishCallback();
            } else {
                popSound.play();
            }
        });
        uiContainer.addChild(guessButton);
    }
}

export default GameController;
