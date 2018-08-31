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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
