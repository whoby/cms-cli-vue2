/**
 * global plugin js
 * @use in main.js
 */

import ajax from './ajax'
import util from './util'

export default function(Vue, opts) {
    // 全局ajax
    Vue.prototype.ajax = ajax

    // 全局util
    Vue.prototype.util = util
}
