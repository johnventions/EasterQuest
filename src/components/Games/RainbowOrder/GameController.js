/* eslint-disable no-unused-vars */
import splatImg from '@/assets/games/splat.png';
import grass from '@/assets/games/bg_grass.jpg';
import ding from '@/assets/games/sounds/ding.mp3';
import pop from '@/assets/games/sounds/pop.mp3';
import c4 from '@/assets/games/sounds/piano/C4.mp3';
import c5 from '@/assets/games/sounds/piano/C5.mp3';
import d4 from '@/assets/games/sounds/piano/D4.mp3';
import e4 from '@/assets/games/sounds/piano/E4.mp3';
import f4 from '@/assets/games/sounds/piano/F4.mp3';
import g4 from '@/assets/games/sounds/piano/G4.mp3';
import a4 from '@/assets/games/sounds/piano/A4.mp3';
import b4 from '@/assets/games/sounds/piano/B4.mp3';

import { loadAssets } from '../loader';
import { soundControls  } from '../soundControls';

import { Application, Assets, Sprite, ColorMatrixFilter, Rectangle, Container, Graphics, Text } from 'pixi.js';
import { Howl } from 'howler';

const colorMap = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF', // Violet
];

const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

const drawRect = (rect) => {
    rect.clear();
    rect.beginFill(rect.pixiAssign);
    rect.drawRect(
        rect.hitArea.x,
        rect.hitArea.y,
        rect.hitArea.width,
        rect.hitArea.height
    );
    rect.endFill();
}

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
        const app = this.app;
        const assetsToLoad = [
            { alias: 'grass', src: grass },
            { alias: 'rb_splat', src: splatImg },
          ];

        await loadAssets(this.app, assetsToLoad, 'rainbow');
        const dingSound = new Howl({
            src: [ding],
            preload: true
        });

        const popSound = new Howl({
            src: [pop],
            preload: true
        });

        this.loadGrass(app);
        const soundMap = this.loadSounds();

        const colors = this.getColors(this.app, this.ratio);
        let dragTarget = null;
        let dropSource = null;
        
        const splat = this.loadSplat(this.app);
        splat.visible = false;

        // Pointer down event listener to add black dots to the mask
        const onPointerDown = (event, c) => {
            dropSource = c;
            const sound = soundMap[c.hexAssign];
            if (sound != null) {
                sound.play();
            }
            dragTarget = splat;
            onDragMove(event);
            splat.visible = true;
        
            // Get the hexAssign color from the dragTarget
            const colorHex = c.hexAssign;
        
            // Apply a color filter to the splat
            const colorFilter = new ColorMatrixFilter();
            colorFilter.matrix = [
                parseInt(colorHex.slice(1, 3), 16) / 255, 0, 0, 0, 0, // Red
                0, parseInt(colorHex.slice(3, 5), 16) / 255, 0, 0, 0, // Green
                0, 0, parseInt(colorHex.slice(5, 7), 16) / 255, 0, 0, // Blue
                0, 0, 0, 1, 0, // Alpha
            ];
            splat.filters = [colorFilter];
        
            app.stage.on('pointermove', onDragMove);
        };
        
        const onDragMove = (event) => {
            if (dragTarget?.parent) {
                dragTarget.parent.toLocal(event.global, null, dragTarget.position);
            }
        }

        const onDragEnd = () => {
            console.log('dropping', dropSource?.hexAssign);
        
            let dropTarget = null;
        
            if (dropSource != null) {
                // Check if splat intersects with any rectangle
                colors.forEach((rect) => {
                    const rectBounds = rect.getBounds(); // Get the rectangle's bounds
                    if (rectBounds.contains(splat.x, splat.y)) {
                        dropTarget = rect; // Assign the intersecting rectangle to dropTarget
                    }
                });
        
                if (dropTarget) {
                    console.log('Dropped on:', dropTarget.hexAssign);
        
                    // Swap the colors of dropSource and dropTarget
                    const tempColor = dropSource.pixiAssign;
                    const tempHex = dropSource.hexAssign;
                    dropSource.pixiAssign = dropTarget.pixiAssign;
                    dropSource.hexAssign = dropTarget.hexAssign;
                    dropTarget.pixiAssign = tempColor;
                    dropTarget.hexAssign = tempHex;
        
                    // Update the fills of both rectangles
                    drawRect(dropTarget);
                    drawRect(dropSource);
                } else {
                    console.log('No valid drop target');
                }
        
                // Reset drag state
                dragTarget = null;
                splat.visible = false;
            }
        
            dropSource = null;
        };

        colors.forEach((c) => {
            c.on('pointerdown', (e) => onPointerDown(e, c));
        });
        
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointerup', onDragEnd);
        app.stage.on('pointerupoutside', onDragEnd);

        this.createBottomUI(dingSound, popSound, colors, soundMap);
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

    loadSounds() {
        return {
            '#FF0000': new Howl({
                src: [c4],
                preload: true
            }), // Red
            '#FF7F00': new Howl({
                src: [d4],
                preload: true
            }), // Orange
            '#FFFF00': new Howl({
                src: [e4],
                preload: true
            }), // Yellow
            '#00FF00': new Howl({
                src: [f4],
                preload: true
            }), // Green
            '#0000FF': new Howl({
                src: [g4],
                preload: true
            }), // Blue
            '#4B0082': new Howl({
                src: [a4],
                preload: true
            }), // Indigo
            '#8B00FF': new Howl({
                src: [b4],
                preload: true
            }), // Violet
            'final': new Howl({
                src: [c5],
                preload: true
            }), // FINAL
        }
    }

    loadSplat(app) {
        const baseImage = Assets.get('rb_splat');
        const splatTexture = Sprite.from(baseImage);
        splatTexture.width = 100;
        splatTexture.height = 100;
        splatTexture.x = 0;
        splatTexture.y = 0;
        splatTexture.anchor.set(0.5);
        app.stage.addChild(splatTexture);

        return splatTexture;
    }

    getColors(app) {
        let colors = [];
    
        // Shuffle the colors
        const shuffledColors = shuffle([...colorMap]);
    
        // Determine if the view is portrait or landscape
        const isPortrait = app.screen.height > app.screen.width;
    
        // Calculate dimensions for the rectangles
        const border = 20;
        const rectWidth = isPortrait
            ? app.screen.width - 2 * border // Full width minus borders
            : (app.screen.width - 2 * border) / 7; // Divide width into 7 parts
        const rectHeight = isPortrait
            ? (app.screen.height - 3.5 * border) / 7 // Divide height into 7 parts
            : app.screen.height - 2 * border; // Full height minus borders
    
        // Create and display the rectangles
        for (let i = 0; i < shuffledColors.length; i++) {
            const rect = new Graphics();
            rect.hexAssign = shuffledColors[i];
            rect.pixiAssign = parseInt(shuffledColors[i].replace('#', '0x'));
            rect.rectWidth = rectWidth;
            rect.rectHeight = rectHeight;

            
            rect.hitArea = new Rectangle(
                border + (isPortrait ? 0 : i * rectWidth), // X position
                border + (isPortrait ? i * rectHeight : 0), // Y position
                rectWidth, // Width
                rectHeight // Height
            );
            drawRect(rect);

            rect.eventMode = 'static';
            // Add the rectangle to the stage
            app.stage.addChild(rect);
            colors.push(rect);
        }
    
        return colors;
    }

    createBottomUI(dingSound, popSound, colors, soundMap) {
        const { app } = this;
    
        // Create a container for the UI
        const uiContainer = new Container();
        uiContainer.y = app.screen.height - 22; // Adjusted to position the UI container properly
        app.stage.addChild(uiContainer);
    
        // Create buttons
        const createButton = (label, x, width, onClick) => {
            const button = new Container();
    
            // Button background
            const bg = new Graphics();
            bg.beginFill(0x10B981);
            bg.drawRoundedRect(-width / 2, -20, width, 40, 10); // Center the background
            bg.endFill();
            button.addChild(bg);
    
            // Button text
            const text = new Text(label, {
                fontFamily: 'Arial',
                fontSize: 18,
                fill: 'white',
                align: 'center',
            });
            text.anchor.set(0.5); // Center the text
            text.x = 0; // Center horizontally
            text.y = 0; // Center vertically
            button.addChild(text);
    
            button.x = x;
            button.y = 0;
            button.eventMode = 'dynamic';
            button.buttonMode = true;
            button.on('pointerdown', onClick);
    
            return button;
        };
    
        const guessButton = createButton('SUBMIT', app.screen.width / 2, 200, () => {
            // check colors 
            const submitted = colors.map(x => x.hexAssign);
            if (submitted.length === colorMap.length &&
                submitted.every((value, index) => value === colorMap[index])
            ) {
                uiContainer.visible = false;
                colors.forEach((c, i) => {
                    const sound = soundMap[c.hexAssign];
                    setTimeout(() => {
                        sound.play();
                        c.clear();
                    }, i * 300);
                    if (i == 6) {
                        const finalSound = soundMap['final'];
                        setTimeout(() => {
                            finalSound.play();
                        }, (i+1) * 300);
                    }
                })
            } else {
                popSound.play();
            }
        });
        uiContainer.addChild(guessButton);
    }
}

export default GameController;
