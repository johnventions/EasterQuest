<template>
    <div class="container">
        <forgot-password v-model:active="forgotPasswordOpen"/>
        <div class="row justify-content-center">
            <div class="col-12 col-md-6 text-center">
                <img :src="logo" alt="Logo" class="logo mb-4 w-75 w-md-50"/>
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-md-6 offset-md-3 p-4">
                <div class="card">
                    <div class="card-header text-center">
                        <h3>Password Reset</h3>
                        <p>
                            Please pick a new password
                        </p>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <label for="password" class="form-label">New Password</label>
                                <InputText type="password" id="password" v-model="password" class="form-control" required />
                            </div>
                            <Button
                                :loading="loading"
                                type="submit"
                                label="Set Password"
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
import { resetPasswordFinish } from '@/services/api.service';
import logo from '@/assets/logo.png';

export default {
    name: 'ResetPassword',
    data() {
        return {
            logo,
            loading: false,
            password: '',
            errorMsg: null,
        };
    },
    mounted() {
    },
    methods: {
        async login() {
            try {
                const data = {
                    password: this.password,
                    selector: this.$route.query.selector,
                    token: this.$route.query.token,
                }
                this.loading = true;
                this.errorMsg = null;
                const response = await resetPasswordFinish(data);
                if (response.success) {
                    this.$router.push({ name: 'Login' });
                } else {
                    this.errorMsg = response.errorMsg;
                    this.loading = false;
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                this.errorMsg = 'Error resetting password';
                this.loading = false;
            }
        }
    }
};
</script>