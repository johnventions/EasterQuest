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

                            <Button type="submit"
                                class="w-100"
                                :disabled="loading"
                                :loading="loading"
                                label="Register"
                            />
                            <p v-if="errorMessage">
                                {{  errorMessage  }}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { registerUser } from '@/services/api.service';
import { mapMutations } from 'vuex';
import logo from '@/assets/logo.png';

export default {
    name: 'RegisterPage',
    data() {
        return {
            logo,
            source: 0,
            accessCode: '',
            email: '',
            password: '',
            errorMessage: null,
            loading: false,
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
                this.errorMessage = null;
                this.loading = true;
                const data = {
                    email: this.email,
                    password: this.password,
                    access_code: this.accessCode,
                    source: this.source
                }
                const response = await registerUser(data);
                if (response.userId != null) {
                    this.setLogin(response);
                    this.$router.push({ name: 'Dashboard' });
                } else {
                    this.errorMessage = response.error;
                    if (response.error == 'User already exists') {
                        setTimeout(() => {
                            this.$router.push({name: 'Login'});
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('Error registering user:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>