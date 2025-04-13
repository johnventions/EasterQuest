<template>
  <div class="container p-2">
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2 mb-4">
        <Button 
          class="d-block w-100 mb-2"
          @click="() => shareModalOpen = true">
        + Play Your Quest
        </Button>
        <hr />
        <Button 
          class="d-block w-100 mb-2"
          @click="() => createMenuOpen = true">
        + Add To Your Quest
        </Button>
      </div>
    </div>
    <Dialog
        v-model:visible="shareModalOpen" modal>
        <div>
          <Button asChild v-slot="slotProps">
            <RouterLink to="/play/0" :class="slotProps.class" class="d-block w-100 mb-2 text-center">
              Click to Play Your Quest Now
            </RouterLink>
          </Button>
          <hr/>
          <p>
            Or use the below URL to play your quest on another device.
            <a href="shareUrl" target="_blank" class="d-block">
              {{ shareUrl}}
            </a>
            <img :src="qrCodePath" alt="QR Code" class="qr-code" />
          </p>
        </div>
    </Dialog>
    <div class="row">
      <div class="col-12 col-md-8 offset-md-2">
          <TransitionGroup tag="div" name="fade">
            <div class="row"
              v-for="(quest, i) in getMyQuests" 
              :key="quest.id">
              <div class="col-1 d-flex flex-row gap-2">
                <Button icon="pi pi-arrow-circle-up"
                  @click="moveUp(i)"
                  size="small"
                  aria-label="Move Up" />
                <Button icon="pi pi-arrow-circle-down"
                  @click="moveDown(i)"
                  size="small"
                  aria-label="Move Down" />
              </div>
              <div class="col-11">
                <quest-card
                  :quest="quest" :index="i" />
              </div>
            </div>
        </TransitionGroup>
      </div>
    </div>
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
    ...mapGetters(['getMyQuests', 'getShareCode']),
    shareUrl() {
      return `${window.location.origin}/share/${this.getShareCode}`;
    },
    qrCodePath() {
      return `/api/qr-code/${this.getShareCode}`;
    },
    orderedQuests() {
      return [...this.getMyQuests].sort((a, b) => a.displayOrder - b.displayOrder)
    }
  },
  data() {
    return {
      createMenuOpen: false,
      shareModalOpen: false
    }
  },
  methods: {
    moveUp(i) {
      console.log(i);
    },
    moveDown(i) {
      console.log(i);
    }
  }
}
</script>
<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
