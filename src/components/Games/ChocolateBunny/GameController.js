import {
    Application,
    Assets,
    Sprite,
    RenderTexture,
    Graphics,
    Rectangle,
} from 'pixi.js';

class GameController {
    constructor(canvas) {
        const app = new Application({
            resizeTo: window,
            autoDensity: true,
            background: 'white',
        });

        canvas.appendChild(app.view);

        app.view.style.touchAction = 'auto';
        app.view.style.pointerEvents = 'auto';

        this.app = app;
        this.brush = null;
        this.maskTexture = null;
    }

    async init() {
        const texture = await Assets.load(
            'https://cdn11.bigcommerce.com/s-7i4g8cpydv/images/stencil/1000x1000/products/1336/3436/Flat_Trad_Bunny_Painted_WEB__90799.1740662625.png?c=2'
        );
        const bunnySprite = new Sprite(texture);
        bunnySprite.x = (this.app.screen.width - bunnySprite.width) / 2;
        bunnySprite.y = (this.app.screen.height - bunnySprite.height) / 2;

        // Step 1: Create a mask texture and sprite
        this.maskTexture = RenderTexture.create({
            width: this.app.screen.width,
            height: this.app.screen.height,
        });

        const maskSprite = new Sprite(this.maskTexture);

        // Step 2: Fill the mask with white (fully visible)
        const initMask = new Graphics();
        initMask.beginFill(0xffffff, 1); // white = visible
        initMask.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        initMask.endFill();
        this.app.renderer.render(initMask, { renderTexture: this.maskTexture });

        // Step 3: Assign the mask to the bunny
        bunnySprite.mask = maskSprite;

        // Step 4: Create a black brush to "erase"
        this.brush = new Graphics();
        this.brush.beginFill(0x000000, 1); // black = hidden in mask
        this.brush.drawCircle(0, 0, 25);
        this.brush.endFill();

        const eraseMask = (x, y) => {
            this.brush.position.set(x, y);
            this.app.renderer.render(this.brush, {
                renderTexture: this.maskTexture,
                clear: false,
            });
        };

        const onPointerDown = (event) => {
            const { x, y } = event.global;
            eraseMask(x, y);
        };

        // Interaction layer to catch clicks
        const interactionLayer = new Graphics();
        interactionLayer.hitArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
        interactionLayer.eventMode = 'static';
        interactionLayer.on('pointerdown', onPointerDown);

        // Add in proper order
        this.app.stage.addChild(maskSprite);       // mask must be part of stage
        this.app.stage.addChild(bunnySprite);      // bunny uses the mask
        this.app.stage.addChild(interactionLayer); // sits above for interaction
    }
}

export default GameController;
