
import { createStore } from 'vuex'

const store = createStore({
    state () {
      return {
        isLoggedIn: null,
        userId: null,
        shareCode: '',
        examples: [],
        myQuests: null,
      }
    },
    mutations: {
      SET_EXAMPLES(state, examples) {
        state.examples = examples;
      },
      SET_QUESTS(state, quests) {
        const ordered = quests.map((q, i) => ({
          ...q,
          displayOrder: i
        }))
        state.myQuests = ordered;
      },
      ADD_QUESTS(state, quests) {
        state.myQuests = [...state.myQuests, ...quests];
      },
      UPDATE_QUEST(state, quest) {
        const index = state.myQuests.findIndex(x => x.id == quest.id);
        state.myQuests.splice(index, 1, quest);
      },
      DELETE_QUEST(state, questId) {
        const index = state.myQuests.findIndex(x => x.id == questId);
        state.myQuests.splice(index, 1);
      },
      SET_LOGIN_STATE(state, loginState) {
        state.isLoggedIn = loginState.isLoggedIn;
        state.userId = loginState.userId;
        state.shareCode = loginState.shareId;
      },
    },
    getters: {
      getExamples: (state) => state.examples ?? [],
      getMyQuests: (state) => state.myQuests ?? [],
      getIsLoggedIn: (state) => state.isLoggedIn ?? false,
      getShareCode: (state) => state.shareCode ?? '',
    }
  })

  export default store;
  