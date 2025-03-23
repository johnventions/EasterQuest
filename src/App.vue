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
  </div>
  <create-quest v-model:active="createMenuOpen" />
</template>

<script>
import CreateQuest from './components/CreateQuest.vue';
export default {
  name: 'App',
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
