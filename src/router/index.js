import Vue from 'vue'
import Router from 'vue-router'
import viewport from 'module/common/viewport.vue'
import main from 'module/common/main.vue'
import notFound from 'module/error/notFound.vue'

/* 基础模块 */
let login = resolve => require(['module/root/login.vue'], resolve)
let index = resolve => require(['module/root/index.vue'], resolve)

/* 消息管理 */
let account = resolve => require(['module/msg/account/account.vue'], resolve)
let group = resolve => require(['module/msg/group/group.vue'], resolve)

/* 系统设置 */
let person = resolve => require(['module/setting/person/person.vue'], resolve)

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
            title: '消息管理',
            path: '/page/msg',
            redirect: '/page/msg/account',
            component: main,
            children: [{
                title: '用户列表',
                path: '/page/msg/account',
                component: account
            }, {
                title: '群发列表',
                path: '/page/msg/group',
                component: group
            }]
        }, {
            title: '系统设置',
            path: '/page/setting',
            redirect: '/page/setting/person',
            component: main,
            children: [{
                title: '人员管理',
                path: '/page/setting/person',
                component: person
            }]
        }]
    }, { // 404页面：必须位于最后，否则其它的路由地址都会使用 NotFound 组件
        path: '*',
        component: notFound
    }]
})
