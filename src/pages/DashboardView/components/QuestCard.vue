<template>
    <Panel class="w-100 mb-2">
        <template #header>
            <div class="d-flex">
                <h4>

                    <template v-if="index">
                        #{{index}}&nbsp;-
                    </template>{{ quest.title }}
                </h4>
            </div>
        </template>
        <p class="m-0" v-if="!editMode">
            {{ quest.bodyText }}
        </p>
        <Textarea 
            v-if="editMode"
            class="w-100"
            rows="5"
            v-model="bodyTextEdit" />
        <template #footer>
            <div class="d-flex justify-content-between">
                <div>
                    <Button
                        v-if="editMode"
                        class="justify-self-start"
                        @click="save"
                        >
                        Save
                    </Button>
                </div>
                <div>
                    <Button
                        v-if="!editMode"
                        @click="() => editMode = true"
                        text
                        >
                        Edit
                    </Button>
                    <Button
                        v-if="editMode"
                        @click="cancel"
                        text
                        >
                        Cancel
                    </Button>
                    <Button severity="danger" text>
                        Delete
                    </Button>
                </div>
            </div>
        </template>
    </Panel>
</template>
<script>
import { updateQuest } from '@/services/api.service';
import { mapMutations } from 'vuex';

export default {
    name: 'QuestCard',
    props: {
        quest: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            editMode: false,
            loading: false,
            bodyTextEdit: ''
        }
    },
    mounted() {
        this.bodyTextEdit = this.quest.bodyText;
    },
    methods: {
        ...mapMutations({
            'updateQuestList': 'UPDATE_QUEST'
        }),
        cancel() {
            this.editMode = false;
            this.bodyTextEdit = this.quest.bodyText;
        },
        async save() {
            this.loading == true;
            const result = await updateQuest(this.quest.id, {
                bodyText: this.bodyTextEdit
            });
            this.updateQuestList(result);
            this.editMode = false;
            this.loading = false;
        }
    }
}
</script>
<style lang="scss" scoped>
    p {
        white-space: pre-wrap;
    }
</style>