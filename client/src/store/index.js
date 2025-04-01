
import { createStore } from 'vuex'

const store = createStore({
    state () {
      return {
        examples: [],
        myQuests: null,
      }
    },
    mutations: {
      SET_EXAMPLES(state, examples) {
        state.examples = examples;
      },
      SET_QUESTS(state, quests) {
        state.myQuests = quests;
      },
      UPDATE_QUEST(state, quest) {
        const index = state.myQuests.findIndex(x => x.id == quest.id);
        state.myQuests.splice(index, 1, quest);
      }
    },
    getters: {
      getExamples: (state) => state.examples ?? [],
      getMyQuests: (state) => state.myQuests ?? []
    }
  })

  export default store;
  