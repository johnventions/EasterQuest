
import { createStore } from 'vuex'

const store = createStore({
    state () {
      return {
        isLoggedIn: null,
        userId: null,
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
      ADD_QUESTS(state, quests) {
        state.myQuests = [...state.myQuests, ...quests];

      },
      UPDATE_QUEST(state, quest) {
        const index = state.myQuests.findIndex(x => x.id == quest.id);
        state.myQuests.splice(index, 1, quest);
      },
      SET_LOGIN_STATE(state, loginState) {
        state.isLoggedIn = loginState.isLoggedIn;
        state.user = loginState.userId;
      },
    },
    getters: {
      getExamples: (state) => state.examples ?? [],
      getMyQuests: (state) => state.myQuests ?? [],
      getIsLoggedIn: (state) => state.isLoggedIn ?? [],
    }
  })

  export default store;
  