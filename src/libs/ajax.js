import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

// 跨域允许传cookie
axios.defaults.credentials = true

Vue.prototype.ajax = axios

// isFormType = 'file' 时，可进行二进制form提交
const doAction = function(type, url, params, callback, isNeedAll = false, isFormType = false) {
    // 参数处理，get包一层
    if (type === 'get') {
        params = { params: params }
    } else {
        // 只有form（不包括multipart/form-data）类型用qs序列化，
        params = isFormType === true ? qs.stringify(params) : params
    }

    url = `/api${url}`

    // 请求主体
    return axios[type](url, params).then((response) => {
        // 拦截未登录状态
        let res = response.data.ret || response.data
        if (res.code && res.code === '-1999') {
            Message({
                type: 'warning',
                message: res.error.message || '请先登录！',
                showClose: true
            })
            window.location.href = window.location.origin + '#/login'
            return
        }

        // 回调函数里报错会上升到Promise，触发错误catch，所以用try处理
        try {
            // 自定义处理结果
            if (isNeedAll) {
                callback(res)
            } else if (res.success) {
                callback(res.data)
            } else {
                Message({
                    type: 'warning',
                    message: res.error || '数据返回错误！',
                    showClose: true
                })
            }
        } catch (e) {
            Message({
                type: 'error',
                message: String(e),
                showClose: true
            })
        }
        return Promise.resolve(response)
    }).catch((error) => {
        Message({
            type: 'error',
            message: `Code：[${error.response.status}]，接口错误，请检查！`,
            showClose: true
        })
        return Promise.reject(error)
    })
}

export default {
    get(...args) {
        return doAction('get', ...args)
    },
    post(...args) {
        return doAction('post', ...args)
    },
    all(...args) {
        return axios.all([...args]).then(axios.spread(function(...res) {
            return Promise.resolve(res)
        })).catch((error) => {
            return Promise.reject(error)
        })
    }
}
