import { createApp } from 'vue'
import App from './App.vue'
import registerPrimeVue from './pvRegistration';
import router from './router';
import store from './store';

const app = createApp(App);
registerPrimeVue(app);
app.use(router);
app.use(store);

app.mount('#app')
