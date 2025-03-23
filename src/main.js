import { createApp } from 'vue'
import App from './App.vue'
import registerPrimeVue from './pvRegistration';

const app = createApp(App);
registerPrimeVue(app);
app.mount('#app')
