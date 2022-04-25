import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userName: '',
        menuList: [],
        breadNames: [],
        provinces: []
    },
    mutations: {
        setUserName(state, data) {
            state.userName = data
        },
        setMenuList(state, data) {
            state.menuList = data
        },
        setBreadNames(state, data) {
            state.breadNames = data
        },
        setProvinces(state, data) {
            state.provinces = data
        }
    },
    modules: {},
    plugins: [
        createPersistedState({
            storage: window.localStorage
        })
    ]
})
