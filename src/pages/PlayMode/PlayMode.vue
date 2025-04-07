<template>
    <div class="play">
        <div class="play container">
            <div class="row justify-content-center" v-if="activeQuest?.type == 0">
                <img :src="logo" alt="Logo" class="logo mb-4 w-75 w-md-50"/>
            </div>
            <div class="row text-center mt-2" v-if="activeQuest">
                <div class="d-flex justify-content-left mb-5">
                    <Button @click="back" v-if="canGoBack">
                        BACK
                    </Button>
                </div>
                <div v-if="activeQuest.type < 2">
                    <p>
                        {{ activeQuest.bodyText }}
                    </p>
                </div>
            </div>
        </div>
        <div class="container-fluid p-0" v-if="activeQuest?.type == 3">
            <chocolate-bunny v-if="activeQuest.templateId == 1001" />
            <egg-basket v-if="activeQuest.templateId == 1002" />
            <feed-the-bunny v-if="activeQuest.templateId == 1003" />
        </div>
        <div class="container text-center mt-2">
            <Button asChild v-slot="slotProps" v-if="nextReady && (activeIndex + 1) < getMyQuests.length">
                    <RouterLink :to="nextPath" :class="slotProps.class" class="mb-2 text-center">
                    {{ nextButtonTxt }}
                    </RouterLink>
                </Button>
        </div>
    </div>
    
</template>
<script>
import { mapGetters } from 'vuex';
import logo from '@/assets/logo.png';
import ChocolateBunnyVue from '@/components/Games/ChocolateBunny/ChocolateBunny.vue';
import EggBasketVue from '@/components/Games/EggBasket/EggBasket.vue';
import FeedTheBunnyGame from '@/components/Games/FeedTheBunny/FeedTheBunny.vue';

export default {
    name: 'PlayMode',
    components: {
        'chocolate-bunny': ChocolateBunnyVue,
        'egg-basket': EggBasketVue,
        'feed-the-bunny': FeedTheBunnyGame
    },
    data() {
        return {
            logo,
            nextReady: false
        }
    },
    watch: {
        $route: {
            handler () {
                this.nextReady = false;
                setTimeout(() => {
                    this.nextReady = true;
                }, 1000);
            },
            immediate: true
        }
    },
    computed: {
        ...mapGetters(['getMyQuests']),
        activeIndex() {
            const { id } = this.$route.params;
            return parseInt(id ?? "0");
        },
        activeQuest() {
            if (this.activeIndex < this.getMyQuests.length) {
                return this.getMyQuests[this.activeIndex];
            }
            return null;
        },
        nextPath() {
            if (this.$route.name == 'Play') {
                return `/play/${this.activeIndex + 1}`;
            }
            return `/share/${this.$route.params.shareId}/${this.activeIndex + 1}`;
        },
        nextButtonTxt() {
            switch (this.activeQuest?.type.toString()) {
                case "0":
                    return "LET'S GO";
                case "1":
                    return "I FOUND IT";
                default:
                    return "NEXT";
            }
        },
        canGoBack() {
            return this.activeIndex > 0;
        }
    },
    methods: {
        back() {
            this.$router.back();
        }
    }
}
</script>
<style lang="scss" scoped>
    p {
        white-space: pre-wrap;
    }

    .logo {
        width: 80%;
        max-width:  300px;
        display: block;
    }
</style>