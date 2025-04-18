<template>
    <Dialog
        header="Password Reset"
        v-model:visible="localActive" modal>
        <div class=text-center v-if="step == 1">
            <p>
                Enter your email below to reset your password
            </p>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <InputText type="email" id="email" v-model="email" class="form-control" required />
            </div>
            <Button 
                class="mt-4 w-100 d-block" 
                :loading="loading"
                @click="resetPassword">
                Reset Password
            </Button>
            <p v-if="errorMsg">
                {{ errorMsg }}
            </p>
        </div>
        <div class=text-center v-if="step == 2">
            <p>
                Please check your email to reset your password 🐰
            </p>
        </div>
    </Dialog>
</template>
<script>
import { resetPasswordInit } from '@/services/api.service';

export default {
    name: 'ForgotPassword',
    props: {
        active: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            email: null,
            localActive: false,
            loading: false,
            errorMsg: null,
            step: 1,
        }
    },
    watch: {
        localActive (newValue) {
            console.log(newValue);
            this.$emit('update:active', newValue);
        },
        active (newValue) {
            this.localActive = newValue;
            this.step = 1;
        }
    },
    methods: {
        async resetPassword() {
            try {
                this.loading = true;
                const response = await resetPasswordInit({ email: this.email});
                if (response.success) {
                    this.step = 2;
                } else {
                    this.errorMsg = response.errorMsg ?? 'Could not reset password';
                    this.loading = false;
                }
            } catch (error) {
                console.error('Error resetting password:', error);
                this.errorMsg = 'Could not reset password';
                this.loading = false;
            }
        }
    }
}
</script>