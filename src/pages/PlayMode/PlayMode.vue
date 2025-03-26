<template>
    <div class="text-center" v-if="activeQuest">
        <h2>
            {{ activeQuest.title}}
        </h2>
        <p>
            {{ activeQuest.bodyText }}
        </p>
        <Button asChild v-slot="slotProps">
        <RouterLink :to="nextPath" :class="slotProps.class" class="d-block w-100 mb-2 text-center">
          Next
        </RouterLink>
      </Button>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PlayMode',
    computed: {
        ...mapGetters(['getMyQuests']),
        activeIndex() {
            const { id } = this.$route.params;
            return parseInt(id);
        },
        activeQuest() {
            if (this.activeIndex < this.getMyQuests.length) {
                return this.getMyQuests[this.activeIndex];
            }
            return null;
        },
        nextPath() {
            return `/play/${this.activeIndex + 1}`;
        }
    }
}
</script>
<style lang="scss" scoped>
    p {
        white-space: pre;
    }
</style>