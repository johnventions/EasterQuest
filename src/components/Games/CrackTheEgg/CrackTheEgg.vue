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
    name: 'CrackEggGame',
    data() {
        return {
            controller: null,
        };
    },
    async mounted() {
        const canvas = this.$refs.pixi;
        const controller = new GameController(canvas, canvas.offsetWidth, window.innerHeight * 0.75);

        this.controller = controller;
        await controller.init();
  },
}
</script>
<style lang="scss">
#pixi {
    > canvas {
        width: 100%;
        max-width: 100%;
    }
}
</style>