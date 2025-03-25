import { createApp } from 'vue'
import App from './App.vue'
import registerPrimeVue from './pvRegistration';
import router from './router';

const app = createApp(App);
registerPrimeVue(app);
app.use(router);
app.mount('#app')
