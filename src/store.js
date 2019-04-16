import Vue from 'vue'
import Vuex from 'vuex'
import { fetchItem } from './api'
Vue.use(Vuex)

export function createStore() {
  return new Vuex.Store({
    state: {
      items: []
    },
    mutations: {
      setItem(state, { item }) {
        Vue.set(state.items, item)
      }
    },
    actions: {
      fetchItem({ commit }) {
        return fetchItem().then(item => {
          commit('setItem', item)
        })
      }
    }
  });
}
