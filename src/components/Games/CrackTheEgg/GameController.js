/* eslint-disable no-unused-vars */
import ceEgg0 from '@/assets/games/egg_crack_0.png';
import ceEgg1 from '@/assets/games/egg_crack_1.png';
import ceEgg2 from '@/assets/games/egg_crack_2.png';
import ceEgg3 from '@/assets/games/egg_crack_3.png';
import grass from '@/assets/games/bg_grass.jpg';

import { loadAssets } from '../loader';

import { Application, Assets, Sprite } from 'pixi.js';

class GameController {
    constructor(canvas, width = 300, height = 450) {
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
    }

    async init() {
        const assetsToLoad = [
            { alias: 'grass', src: grass },
            { alias: 'ce_egg0', src: ceEgg0 },
            { alias: 'ce_egg1', src: ceEgg1 },
            { alias: 'ce_egg2', src: ceEgg2 },
            { alias: 'ce_egg3', src: ceEgg3 },
          ];

        await loadAssets(this.app, assetsToLoad, 'crackEgg');

        this.loadGrass(this.app);
        const eggSprite = this.loadEgg(this.app, this.ratio);

        // Pointer down event listener to add black dots to the mask
        const onPointerDown = (event) => {
            const { x, y } = event.global;
            if (eggSprite.hits < 16) {
                eggSprite.targetRotation = eggSprite.rotation + 0.5;
                eggSprite.hits++;
                switch (eggSprite.hits) {
                    case 5:
                        eggSprite.texture = Assets.get('ce_egg1');
                        break;
                    case 10:
                        eggSprite.texture = Assets.get('ce_egg2');
                        break;
                    case 16:
                        eggSprite.texture = Assets.get('ce_egg3');
                        break;
                    default:
                        break;
                }
            }
        };

        eggSprite.on('pointerdown', onPointerDown);

        // Add the images to the stage
        this.app.stage.addChild(eggSprite);

        this.app.ticker.add((delta) => {
            let rotDif = eggSprite.targetRotation - eggSprite.rotation;

            // Normalize angle to [-PI, PI] range for shortest direction
            rotDif = ((rotDif + Math.PI) % (Math.PI * 2)) - Math.PI;

            // Apply easing if difference is significant
            if (Math.abs(rotDif) > 0.001) {
                eggSprite.rotation += rotDif / 10; // adjust easing factor as needed
            }
          });
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

    loadEgg(app, ratio) {
        const baseImage = Assets.get('ce_egg0');
        const baseSprite = new Sprite(baseImage);
        baseSprite.width = app.screen.width * 0.75 * (1 / ratio);
        baseSprite.height = baseSprite.width;
        baseSprite.x = (app.screen.width) / 2;
        baseSprite.y = (app.screen.height) / 2;
        baseSprite.eventMode = 'static';
        baseSprite.rotation = 0;
        baseSprite.anchor.set(0.5);
        baseSprite.targetRotation = 0;
        baseSprite.hits = 0;
        return baseSprite;
    }
}

export default GameController;
