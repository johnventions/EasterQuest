<template>
  <RouterView />
</template>
<script>
import { getExamples } from '@/services/api.service';
import { mapMutations } from 'vuex';

export default {
  name: 'App',
  async created() {
    const e = await getExamples();
    this.setExamples(e.data);
  },
  methods: {
    ...mapMutations({
      'setExamples': 'SET_EXAMPLES'
    })
  }
}
</script>

<style lang="scss">
@import 'primeicons/primeicons.css';

body {
  min-height: 100vh;
  background: #5ec0c7;
  background-image: radial-gradient(farthest-corner at 50vw 80vh, #e2fdff 0%, #5ec0c7 100%);
}

a.p-button {
  text-decoration: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-family: "Josefin Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Yeseva One", serif;
  font-weight: 400;
  font-style: normal;
}

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

.hidden {
    position:absolute;
    left:-10000px;
    top:auto;
    width:1px;
    height:1px;
    overflow:hidden;
}

.p-toast, .p-dialog {
  max-width: calc(100vw - 40px);
}

</style>
