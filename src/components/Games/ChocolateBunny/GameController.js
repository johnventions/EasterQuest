/* eslint-disable no-unused-vars */
import bunnyOutline from '@/assets/games/bunny_mask.png';
import bunny from '@/assets/games/chocolate_bunny.png';
import grass from '@/assets/games/bg_grass.jpg';


import { Application, Assets, Sprite, Graphics, RenderTexture, Rectangle } from 'pixi.js';

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
        console.log(width, height, this.ratio);
    }

    async init() {
        const brushSize = 100 * this.ratio; // Size of the brush (black dot)
        // Create a brush (black dot) for erasing areas in the mask
        const brush = new Graphics();
        brush.beginFill(0x000000); // Black color for masking (hiding)
        brush.drawCircle(0, 0, brushSize); // Dot with radius of 20 pixels
        brush.endFill();

        await this.loadGrass(this.app);
        const baseSprite = await this.loadBunny(this.app, this.ratio);
        const maskSprite = await this.loadMask(this.app, baseSprite);

        // Create a RenderTexture for the mask to modify it
        const maskTexture = RenderTexture.create({
            width: this.app.screen.width,
            height: this.app.screen.height,
        });

        // Set the initial mask texture using the RenderTexture
        this.app.renderer.render(maskSprite, { renderTexture: maskTexture });
        const dynamicMaskSprite = new Sprite(maskTexture); // This is the sprite that will be used as the mask

        // Apply the mask to the base image
        baseSprite.mask = dynamicMaskSprite;


        // Function to add black dot to the mask at the pointer position
        const addMaskDot = (x, y) => {
            brush.position.set(x, y);
            this.app.renderer.render(brush, {
                renderTexture: maskTexture,
                clear: false, // Don't clear the previous dots
            });
        };

        // Pointer down event listener to add black dots to the mask
        const onPointerDown = (event) => {
            const { x, y } = event.global;
            addMaskDot(x, y); // Add black dot at the clicked position
        };

        // Interaction layer to catch pointer events
        const interactionLayer = new Graphics();
        interactionLayer.hitArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
        interactionLayer.eventMode = 'static';
        interactionLayer.on('pointerdown', onPointerDown);

        // Add the images to the stage
        this.app.stage.addChild(baseSprite);   // Base image (Eiffel Tower)
        this.app.stage.addChild(dynamicMaskSprite);   // Mask image (black and white)
        this.app.stage.addChild(interactionLayer); // For interaction detection
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

    async loadBunny(app, ratio) {
        console.log(ratio);
        // Load the base image (Eiffel Tower)
        const baseImage = await Assets.load(bunny);
        const baseSprite = new Sprite(baseImage);
        baseSprite.width = app.screen.width * (1 / ratio);
        baseSprite.height = baseSprite.width;
        baseSprite.x = (app.screen.width - baseSprite.width) / 2;
        baseSprite.y = (app.screen.height - baseSprite.height) / 2;
        return baseSprite;
    }

    async loadMask(app, baseSprite) {
        // Load the mask image (black and white)
        const maskImage = await Assets.load(bunnyOutline);
        const maskSprite = new Sprite(maskImage);
        maskSprite.width = baseSprite.width
        maskSprite.height = baseSprite.height;
        maskSprite.x = (app.screen.width - maskSprite.width) / 2;
        maskSprite.y = (app.screen.height - maskSprite.height) / 2;
        return maskSprite;
    }
}

export default GameController;
