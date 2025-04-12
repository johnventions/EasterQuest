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
import Select from 'primevue/select';
import Timeline from 'primevue/timeline';
import Toast from 'primevue/toast';
import Password from 'primevue/password';

import Carousel from 'primevue/carousel';


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
    app.component('Password', Password);
    app.component('Checkbox', Checkbox);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('Panel', Panel);
    app.component('Select', Select);
    app.component('Timeline', Timeline);
    app.component('Toast', Toast);
    app.component('Carousel', Carousel);
}

export default registerPrimeVue;