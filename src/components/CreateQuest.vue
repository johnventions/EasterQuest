<template>
    <Dialog v-model:visible="localActive" modal>
        <div v-if="step == 1">
            <h1>
            What type of quest do you want to make?
            </h1>
            <Button class="d-block">
                Find It
            </Button>
            <Button  class="d-block">
                Do It
            </Button>
            <Button class="d-block">
                Play It
            </Button>
        </div>
    </Dialog>
</template>
<script>
export default {
    name: 'CreateQuest',
    props: {
        active: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            step: 1,
            type: null,
            localActive: false,
        }
    },
    watch: {
        localActive (newValue) {
            this.$emit('update:active', newValue);
        },
        active (newValue) {
            this.localActive = newValue;
        }
    }
}
</script>