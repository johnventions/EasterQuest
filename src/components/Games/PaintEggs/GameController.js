/* eslint-disable no-unused-vars */
import SignaturePad from "signature_pad";

const rectsIntersect = (a, b) => {
    return a.x + a.width > b.x &&
           a.x < b.x + b.width &&
           a.y + a.height > b.y &&
           a.y < b.y + b.height;
}

class GameController {
    constructor(canvas, width = 300, height = 450) {
        const signaturePad = new SignaturePad(canvas, {
            penColor: '#f9ceee',
            dotSize: 15,
            minWidth: 15,
            maxWidth: 25

        
        });

        function resizeCanvas() {
            const ratio =  Math.max(window.devicePixelRatio || 1, 1);
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            canvas.getContext("2d").scale(ratio, ratio);
            signaturePad.clear(); // otherwise isEmpty() might return incorrect value
        }

        // window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        this.signaturePad = signaturePad;
    }

    async init() {
        
    }
}

export default GameController;
