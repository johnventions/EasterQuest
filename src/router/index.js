import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../pages/HomeView'
import DashboardView from '../pages/DashboardView'
import QuickStart from '../pages/QuickStart/QuickStart'

const routes = [
    { path: '/', component: HomeView },
    { path: '/dash', component: DashboardView },
    { path: '/setup', component: QuickStart },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;