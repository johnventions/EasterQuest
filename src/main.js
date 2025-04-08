import { createApp } from 'vue'
import App from './App.vue'
import registerPrimeVue from './pvRegistration';
import router from './router';
import store from './store';
import ToastService from 'primevue/toastservice'

const app = createApp(App);
registerPrimeVue(app);
app.use(router);
app.use(store);
app.use(ToastService);

app.mount('#app')
