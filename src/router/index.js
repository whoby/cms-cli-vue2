import Vue from 'vue'
import Router from 'vue-router'
import viewport from 'module/common/viewport.vue'
import main from 'module/common/main.vue'
import notFound from 'module/error/notFound.vue'

/* 基础模块 */
let login = resolve => require(['module/root/login.vue'], resolve)
let index = resolve => require(['module/root/index.vue'], resolve)

/* 用户管理 */
let userInfo = resolve => require(['module/user/info/list.vue'], resolve)
let userCode = resolve => require(['module/user/info/list.vue'], resolve)

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        title: '登录',
        path: '/login',
        component: login
    }, {
        title: '首页',
        path: '/index',
        component: index
    }, {
        path: '/page',
        component: viewport,
        children: [{
            title: '用户管理',
            path: '/page/user',
            redirect: '/page/user/info',
            component: main,
            children: [{
                title: '信息列表',
                path: '/page/user/info',
                component: userInfo
            }, {
                title: '推荐列表',
                path: '/page/user/code',
                redirect: '/page/user/code/list',
                component: main,
                children: [{
                    title: '子列表',
                    path: '/page/user/code/list',
                    component: userCode
                }]
            }]
        }]
    }, { // 404页面：必须位于最后，否则其它的路由地址都会使用 NotFound 组件
        path: '*',
        component: notFound
    }]
})
