<template>
    <div class="row">
        <div class="col-12 col-md-6 offset-md-3 p-4">
            <div class="card">
                <div class="card-header text-center">
                    <h3>Login</h3>
                    <p>
                        Enter your login credentials below to continue building your Easter Quest
                    </p>
                </div>
                <div class="card-body">
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <InputText type="email" id="email" v-model="email" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <InputText type="password" id="password" v-model="password" class="form-control" required />
                        </div>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { loginUser } from '@/services/api.service';
import { mapMutations } from 'vuex';

export default {
    name: 'LoginPage',
    data() {
        return {
            email: '',
            password: ''
        };
    },
    mounted() {
    },
    methods: {
        ...mapMutations({
            'setLogin': 'SET_LOGIN_STATE',
        }),
        async login() {
            try {
                const data = {
                    email: this.email,
                    password: this.password,
                }
                const response = await loginUser(data);
                this.setLogin(response);
                this.$router.push({ name: 'Dashboard' });
                console.log('User registered successfully:', response.data);

            } catch (error) {
                console.error('Error registering user:', error);
            }
        }
    }
};
</script>