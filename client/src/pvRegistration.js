/* eslint-disable vue/multi-word-component-names */
import Button from "primevue/button"
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import { Menubar, Dialog } from "primevue";
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';
import Panel from 'primevue/panel';

const registerPrimeVue = (app) => {
    app.use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })

    app.component('Button', Button);
    app.component('Menubar', Menubar);
    app.component('Dialog', Dialog);
    app.component('Textarea', Textarea);
    app.component('InputText', InputText);
    app.component('Checkbox', Checkbox);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('Panel', Panel);
}

export default registerPrimeVue;