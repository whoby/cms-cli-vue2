const RAP = 'http://rap2api.taobao.org/app/mock/14718'

module.exports = {
    publicPath: './', // js引用路径
    outputDir: './dist', // 打包路径
    assetsDir: 'static',
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch')
        // 设置路径别名
        const resolve = dir => require('path').join(__dirname, dir)
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('libs', resolve('src/libs'))
            .set('store', resolve('src/store'))
            .set('views', resolve('src/views'))
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        open: false,
        proxy: {
            '/api': {
                // logLevel: 'debug',
                target: '' || RAP, // ''中可代理任意服务，包括本地服务
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
