<template>
    <div>
        <Toast>
            <template #message="slotProps">
                <div>
                    <h5>Welcome Back</h5>
                    <p>{{ slotProps.message.summary }}</p>
                    <Button asChild v-slot="slotProps"  
                    size="small">
                        <RouterLink to="/dash" :class="slotProps.class">
                        Let's go
                        </RouterLink>
                    </Button>
                </div>
            </template>
        </Toast>
        <img :src="leavesLeft" class="leaves leaves-left"/>
        <img :src="leavesRight" class="leaves leaves-right"/>
        <div class="container eq-content">
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 text-center">
                    <img :src="logo" alt="Logo" class="logo mb-4 w-75 w-md-50"/>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 text-center">
                    <h1 class="mb-4">What Is Easter Quest?</h1>
                    <p class="lead mb-4">
                        The Easter Bunny already hides treats around your house, but this year, they're hiding them in a different way! 
                    </p>
                    <p class="lead mb-4">
                        With Easter Quest, you and your kids can go on an unforgettable digital scavenger hunt <strong><i>AND</i></strong> play fun games along the way.
                    </p>
                    
                <p>
                    Already have an account? <router-link to="log-in">Log In</router-link>
                </p>
                </div>
                
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 mb-4">
                    <Panel class="w-100 mb-2">
                        <h2 class="mb-4 text-center">Buy now for only $5</h2>
                        <p>
                            Get access to all of the pre-made quests and games, and be ready for Easter in less than 10 minutes. 
                        </p>
                        <form @submit.prevent="checkout">
                            <div class="mb-3">
                                <label for="email" class="form-label hidden">Email Address</label>
                                <InputText type="email" id="email" v-model="email" class="form-control" required placeholder="Email Address"/>
                            </div>
                            <Button 
                                type="submit"
                                :disabled="loading"
                                :loading="loading"
                                label="BUY NOW"
                                class="btn btn-primary w-100">
                            </Button>
                            <p v-if="errorReason">
                                {{ errorReason }}
                            </p>
                        </form>
                    </Panel>
                </div>
            </div>
            <div class="row justify-content-center mb-4">
                <div class="col-12 col-md-6 text-center">
                    <h1 class="mb-4">How Does It Work?</h1>
                    <Timeline :value="steps" class="eq-steps w-100" align="left">
                        <template #content="slotProps">
                            <p v-html="slotProps.item.status">
                            </p>
                        </template>
                    </Timeline>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-12 col-md-6 text-center">
                    <p class=" mb-4">
                        Each clue will have a fun riddle to help guide your kids and betwen each scavenger hunt is a fun game they play on your phone or tablet. 
                    </p>
                </div>
            </div>
        </div>
        <img :src="grass" class="grass d-block d-md-none" 
            :style="grassStyle"
            :class="[ this.calculatedValue == 0 ? 'grass-static' : 'grass-float']"/>
    </div>
</template>
<script>
import logo from '@/assets/logo.png';
import leavesLeft from '@/assets/accents/leaves_left.png';
import leavesRight from '@/assets/accents/leaves_right.png';
import grass from '@/assets/accents/grass.png';
import { checkout, getLoginState } from '@/services/api.service';

export default {
    name: 'HomeView',
    data() {
        return {
            errorReason: null,
            logo,
            leavesLeft,
            leavesRight,
            grass,
            email: '',
            loading: false,
            calculatedValue: 42,
            steps: [
                {
                    status: 'After signing up, choose where you want to hide scavenger hunt clues. <br/> (1 minute)'
                },
                {
                    status: 'Have the Easter Bunny hide something in those locations as a prize (candy, an egg, a sticker, etc) so your kids know they found the right spot.'
                },
                {
                    status: 'Click the PLAY button and join the fun with your kids.'
                }
            ]
        }
    },
    computed: {
        grassStyle() {
            if (this.calculatedValue === 0) {
                return {};
            }
            return {
                top: `calc(100vh - ${this.calculatedValue}vw)`,
            };
        },
},
    async mounted() {
        window.addEventListener("scroll", this.handleScroll);
        this.checkLogin();
    },
        
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        async checkLogin() {
            const state = await getLoginState();
            if (state.isLoggedIn) {
                this.$toast.add({ 
                        severity: 'success', 
                        summary: 'Continue building your Easter Quest' });
            }
        },
        async checkout() {
            try {
                this.loading = true;
                this.errorReason = null;
                const data = {
                    email: this.email,
                    password: this.password,
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
                        }, 1000);
                    }
                }
            } catch (error) {
                this.loading = false;
                console.error('Error registering user:', error);
            }
        },
        handleScroll() {
            const scrollTop = window.scrollY;
            const startScroll = 50;
            const maxScroll = 400;
            if (scrollTop <= startScroll) {
                this.calculatedValue = 42;
            } else if (scrollTop >= maxScroll) {
                this.calculatedValue = 0;
            } else {
                // Linearly interpolate between 42 and 0, starting from 100px
                const progress = (scrollTop - startScroll) / (maxScroll - startScroll);
                this.calculatedValue = 42 * (1 - progress);
            }
        }
    },
}
</script>
<style lang="scss">
.eq-steps  {
    .p-timeline-event-opposite {
        flex: 0;
    }
}

.eq-content {
    position: relative;
    z-index: 1;
}

.leaves {
    position: absolute;
    z-index: 0;
    width: 100%;
    max-width: 150px;
    pointer-events: none;
    @media screen and (min-width: 768px) {
        max-width: 200px;
    }

    &.leaves-left {
        left: 0;
        top: 0;
    }
    &.leaves-right {
        right: 0;
        top: 0;
    }
}

.grass {
    position: fixed;
    z-index: 2;
    pointer-events: none;
    width: 100%;
    max-width: 100%;
    left: 0;

    &.grass-static {
        position: relative;
    }
}
</style>