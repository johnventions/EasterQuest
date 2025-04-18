<template>
    <Dialog
        header="Welcome!"
        v-model:visible="localActive" modal>
        <div class=text-center>
            <h2>Thank you for buying Easter Quest</h2>
            <p>
                We have created an account for you and your default password is:
                <br/>
                <strong>easterquest2025</strong>
            </p>
            <p>
                Before getting started, you can create a new password below:
            </p>
            <Password
                type="password"
                name="password"
                class="mb-2"
                toggleMask
                :feedback="false"
                v-model="newPassword"
                placeholder="New Password" />
            <Button 
                class="mt-4 w-100 d-block" 
                :loading="loading"
                @click="setPassword">
                Set Password
            </Button>
            <p v-if="errorMsg">
                {{ errorMsg }}
            </p>
        </div>
    </Dialog>
</template>
<script>
import { updatePassword } from '@/services/api.service';

export default {
    name: 'PaymentThankYou',
    props: {
        active: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            newPassword: '',
            localActive: false,
            loading: false,
            errorMsg: null,
        }
    },
    watch: {
        localActive (newValue) {
            this.$emit('update:active', newValue);
        },
        active (newValue) {
            this.localActive = newValue;
            this.step = 1;
        }
    },
    methods: {
        async setPassword() {
            try {
                this.loading = true;
                const response = await updatePassword({ password: this.newPassword});
                if (response.success) {
                    this.localActive = false;
                } else {
                    this.errorMsg = 'Could not change password';
                    this.loading = false;
                }
            } catch (error) {
                console.error('Error updating password:', error);
                this.errorMsg = 'Could not change password';
                this.loading = false;
            }
        }
    }
}
</script>