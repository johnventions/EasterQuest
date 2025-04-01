<template>
    <div class="p-2">
      <Button asChild v-slot="slotProps">
        <RouterLink to="/play/0" :class="slotProps.class" class="d-block w-100 mb-2 text-center">
          + Play Your Quest
        </RouterLink>
      </Button>
      <Button 
        class="d-block w-100 mb-2"
        @click="() => createMenuOpen = true">
      + Add New Quest
      </Button>
      <quest-card v-for="(quest, i) in getMyQuests" 
      :key="quest.id" :quest="quest" :index="i" />
      <create-quest v-model:active="createMenuOpen" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import CreateQuest from '../../components/CreateQuest.vue';
import QuestCard from './components/QuestCard.vue';

export default {
  name: 'DashboardView',
  components: {
    'create-quest': CreateQuest,
    'quest-card': QuestCard
  },
  computed: {
    ...mapGetters(['getMyQuests'])
  },
  data() {
    return {
      createMenuOpen: false,
    }
  }
}
</script>
