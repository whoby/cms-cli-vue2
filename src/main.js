// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import Global from './libs/global'
import 'assets/style/theme.scss'
import 'assets/style/style.scss'

Vue.config.productionTip = false

Vue.use(Element)
Vue.use(Global)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
