import { Assets, Container, Graphics } from "pixi.js";

export const loadAssets = async (app, assetsToLoad, bundleName) => {
    const barWidth = app.screen.width * 0.9;
    const barHeight = 30;

    const barBg = new Graphics().beginFill(0x444444).drawRect(0, 0, barWidth, barHeight).endFill();
    const barFill = new Graphics().beginFill(0x00ff99).drawRect(0, 0, 1, barHeight).endFill();

    const loadingContainer = new Container();
    loadingContainer.addChild(barBg, barFill);
    barBg.position.set(-barWidth / 2, -barHeight / 2);
    barFill.position.set(-barWidth / 2, -barHeight / 2);
    loadingContainer.position.set(app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(loadingContainer);

    await Assets.init();
    const manifest = assetsToLoad.reduce((acc, item) => {
      acc[item.alias] = item.src;
      return acc;
    }, {});
    Assets.addBundle(bundleName, manifest);

    const bundle = Assets.loadBundle(bundleName, (progress) => {
      barFill.clear();
      barFill.beginFill(0x00ff99).drawRect(0, 0, (barWidth * progress), barHeight).endFill();
    });

    await bundle;

    // === Cleanup loading bar ===
    loadingContainer.destroy(true);
}