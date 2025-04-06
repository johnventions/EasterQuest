/* eslint-disable no-unused-vars */
import grass from '@/assets/games/bg_grass.jpg';
import basket from '@/assets/games/basket.png';
import eggs from '../eggs.js';

import { Application, Assets, Sprite, Graphics, RenderTexture, Rectangle, SCALE_MODES } from 'pixi.js';

const rectsIntersect = (a, b) => {
    return a.x + a.width > b.x &&
           a.x < b.x + b.width &&
           a.y + a.height > b.y &&
           a.y < b.y + b.height;
}

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
        const app = this.app;
        await this.loadGrass(this.app);
        const basket = await this.loadBasket(this.app);
        const dropZone = await this.loadDropzone(this.app, basket);
        const textures = await Assets.load(eggs);
        const textureKeys = Object.keys(textures);

        const onDragStart = (bunny) => {
            bunny.alpha = 0.8;
            dragTarget = bunny;
            app.stage.on('pointermove', onDragMove);
        }

        const createEgg = (x, y, app) => {
                const index = Math.floor(Math.random() * textureKeys.length);
                const randomKey = textureKeys[index];
                const randomTexture = textures[randomKey];
                const egg = new Sprite(randomTexture);
                egg.eventMode = 'static';
                egg.cursor = 'pointer';
                egg.anchor.set(0.5);
                egg.width = 70;
                egg.height = 100;
                egg.x = x;
                egg.y = y;

                egg.on('pointerdown', () => onDragStart(egg));

                // Add it to the stage
                app.stage.addChild(egg);
        }

        for (let i = 0; i < 10; i++) {
            createEgg(Math.floor(Math.random() * this.app.screen.width), 
                    Math.floor(Math.random() * this.app.screen.height * 0.5),
                    this.app
                );
        }

        const onDragMove = (event) => {
            if (dragTarget?.parent) {
                dragTarget.parent.toLocal(event.global, null, dragTarget.position);
            }
        }

        const onDragEnd = () => {
            if (dragTarget) {
                app.stage.off('pointermove', onDragMove);
                dragTarget.alpha = 1;

                const dragBounds = dragTarget.getBounds();
                const dropBounds = dropZone.getBounds();

                if (rectsIntersect(dragBounds, dropBounds)) {
                    console.log('Dropped in the basket!');
                    dragTarget.interactive = false;
                    dragTarget.off('pointerdown');
                    app.stage.removeChild(dragTarget);
                } else {
                    console.log('Dropped outside the basket!');
                }

                dragTarget = null;
            }
        }
        
        let dragTarget = null;


        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointerup', onDragEnd);
        app.stage.on('pointerupoutside', onDragEnd);
        
    }

    async loadGrass(app) {
        const grassBg = await Assets.load(grass);
        
        const grassTexture = Sprite.from(grassBg);
        grassTexture.width = app.screen.width;
        grassTexture.height = app.screen.height;
        grassTexture.x = 0;
        grassTexture.y = 0;
        app.stage.addChild(grassTexture);
    }

    async loadBasket(app) {
        const basketAsset = await Assets.load(basket);
        
        const basketTexture = Sprite.from(basketAsset);
        basketTexture.width = app.screen.width * 0.75;
        basketTexture.height = basketTexture.width * 0.75;
        basketTexture.x = app.screen.width / 2;
        basketTexture.y = app.screen.height - basketTexture.height / 2;
        basketTexture.anchor.set(0.5);
        app.stage.addChild(basketTexture);

        return basketTexture;
    }

    loadDropzone(app, basket) {
        const dropZone = new Graphics();
        dropZone.beginFill(0x000000, 0.1); // Invisible (alpha 0)
        // Adjust height as needed
        const startX = basket.x - basket.width / 2;
        const startY = basket.y - basket.height * 0.2;
        dropZone.drawRect(startX, startY, basket.width, basket.height); 
        dropZone.endFill();
        app.stage.addChild(dropZone);

        return dropZone;
    }
}

export default GameController;
