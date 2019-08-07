import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations.js';
import actions from './actions.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    money: 0,
    figures: ["J", "Q", "K", "A"],
    colors: ["diamond", "hearts", "spades", "Clubs"],
    deck: []
  },
  mutations,
  actions

})
