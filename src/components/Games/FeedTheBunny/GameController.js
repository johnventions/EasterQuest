/* eslint-disable no-unused-vars */
import dirt from '@/assets/games/dirt.jpg';
import carrot from '@/assets/games/carrot_top.png';
import fullCarrot from '@/assets/games/carrot.png';
import bunny from '@/assets/games/bunny_right.png';
import heart from '@/assets/games/heart.png';

import { Application, Assets, Sprite, Graphics, Circle } from 'pixi.js';

const rectsIntersect = (a, b) => {
    return a.x + a.width > b.x &&
           a.x < b.x + b.width &&
           a.y + a.height > b.y &&
           a.y < b.y + b.height;
}

class GameController {
    constructor(canvas, width = 300, height = 450) {
        console.log('render');
        const app = new Application({
            width,
            height,
            autoDensity: canvas,
            resolution: window.devicePixelRatio || 1,
            background: 'white',
            backgroundAlpha: 0,
        });

        canvas.appendChild(app.view);
        this.app = app;
        this.ratio = width / height;
    }

    async init() {
        const app = this.app;
        await this.loaddirt(this.app);
        //  const dropZone = await this.loadDropzone(this.app, basket);

        let handleY = 999;
        const onStretchStart = (event) => {
            carrot.alpha = 0.8;
            pullTarget = carrot;
            handleY = event.global.y;
            app.stage.on('pointermove', onDragMove);
        }

        const [bunny, bunnyHeart] = await this.loadBunny(this.app);
        const [carrot, hole] = await this.loadCarrot(this.app);
        const fullCarrot = await this.loadFullCarrot(this.app, carrot);
        const dropZone = this.loadDropzone(this.app, bunny);
        let origHeight = carrot.height;
        carrot.on('pointerdown', onStretchStart);


        const onDragMove = (event) => {
            if (pullTarget?.parent && pullTarget == carrot) {
                const progressRatio = (handleY - event.global.y) / handleY;
                const stretchHeight = origHeight * (1 + progressRatio);
                carrot.height = stretchHeight;
                if (progressRatio > 0.7) {
                    carrot.height = origHeight;
                    carrot.visible = false;
                    pullTarget = fullCarrot;
                    hole.visible = true;
                    fullCarrot.visible = true;
                }
            } else if (pullTarget?.parent && pullTarget != carrot) {
                pullTarget.parent.toLocal(event.global, null, pullTarget.position);
            }
        }

        const onDragEnd = () => {
            if (pullTarget) {
                app.stage.off('pointermove', onDragMove);
                carrot.visible = true;
                carrot.height = origHeight;

                if (pullTarget == fullCarrot) {
                    const dragBounds = pullTarget.getBounds();
                    const dropBounds = dropZone.getBounds();
    
                    if (rectsIntersect(dragBounds, dropBounds)) {
                        console.log('Points!');
                        bunnyHeart.visible = true;
                        setTimeout(() => {
                            bunnyHeart.visible = false;
                        }, 1000);
                    } else {
                        console.log('No Points');
                    }
                }

                pullTarget = null;
            }
            fullCarrot.visible = false;
            hole.visible = false;
        }
        
        let pullTarget = null;


        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointerup', onDragEnd);
    }

    async loaddirt(app) {
        const dirtBg = await Assets.load(dirt);
        
        const dirtTexture = Sprite.from(dirtBg);
        dirtTexture.width = app.screen.width;
        dirtTexture.height = 70;
        dirtTexture.anchor.set(0, 1);
        dirtTexture.x = 0;
        dirtTexture.y = app.screen.height;
        app.stage.addChild(dirtTexture);
    }

    async loadCarrot(app) {
        const carrotGraphic = await Assets.load(carrot);
        const carrotTexture = Sprite.from(carrotGraphic);
        carrotTexture.width = Math.min(app.screen.width / 3, 200);
        carrotTexture.height = carrotTexture.width * 1.75;
        carrotTexture.anchor.set(0.5, 1);
        carrotTexture.x = app.screen.width * 0.25;
        carrotTexture.y =  app.screen.height - 30;
        carrotTexture.eventMode = 'static';
        carrotTexture.cursor = 'pointer';

        const hole = new Graphics();
        hole.beginFill(0x000000, 0.7);
        const holeWidth = carrotTexture.width / 5;
        hole.drawEllipse(carrotTexture.x, carrotTexture.y, holeWidth, holeWidth/3);
        hole.endFill();
        hole.visible = false;
        app.stage.addChild(hole);
        app.stage.addChild(carrotTexture);
        return [carrotTexture, hole];
    }

    async loadFullCarrot(app, carrot) {
        const carrotGraphic = await Assets.load(fullCarrot);
        const carrotTexture = Sprite.from(carrotGraphic);
        carrotTexture.width = carrot.width;
        carrotTexture.height = carrot.width * 1.75;
        carrotTexture.anchor.set(0.5, 0.45);
        carrotTexture.x = app.screen.width * 0.25;
        carrotTexture.y =  app.screen.height - 30;
        carrotTexture.eventMode = 'static';
        carrotTexture.visible = false;
        app.stage.addChild(carrotTexture);
        return carrotTexture;
    }

    async loadBunny(app) {
        const bunnyGraphic = await Assets.load(bunny);
        const bunnyTexture = Sprite.from(bunnyGraphic);
        bunnyTexture.width = Math.min(app.screen.width / 2, 250);
        bunnyTexture.height = bunnyTexture.width * 1.75;
        bunnyTexture.anchor.set(1, 1);
        bunnyTexture.x = app.screen.width;
        bunnyTexture.y =  app.screen.height;
        bunnyTexture.eventMode = 'static';
        app.stage.addChild(bunnyTexture);

        
        const heartGraphic = await Assets.load(heart);
        const heartTexture = Sprite.from(heartGraphic);
        heartTexture.width = bunnyTexture.width / 6.5;
        heartTexture.height = heartTexture.width;
        heartTexture.anchor.set(0.5, 0.5);
        heartTexture.x = bunnyTexture.x - bunnyTexture.width * 0.4;
        heartTexture.y =  bunnyTexture.y - bunnyTexture.height * 0.95;
        heartTexture.visible = false;
        app.stage.addChild(heartTexture);

        return [bunnyTexture, heartTexture];
    }

    loadDropzone(app, bunny) {
        const dropZone = new Graphics();
        dropZone.beginFill(0x000000, 0.01); // Invisible (alpha 0)
        // Adjust height as needed
        const startX = bunny.x - bunny.width * 0.8;
        const startY = bunny.y - bunny.height * 0.8;
        dropZone.drawRect(startX, startY, bunny.width, bunny.height); 
        dropZone.endFill();
        app.stage.addChild(dropZone);

        return dropZone;
    }
}

export default GameController;
