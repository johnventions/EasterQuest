/* eslint-disable vue/multi-word-component-names */
import Button from "primevue/button"
import { Menubar, Dialog } from "primevue";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const registerPrimeVue = (app) => {
    app.use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })

    app.component('Button', Button);
    app.component('Menubar', Menubar);
    app.component('Dialog', Dialog);
}

export default registerPrimeVue;