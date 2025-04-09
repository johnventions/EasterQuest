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
            <h2 v-if="type == 1">
                Choose a pre-made template below or make your own
            </h2>
            <h2 v-if="type == 3">
                Choose a game
            </h2>
            <Select
                v-model="selectedTemplate"
                @change="handleTemplateSelect"
                :options="allowedForType"
                option-label="title"
                option-value="id"
                class="w-100 mb-4"
                filter
            />
            <Button @click="makeCustom" text v-if="type != 3">
                Make My Own
            </Button>
            <Button
                v-if="type == 3"
                :loading="loading"
                class="d-block w-75 mb-2"
                @click="saveQuest()"
            >
                SAVE
            </Button>
        </div>
        <div v-else-if="step == 3">
            <template v-if="type != 3">
                <h2>Find Something</h2>
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
            </template>
            <Button
                class="d-block w-75 mb-2"
                :loading="loading"
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
            type: 1,
            localActive: false,
            quest: {},
            selectedTemplate: null,
            loading: false,
        }
    },
    computed: {
        ...mapGetters(['getExamples', 'getMyQuests']),
        allowedForType() {
            return this.getExamples.filter(x => x.type == this.type);
        },
        maxQuestOrder() {
            const f = this.getMyQuests.filter(x => x.type != 0).map(x => x.itemOrder);
            return f.length ? Math.max(...f) + 1 : 1;
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
            const selected = this.allowedForType.find(x => x.id == this.selectedTemplate);
            if (selected) {
                this.quest = { ...selected };
                if (this.type != 3) {
                    this.step = 3;
                }
            }
        },
        async saveQuest() {
            try {
                this.loading = true;
                const questData = [{
                    ...this.quest,
                    type: this.type,
                    itemOrder: this.maxQuestOrder
                }];
                const response = await createQuests(questData);
                if (response != null) {
                    this.addQuests(response);
                    this.localActive = false;
                } else {
                    console.error('Error creating quest:', response.statusText);
                    this.loading = true;
                }
            } catch (error) {
                console.error('Error creating quest:', error);
                this.loading = true;
            }
        }
    }
}
</script>