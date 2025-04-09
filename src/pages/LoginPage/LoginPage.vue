<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 text-center">
                <img :src="logo" alt="Logo" class="logo mb-4 w-75 w-md-50"/>
            </div>
        </div>
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
                            <Button
                                :loading="loading"
                                type="submit"
                                label="Login"
                                class="w-100"
                            />
                            <div v-if="errorMsg">
                                {{ errorMsg }}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { loginUser } from '@/services/api.service';
import { mapMutations } from 'vuex';
import logo from '@/assets/logo.png';

export default {
    name: 'LoginPage',
    data() {
        return {
            logo,
            loading: false,
            email: '',
            password: '',
            errorMsg: null,
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
                this.loading = true;
                this.errorMsg = null;
                const response = await loginUser(data);
                if (response.isLoggedIn) {
                    this.setLogin(response);
                    this.$router.push({ name: 'Dashboard' });
                } else {
                    this.errorMsg = response.error;
                    this.loading = false;
                }
            } catch (error) {
                console.error('Error registering user:', error);
                this.loading = false;
            }
        }
    }
};
</script>