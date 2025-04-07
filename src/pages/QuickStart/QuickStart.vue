<template>
    <div class="p-4">
        <div v-if="step == 1">
            <h1>Lets Get Started</h1>
            <p>
                From the list below, select the locations you would be able to hide a scaveger hunt clue (for example: an egg, candy, sticker, toy, etc).
            </p>
            <p>
                (You can change or add more to this list later)
            </p>
            <div v-for="category of quickStartExamples"     
                :key="category.id"
                class="flex items-center gap-4 mb-2">
                <Checkbox 
                    v-model="selectedCategories" 
                    :inputId="`checkbox__${category.id}`" 
                    name="category" 
                    :value="category.id" />
                <label 
                    :for="`checkbox__${category.id}`" 
                    class="px-2">
                    {{ category.title }}
                </label>
            </div>
            <Button 
                class="mt-4 w-100 d-block" 
                :disabled="(selectedCategories?.length ?? 0) == 0"
                @click="setCategories">
                Next
            </Button>
        </div>
        <div v-if="step == 2">
            <h2 class="mb-4">
                Finishing touches
            </h2>
            <div class="d-flex gap-2">
                <div>
                    <ToggleSwitch v-model="personalize" />
                </div>
                <p>
                    Personalize my quest with my child's name(s) below:
                </p>
            </div>
            <InputText 
                class="d-block w-100 mb-4"
                :disabled="personalize == false"
                type="text" 
                v-model="childName" placeholder="Names" />
            <div class="d-flex gap-2">
                <div>
                    <ToggleSwitch v-model="addGames" />
                </div>
                <p>
                    Add some simple games to my Easter Quest
                </p>
            </div>
            <Button 
                class="mt-4 w-100 d-block" 
                @click="setPreferences">
                Next
            </Button>
        </div>
        <div v-if="step == 3">
            <h3>Building your Easter Quest..</h3>
        </div>
    </div>
</template>
<script>
import { createQuests } from '@/services/api.service';
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'QuickStart',
    data () {
        return {
            step: 1,
            selectedCategories: null,
            personalize: true,
            childName: null,
            addGames: true,
        }
    },
    mounted() {
        const selectedCount = (this.selectedCategories?.length ?? 0);
        if (this.$route.name != 'Setup' &&  selectedCount == 0) {
            this.$router.push({name: 'Setup'});
        }
    },
    watch: {
        $route(to) {
            if (to.name == 'Setup') {
                this.step = 1;
            }
        }
    },
    computed: {
        ...mapGetters(['getExamples']),
        quickStartExamples() {
            return this.getExamples.filter(x => x.suggested);
        }
    },
    methods: {
        ...mapMutations({
            'setQuests': 'SET_QUESTS'
        }),
        setCategories() {
            this.step = 2;
            this.$router.push({name: 'Step2'});
        },
        setPreferences() {
            const n = (this.childName ?? '').trim();
            if(n == '') {
                this.personalize = false;
                this.childName = null;
            }
            this.step = 3;
            this.$router.push({ name: 'EndSetup' });
            this.submit();
        },
        async submit() {
            try {
                const selectedIds = [
                    0,
                    ...this.selectedCategories, 
                    999
                ];
                const mapped = this.getExamples.filter(x => selectedIds.indexOf(x.id) > -1);
                for(let i = 0; i< mapped.length; i++) {
                    let bt = mapped[i].bodyText ?? '';
                    if (this.personalize) {
                        bt = bt.replace('{name}', this.childName);
                    } else {
                        bt = bt.replace('{name}', '');
                    }
                    mapped[i].bodyText = bt;
                }
                const quests = await createQuests(mapped);
                this.setQuests(quests);
                setTimeout(() => {
                    this.$router.push({ name: 'Dashboard'});
                }, 2500);
            } catch {
                console.error('Oh no');
            }
        }
    }
}
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>