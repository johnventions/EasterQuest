<template>
    <div id="container">
        <canvas id="drawingPad" ref="drawingPad" />
        <img class="overlay" :src="eggColor" />
    </div>
    <div class="d-flex">
        <button v-for="color in colors"
            class="color-swatch d-block"
            :key="color"
            @click="setColor(color)"
            v-bind:style="{ backgroundColor: color }">

        </button>
    </div>
</template>
<script>
import GameController from './GameController';
import eggColor from '@/assets/games/egg_color.png';

export default {
    name: 'PaintEggsGame',
    data() {
        return {
            eggColor,
            controller: null,
            signaturePad: null,
            selectedColor: '#f9ceee',
            colors: [
                '#FFFFFF',
                '#f9ceee',
                '#e0cdff',
                '#c1f0fb',
                '#dcf9a8',
                '#ffebaf',
            ]
        };
    },
    async mounted() {
        this.$nextTick(async () => {
            const canvas = this.$refs.drawingPad;
            const controller = new GameController(canvas, canvas.offsetWidth, window.innerHeight * 0.75);
            this.controller = controller;
            this.signaturePad = controller.signaturePad;
            await controller.init();
        });
    },
    methods: {
        setColor(c) {
            this.signaturePad.penColor = c;
        }
    }
}
</script>
<style lang="scss">
#container {
    position: relative;
    height: 125vw;
    @media screen and (min-width: 500px) {
        width: 500px;
        height: 650px;
        margin-left: auto;
        margin-right: auto;
    }
    > canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        background: white;
        max-width: 100%; 
        z-index: 0;
    }
    .overlay {
        position: absolute;
        pointer-events: none;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 1;
    }
}

.color-swatch {
    width: 33%;
    min-height: 30px;
}
</style>