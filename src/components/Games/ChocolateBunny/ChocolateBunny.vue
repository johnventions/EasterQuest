<template>
    <div>
        <div 
        id="pixi"
        ref="pixi"
        />
    </div>
</template>
<script>
import GameController from './GameController';

export default {
    name: 'ChocolateBunnyGame',
    data() {
        return {
            controller: null,
        };
    },
    async mounted() {
             // settings.RESOLUTION = window.devicePixelRatio || 1;
        const canvas = this.$refs.pixi;
        console.log(this.$refs, canvas);
        const controller = new GameController(canvas);

        this.controller = controller;
        await controller.init();
  },
}
</script>
<style lang="scss">
#pixi {
    > canvas {
        width: 100%;
        height: 100%;
        max-width: 100%;
    }
}
</style>