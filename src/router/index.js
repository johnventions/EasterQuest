import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../pages/HomeView';
import DashboardView from '../pages/DashboardView/DashboardView';
import QuickStart from '../pages/QuickStart/QuickStart';
import PlayMode from '@/pages/PlayMode/PlayMode.vue';
import Register from '@/pages/Register/Register.vue';

import store from '@/store';
import { getQuests, getLoginState, getSharedQuests } from '@/services/api.service';
import LoginPage from '@/pages/LoginPage/LoginPage.vue';


const getQuestsCount = async () => {
    if (store.state.myQuests == null) {
        // we have never looked up the quests
        const quests = await getQuests();
        const questList = quests ?? [];
        store.commit('SET_QUESTS', questList);
        return questList.length;
    }
    return store.state.myQuests.length;
}

const mustHaveQuests = async (next) => {
    if(await getQuestsCount() == 0) {
        next({ name: 'Setup'});
        return;
    }
    next();
}

const mustNotHaveQuests = async (next) => {
    if(await getQuestsCount() > 0) {
        next({ name: 'Dashboard'});
        return;
    }
    next();
}

const loadSharedQuests = async (to) => {
    console.log(to.params);
    if ((store.state.myQuests ?? []).length == 0) {
        const questList = await getSharedQuests(to.params.shareId);
        store.commit('SET_QUESTS', questList ?? []);
    }
}

const isUserLoggedIn = async () => {
    if (store.state.isLoggedIn == null) {
        // we don't know if they are logged in
        const loginState = await getLoginState();
        store.commit('SET_LOGIN_STATE', loginState);
        if (loginState.isLoggedIn) {
            return true;
        }
    }
    return store.state.isLoggedIn;
}

const mustBeLoggedIn = async (next) => {
    const ls = await isUserLoggedIn();
    if (ls) {
        return next();
    }
    next({ name: 'Login' });
}

const routes = [
    { path: '/', component: HomeView },
    {
        path: '/log-in',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/login',
        redirect: () => {
            return { path: '/log-in' }
        }
    },
    {
        path: '/complete-purchase',
        name: 'ForceRegister',
        component: Register,
        meta: { forceRegister: true },
    },
    { 
        path: '/dash',
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: DashboardView,
                beforeEnter: async (to, from, next) => {
                    await mustHaveQuests(next);
                },
            },
            { 
                path: 'setup',
                beforeEnter: async (to, from, next) => {
                    await mustNotHaveQuests(next);
                },
                children: [
                    {
                        path: '',
                        name: 'Setup',
                        component: QuickStart
                    },
                    {
                        path: 'step-2',
                        name: 'Step2',
                        component: QuickStart
                    },
                    {
                        path: 'submit',
                        name: 'EndSetup',
                        component: QuickStart
                    }
                ]
            },
        ]
    },
    {
        path: '/play/:id',
        component: PlayMode,
        name: 'Play',
        meta: { requiresAuth: true },
        beforeEnter: async (to, from, next) => {
            await mustHaveQuests(next);
        },
    },
    {
        
        path: '/share/:shareId',
        component: PlayMode,
        name: 'Share',
        meta: { requiresAuth: false },
        beforeEnter: async (to, from, next) => {
            await loadSharedQuests(to);
            next();
        },
        children: [
            {
                path: ':id',
                name: 'SharePage',
                component: PlayMode,
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        console.log('checking auth');
        await mustBeLoggedIn(next);
    } else {
        next(); // always call next() to resolve the hook
    }
});

export default router;