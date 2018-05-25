// const RAP_SERVICE = 'http://192.168.4.102:9999/mockjsdata/262' // 内网rap服务器
const RAP_SERVICE = 'http://rapapi.org/mockjsdata/9051' // 淘宝rap服务器

module.exports = {
    // RAP服务接口
    proxyTable: {
        '/api/**': RAP_SERVICE
    },

    // 数据接口开关, 开启：连接本地服役调试，关闭：启用Rap数据
    // proxyTarget: 'http://aymbk.aiyoumi.com',

    // 跨域cookie域名修改，注释掉将用ip启动，并修改cookie到本地ip域下
    // cookieDomain: 'aymbk-dev.aiyoumi.com'
}
