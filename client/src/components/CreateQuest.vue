<template>
    <Dialog v-model:visible="localActive" modal>
        <div v-if="step == 1" class="text-center">
            <h1>
            What type of quest do you want to make?
            </h1>
            <div class="d-flex flex-column align-items-center">
                <Button class="d-block w-75 mb-2"
                    @click="setType(1)"
                >
                    Find It
                </Button>
                <Button  class="d-block w-75 mb-2"
                    @click="setType(2)"
                >
                    Do It
                </Button>
                <Button class="d-block w-75 mb-2"
                    @click="setType(3)"
                >
                    Play It
                </Button>
            </div>
        </div>
        
        <div v-else-if="step == 2">
            <h2>
                Choose a pre-made search below or make your own
            </h2>
            <Button @click="makeCustom">
                Make My Own
            </Button>
        </div>
        <div v-else-if="step == 3">
            <InputText type="text" v-model="quest.title" placeholder="Title" />
            <Textarea v-model="quest.message" rows="5" cols="30" placeholder="Message" />
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
            quest: {},
        }
    },
    watch: {
        localActive (newValue) {
            this.$emit('update:active', newValue);
        },
        active (newValue) {
            this.localActive = newValue;
        }
    },
    methods: {
        setType(t) {
            this.type = t;
            this.step = 2;
        },
        makeCustom() {
            this.quest = {};
            this.step = 3;
        }
    }
}
</script>