import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let menuList = sessionStorage.getItem('menuList')

export default new Vuex.Store({
    state: {
        username: sessionStorage.getItem('username') || '',
        menuList: (menuList && JSON.parse(menuList)) || []
    },
    mutations: {
        setUsername(state, data) {
            state.username = data
            sessionStorage.setItem('username', data)
        },
        setMenuList(state, data) {
            state.menuList = data
            sessionStorage.setItem('menuList', JSON.stringify(data))
        }
    }
})
