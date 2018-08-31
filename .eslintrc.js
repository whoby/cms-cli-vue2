module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'indent': ['warn', 4, { 'SwitchCase': 1 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 禁止函数圆括号之前有一个空格
        'space-before-function-paren': ['error', 'never']
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
