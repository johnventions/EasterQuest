<template>
    <Dialog
        v-model:visible="localActive" modal>
        <div v-if="step == 1" class="text-center">
            <h1>
            What type of quest do you want to make?
            </h1>
            <div class="d-flex flex-column align-items-center">
                <Button class="d-block w-75 mb-2"
                    @click="setType(1)"
                >
                    Find Something
                </Button>
                <Button  class="d-block w-75 mb-2"
                    @click="setType(2)"
                >
                    Do Something
                </Button>
                <Button class="d-block w-75 mb-2"
                    @click="setType(3)"
                >
                    Play Something
                </Button>
            </div>
        </div>
        
        <div v-else-if="step == 2">
            <h2>
                Choose a pre-made template below or make your own
            </h2>
            <Select
                v-model="selectedTemplate"
                @change="handleTemplateSelect"
                :options="findIts"
                option-label="title"
                option-value="id"
                class="w-100 mb-4"
                filter
            />
            <Button @click="makeCustom" text>
                Make My Own
            </Button>
        </div>
        <div v-else-if="step == 3">
            <InputText
                type="text"
                class="w-100 mb-2"
                v-model="quest.title"
                placeholder="Title" />
            <Textarea
                v-model="quest.bodyText"
                class="w-100 mb-2"
                rows="5" 
                cols="30"
                placeholder="Message" />
            <Button
                class="d-block w-75 mb-2"
                @click="saveQuest()"
            >
                SAVE
            </Button>
        </div>
    </Dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import { createQuests } from '@/services/api.service';

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
            selectedTemplate: null,
        }
    },
    computed: {
        ...mapGetters(['getExamples']),
        findIts() {
            return this.getExamples.filter(x => x.type == 1);
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
        ...mapMutations({
            'addQuests': 'ADD_QUESTS'
        }),
        setType(t) {
            this.type = t;
            this.step = 2;
        },
        makeCustom() {
            this.quest = {
                type: 1,
                order: 99
            };
            this.step = 3;
        },
        handleTemplateSelect() {
            const selected = this.findIts.find(x => x.id == this.selectedTemplate);
            if (selected) {
                this.quest = { ...selected };
                this.step = 3;
            }
        },
        async saveQuest() {
            try {
                const questData = [{
                    ...this.quest,
                    type: this.type,
                }];
                const response = await createQuests(questData);
                if (response.status === 200) {
                    this.addQuests(response.data);
                    this.localActive = false;
                } else {
                    console.error('Error creating quest:', response.statusText);
                }
            } catch (error) {
                console.error('Error creating quest:', error);
            }
        }
    }
}
</script>