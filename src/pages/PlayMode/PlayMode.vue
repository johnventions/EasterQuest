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
        <div class="container-fluid p-0" v-if="activeQuest.type == 3">
            <chocolate-bunny />
        </div>
        <div class="container text-center mt-2">
            <Button asChild v-slot="slotProps" v-if="nextReady">
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

export default {
    name: 'PlayMode',
    components: {
        'chocolate-bunny': ChocolateBunnyVue,
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
            return parseInt(id);
        },
        activeQuest() {
            if (this.activeIndex < this.getMyQuests.length) {
                return this.getMyQuests[this.activeIndex];
            }
            return null;
        },
        nextPath() {
            return `/play/${this.activeIndex + 1}`;
        },
        nextButtonTxt() {
            switch (this.activeQuest.type.toString()) {
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