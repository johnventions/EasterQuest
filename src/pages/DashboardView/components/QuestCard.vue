<template>
    <Panel class="w-100 mb-2">
        <template #header>
            <div class="d-flex">
                <InputText v-if="editMode && quest?.type == 1" v-model="titleEdit" />
                <template v-else>
                    <h4>
                    <template v-if="index">
                        #{{index}}&nbsp;-
                    </template>{{ quest.title }}
                    </h4>
                </template>
            </div>
        </template>
        <Textarea
            v-if="editMode && quest?.type < 2"
            class="w-100"
            rows="5"
            v-model="bodyTextEdit" />
        <Select
            v-if="editMode && quest?.type > 1"
            class="w-100"
            :options="examplesBytype"
            @change="handleTemplateSelect"
            option-label="title"
            option-value="id"
            v-model="templateIdEdit" />
        <p class="m-0" v-if="!editMode">
            {{ quest.bodyText }}
        </p>
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
                    <Button
                        v-if="quest.type != 0"
                        severity="danger" 
                        text 
                        @click="deleteQuest">
                        Delete
                    </Button>
                </div>
            </div>
        </template>
    </Panel>
</template>
<script>
import { updateQuest, deleteQuest } from '@/services/api.service';
import { mapMutations, mapGetters } from 'vuex';

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
    computed: {
        ...mapGetters(['getExamples']),
        examplesBytype() {
            return this.getExamples.filter(x => x.type == this.quest.type);
        }
    },
    data() {
        return {
            editMode: false,
            loading: false,
            bodyTextEdit: '',
            titleEdit: '',
            templateIdEdit: 0,
        }
    },
    mounted() {
        this.resetEdits();
    },
    methods: {
        ...mapMutations({
            'updateQuestList': 'UPDATE_QUEST',
            'deleteQuestById': 'DELETE_QUEST',

        }),
        handleTemplateSelect() {
            const selected = this.getExamples.find(x => x.id == this.templateIdEdit);
            if (selected) {
                this.bodyTextEdit = selected.bodyText;
                this.titleEdit = selected.title;
                this.templateIdEdit = selected.id
            }
        },
        resetEdits() {
            this.editMode = false;
            this.bodyTextEdit = this.quest.bodyText;
            this.titleEdit = this.quest.title;
            this.templateIdEdit = this.quest.templateId;
        },
        cancel() {
            this.resetEdits();
        },
        async save() {
            this.loading == true;
            const result = await updateQuest(this.quest.id, {
                bodyText: this.bodyTextEdit,
                title: this.titleEdit,
                templateId: this.templateIdEdit,
            });
            this.updateQuestList(result);
            this.editMode = false;
            this.loading = false;
        },
        async deleteQuest() {
            this.loading = true;
            await deleteQuest(this.quest.id);
            this.deleteQuestById(this.quest.id);
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