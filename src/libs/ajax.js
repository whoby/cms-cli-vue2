import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

// 跨域允许传cookie
axios.defaults.credentials = true

// 自定义属性：是否以form格式提交（axios默认发送json格式）
axios.defaults.isFormType = false

Vue.prototype.ajax = axios

let doAction = function(type, url, params, callback, isNeedAll) {
    // 参数处理，get包一层
    if (type === 'get') {
        params = { params: params }
    } else {
        params = axios.defaults.isFormType ? qs.stringify(params) : params
    }

    // 请求主体
    return axios[type](url, params).then((response) => {
        // 拦截未登录状态
        let res = response.data.ret || response.data
        if (res.code && res.code === '-1999') {
            Message({
                type: 'warning',
                message: res.resultDes || '请先登录！',
                showClose: true
            })
            window.location.href = window.location.origin + '#/login'
            return
        }

        // 自定义处理结果
        if (isNeedAll) {
            callback(res)
        } else {
            if (res.success) {
                callback(res.result)
            } else {
                Message({
                    type: 'warning',
                    message: res.resultDes || '操作失败！',
                    showClose: true
                })
            }
        }
        return Promise.resolve(response)
    }).catch((error) => {
        Message({
            type: 'error',
            message: '接口错误，请检查！',
            showClose: true
        })
        return Promise.reject(error)
    })
}

export default {
    get() {
        return doAction('get', ...arguments)
    },
    post() {
        return doAction('post', ...arguments)
    },
    all() {
        return axios.all([...arguments]).then(axios.spread(function(...res) {
            return Promise.resolve(res)
        })).catch((error) => {
            return Promise.reject(error)
        })
    }
}
