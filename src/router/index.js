import { createWebHistory, createRouter } from 'vue-router'

import HomeView from '../pages/HomeView';
import DashboardView from '../pages/DashboardView/DashboardView';
import QuickStart from '../pages/QuickStart/QuickStart';
import PlayMode from '@/pages/PlayMode/PlayMode.vue';

import store from '@/store';
import { getQuests } from '@/services/api.services';

const getQuestsCount = async () => {
    if (store.state.myQuests == null) {
        // we do not never looked up the quests
        const quests = await getQuests();
        const questList = quests.data ?? [];
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

const routes = [
    { path: '/', component: HomeView },
    { 
        path: '/dash',
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
        beforeEnter: async (to, from, next) => {
            await mustHaveQuests(next);
        },
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;