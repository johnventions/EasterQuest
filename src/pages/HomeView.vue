<template>
    <div class="container">
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
                    With Easter Quest, you and your kids can go on a digital scavenger hunt <strong><i>AND</i></strong> play fun games along the way.
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
                        <button type="submit" class="btn btn-primary w-100">BUY NOW</button>
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
</template>
<script>
import logo from '@/assets/logo.png';
import { checkout, getLoginState } from '@/services/api.service';

export default {
    name: 'HomeView',
    data() {
        return {
            logo,
            email: '',
            loading: false,
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
    async mounted() {
        getLoginState();
    },
    methods: {
        async checkout() {
            try {
                this.loading = true;
                const data = {
                    email: this.email,
                    password: this.password,
                }
                const response = await checkout(data);
                if (response.success) {
                    window.location.href = response.url; // Redirect to the checkout page
                } else {
                    console.error('Checkout failed:', response.message);
                }
            } catch (error) {
                this.loading = false;
                console.error('Error registering user:', error);
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
</style>