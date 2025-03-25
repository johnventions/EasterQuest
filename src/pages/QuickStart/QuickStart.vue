<template>
    <div class="p-4">
        <Transition name="slide-fade" mode="out-in">
            <div v-if="step == 1">
                <h1>Lets Get Started</h1>
                <p>
                    From the list below, select the locations you would be able to hide a scaveger hunt clue (for example: an egg, candy, sticker, toy, etc).
                </p>
                <p>
                    (You can change or add more to this list later)
                </p>
                <div v-for="category of categories"     
                    :key="category.id"
                    class="flex items-center gap-4 mb-2">
                    <Checkbox 
                        v-model="selectedCategories" 
                        :inputId="`checkbox__${category.id}`" 
                        name="category" 
                        :value="category.name" />
                    <label 
                        :for="`checkbox__${category.id}`" 
                        class="px-2">
                        {{ category.name }}
                    </label>
                </div>
                <Button 
                    class="mt-4 w-100 d-block" 
                    @click="setCategories">
                    Next
                </Button>
            </div>
        </Transition>
        <Transition name="slide-fade" mode="out-in">
            <div v-if="step == 2">
                <h2 class="mb-4">
                    Finishing touches
                </h2>
                <div class="d-flex gap-2">
                    <div>
                        <ToggleSwitch v-model="personalize" />
                    </div>
                    <p>
                        I would like to personalize the quest with my child's name(s)?
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
        </Transition>
    </div>
</template>
<script>
export default {
    name: 'QuickStart',
    data () {
        return {
            step: 1,
            selectedCategories: null,
            categories: [
                { id: 1, name: 'In the Fridge'},
                { id: 2, name: 'Under a pillow' },
                { id: 3, name: 'In the Mailbox' },
                { id: 4, name: 'In the Freezer' },
                { id: 5, name: 'In a Shoe' },
                { id: 6, name: 'Behind the TV' },
                { id: 7, name: 'In a Sock Drawer' },
                { id: 8, name: 'In a Cereal Box' },
                { id: 9, name: 'In the Bathroom' },
                { id: 10, name: 'On a Book Shelf' },
            ],
            personalize: true,
            childName: null,
            addGames: true,
        }
    },
    methods: {
        setCategories() {
            this.step = 2;
        },
        setPreferences() {
            const n = (this.childName ?? '').trim();
            if(n == '') {
                this.personalize = false;
                this.childName = null;
            }
            this.step = 3;
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