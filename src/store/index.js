import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let menuList = sessionStorage.getItem('menuList')

export default new Vuex.Store({
    state: {
        userName: sessionStorage.getItem('userName') || '',
        menuList: (menuList && JSON.parse(menuList)) || []
    },
    mutations: {
        setUserName(state, data) {
            state.userName = data
            sessionStorage.setItem('userName', data)
        },
        setMenuList(state, data) {
            state.menuList = data
            sessionStorage.setItem('menuList', JSON.stringify(data))
        }
    }
})
