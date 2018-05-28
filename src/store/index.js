import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let menuList = sessionStorage.getItem('menuList')
let provinces = localStorage.getItem('provinces')

export default new Vuex.Store({
    state: {
        userName: sessionStorage.getItem('userName') || '',
        menuList: (menuList && JSON.parse(menuList)) || [],
        provinces: (provinces && JSON.parse(provinces)) || []
    },
    mutations: {
        setUserName(state, data) {
            state.userName = data
            sessionStorage.setItem('userName', data)
        },
        setMenuList(state, data) {
            state.menuList = data
            sessionStorage.setItem('menuList', JSON.stringify(data))
        },
        setProvinces(state, data) {
            state.provinces = data
            localStorage.setItem('provinces', JSON.stringify(data))
        }
    }
})
