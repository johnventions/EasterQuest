
import { createStore } from 'vuex';
import { updateQuestOrder } from '@/services/api.service';

const changeListOrder = (quests, i, offset) => {
  const j = i + offset;
  const copy = quests.map(q => ({ ...q }));
  // Check if the indices are within bounds
  if (i < 0 || j < 0 || i >= quests.length || j >= quests.length) {
    console.warn("Invalid index or offset");
    return;
  }

  // Swap displayOrder values
  const temp = copy[i].displayOrder;
  copy[i].displayOrder = copy[j].displayOrder;
  copy[j].displayOrder = temp;
  copy.sort((a, b) => a.displayOrder - b.displayOrder);
  console.log(copy);
  let changes = [];
  for (let k = 0; k < copy.length; k++) {
    if (copy[k].itemOrder != k) {
      copy[k].itemOrder = k;
      changes.push({ id: copy[k].id, itemOrder: k })
    }
  }
  return {
    quests: copy,
    changes
  }
}

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
        state.myQuests = quests;
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
    actions: {
      async swapOrder({ commit, state}, { index, offset }) {
        const { quests, changes } = changeListOrder(state.myQuests, index, offset);
        console.log(changes);
        commit('SET_QUESTS', quests);
        const result = await updateQuestOrder(changes);
        console.log(result);
      }
    },
    getters: {
      getExamples: (state) => state.examples ?? [],
      getMyQuests: (state) => state.myQuests ?? [],
      getIsLoggedIn: (state) => state.isLoggedIn ?? false,
      getShareCode: (state) => state.shareCode ?? '',
    }
  })

  export default store;
  