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
    <div class="row"
            v-for="(quest, i) in getMyQuests" 
            :key="quest.id">
            <div class="col-12 col-md-8 offset-md-2">
              <quest-card
                :quest="quest" :index="i" />
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
    }
  },
  data() {
    return {
      createMenuOpen: false,
      shareModalOpen: false
    }
  },
}
</script>
