<template>
    <div class="play">
        <div class="play container">
            <div class="row justify-content-center" v-if="activeIndex == 0">
                <img :src="logo" alt="Logo" class="logo mb-4 w-75 w-md-50"/>
            </div>
            <div class="row text-center mt-2" v-if="activeQuest">
                <div class="d-flex justify-content-left mb-2">
                    <Button @click="back" v-if="canGoBack">
                        BACK
                    </Button>
                </div>
            </div>
            <div class="row text-center mt-2" v-if="activeQuest">
                <div class="col-12 play-clue" v-if="activeQuest.type < 2" :class="[
                    `quest_${activeIndex}`,
                    isLast ? 'quest_last' : ''
                ]">
                    <div>
                        <p>
                        {{ activeQuest.bodyText }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid p-0" v-if="activeQuest?.type == 3">
            <h3 class="text-center mb-2">{{ gameToRender.title }}</h3>
            <chocolate-bunny v-if="gameToRender.templateId == 1001" />
            <egg-basket v-if="gameToRender.templateId == 1002" />
            <feed-the-bunny v-if="gameToRender.templateId == 1003" />
            <paint-eggs v-if="gameToRender.templateId == 1004" />
            <crack-the-egg v-if="gameToRender.templateId == 1005" />
            <count-peeps v-if="gameToRender.templateId == 1006" />
            <rainbow-order v-if="gameToRender.templateId == 1007" />
        </div>
        <div class="container text-center mt-2">
            <div class="row">
                <div class="col-12 col-md-6 offset-md-3">
                    <Button asChild v-slot="slotProps" v-if="nextReady && !isLast">
                        <RouterLink :to="nextPath" :class="slotProps.class" class="mb-2 text-center">
                        {{ nextButtonTxt }}
                        </RouterLink>
                    </Button>
                    <form @submit.prevent="checkout" v-if="showPromoCta">
                        <div class="mb-3">
                            <label for="email" class="form-label hidden">Email Address</label>
                            <InputText type="email" id="email" v-model="email" class="form-control" required placeholder="Email Address"/>
                        </div>
                        <Button 
                            type="submit"
                            :disabled="loading"
                            :loading="loading"
                            label="Buy Now"
                            class="btn btn-primary w-100">
                        </Button>
                        <p v-if="errorReason">
                            {{ errorReason }}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script>
import { mapGetters } from 'vuex';
import logo from '@/assets/logo.png';
import ChocolateBunnyVue from '@/components/Games/ChocolateBunny/ChocolateBunny.vue';
import EggBasketVue from '@/components/Games/EggBasket/EggBasket.vue';
import FeedTheBunnyGame from '@/components/Games/FeedTheBunny/FeedTheBunny.vue';
import PaintEggs from '@/components/Games/PaintEggs/PaintEggs.vue';
import CrackTheEgg from '@/components/Games/CrackTheEgg/CrackTheEgg.vue';
import CountPeeps from '@/components/Games/CountThePeeps/CountPeeps.vue';
import RainbowOrder from '@/components/Games/RainbowOrder/RainbowOrder.vue';
import { checkout } from '@/services/api.service';

const shuffle = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export default {
    name: 'PlayMode',
    components: {
        'chocolate-bunny': ChocolateBunnyVue,
        'egg-basket': EggBasketVue,
        'feed-the-bunny': FeedTheBunnyGame,
        'paint-eggs': PaintEggs,
        'crack-the-egg': CrackTheEgg,
        'count-peeps': CountPeeps,
        'rainbow-order': RainbowOrder
    },
    data() {
        return {
            logo,
            nextReady: false,
            gameOrder: {},
            email: null,
            loading: false,
            errorReason: null,
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
        ...mapGetters(['getMyQuests', 'getExamples']),
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
        },
        gameToRender() {
            if (this.activeQuest?.type != 3) {
                return this.activeQuest;
            } else if (this.activeQuest.templateId != 1000) {
                return this.activeQuest;
            } else {
                const generated = this.gameOrder[this.activeIndex];
                if (generated) {
                    return {
                    ...generated,
                    templateId: generated.id
                    }
                }
                return this.activeQuest;
            }
        },
        gameIndexes() {
            return this.getMyQuests.map((q, i) => ({
                index: i,
                type: q.type,
                templateId: q.templateId
            })).filter(x => x.type == 3 && x.templateId == 1000);
            // filter to only games that are the random assigned
        },
        isLast() {
            return (this.activeIndex + 1) == this.getMyQuests.length;
        },
        showPromoCta() {
            return this.nextReady && this.isLast && this.$route.params.shareId == "2-eggs2025";
        }
    },
    mounted() {
        if (Object.keys(this.gameOrder).length == 0) {
            this.generateGameOrder();
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        generateGameOrder() {
            const list = {};
            // eslint-disable-next-line no-unused-vars
            const allGames = this.getExamples.filter(x => x.type == 3 && x.id != 1000);
            const shuffled = shuffle([...allGames]);
            for(let i = 0; i < this.gameIndexes.length; i++) {
                const item = this.gameIndexes[i];
                const rolledIndex = i % shuffled.length;
                const selected = shuffled[rolledIndex];
                list[item.index] = {
                    ...selected,
                    templateId: selected.id
                };
            }
            this.gameOrder = list;
        },
        async checkout() {
            try {
                this.loading = true;
                this.errorReason = null;
                const data = {
                    email: this.email,
                }
                const response = await checkout(data);
                if (response.success) {
                    window.location.href = response.url; // Redirect to the checkout page
                } else {
                    this.errorReason = response.reason;
                    this.loading = false;
                    console.error('Checkout failed:', response.message);
                    if (this.errorReason == 'Account already exists') {
                        setTimeout(() => {
                            this.$router.push({name: 'Login'});
                        }, 1500);
                    }
                }
            } catch (error) {
                this.loading = false;
                console.error('Error registering user:', error);
            }
        },
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

    .play-clue {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 60vh;
        font-size: 1.40rem;
        line-height: 1.2;
        @media screen and (min-width: 768px) {
            min-height: 40vh;
        }
        
        &.quest_0, &.quest_last {
            min-height: 40vh;
            @media screen and (min-width: 768px) {
                min-height: 30vh;
            }
        }

        > div {
            width: 100%;
            display: block;
        }
        
        @media screen and (min-width: 768px) {
            line-height: 1.35;
            font-size: 1.75rem;
        }
    }
</style>