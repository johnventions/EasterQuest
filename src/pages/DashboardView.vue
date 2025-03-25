<template>
    <div class="p-2">
    <Button class="d-block w-100 mb-2">
      + Play Your Quest
    </Button>
    <Button 
      class="d-block w-100 mb-2"
      @click="() => createMenuOpen = true">
    + Add New Quest
    </Button>
    <create-quest v-model:active="createMenuOpen" />
  </div>
</template>
<script>
import CreateQuest from '../components/CreateQuest.vue';

export default {
  name: 'DashboardView',
  components: {
    'create-quest': CreateQuest
  },
  data() {
    return {
      createMenuOpen: false,
    }
  }
}
</script>
