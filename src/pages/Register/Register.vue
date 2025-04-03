<template>
    <div class="row">
        <div class="col-12 col-md-6 offset-md-3 p-4">
            <div class="card">
                <div class="card-header text-center" v-if="forceRegister">
                    <h3>Thank you for joining Easter Quest</h3>
                    <p>
                        To start building your Easter Quest, please create an account and password
                    </p>
                </div>
                <div class="card-body">
                    <form @submit.prevent="registerUser">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <InputText type="email" id="email" v-model="email" class="form-control" required />
                        </div>
                        <div class="mb-3" v-if="forceRegister">
                            <label for="access_code" class="form-label">Access Code</label>
                            <InputText type="text" id="access_code" v-model="accessCode" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <InputText type="password" id="password" v-model="password" class="form-control" required />
                        </div>
                        <button type="submit" class="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { registerUser } from '@/services/api.service';
import { mapMutations } from 'vuex';

export default {
    name: 'RegisterPage',
    data() {
        return {
            source: 0,
            accessCode: '',
            email: '',
            password: ''
        };
    },
    computed: {
        forceRegister() {
            return this.$route.meta.forceRegister ?? false;
        }
    },
    mounted() {
    },
    methods: {
        ...mapMutations({
            'setLogin': 'SET_LOGIN_STATE',
        }),
        async registerUser() {
            try {
                const data = {
                    email: this.email,
                    password: this.password,
                    access_code: this.accessCode,
                    source: this.source
                }
                const response = await registerUser(data);
                this.setLogin(response);
                this.$router.push({ name: 'Dashboard' });
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }
    }
};
</script>