<template>
    <div class="login-page">
        <div class="login-box" @keydown.enter="onLogin">
            <div class="logo">通用后台管理系统</div>
            <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-width="80px">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密 码：" prop="password">
                    <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="验证码：" prop="code" class="vcode">
                    <el-input v-model="loginForm.code" placeholder="请输入验证码" auto-complete="off"></el-input>
                    <img :src="vcode" alt="验证码" title="点击验证码" @click="changeVcode">
                </el-form-item>
                <el-form-item class="btn-wrap">
                    <el-button type="primary" @click="onLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    mounted() {
        this.$store.commit('setUsername', '')
    },
    data() {
        // 验证信息
        let validator = (rule, value, callback) => {
            if (value === '') {
                let info = {
                    username: '请输入用户名',
                    password: '请输入密码',
                    code: '请输入验证码'
                }
                callback(new Error(info[rule.field]))
            } else {
                callback()
            }
        }

        return {
            url: {
                login: '/api/doLogin'
            },
            loginForm: {
                username: '',
                password: '',
                code: ''
            },
            vcode: '/vcode',
            loginRules: {
                username: [{
                    validator: validator,
                    trigger: 'blur'
                }],
                password: [{
                    validator: validator,
                    trigger: 'blur'
                }],
                code: [{
                    validator: validator,
                    trigger: 'blur'
                }]
            }
        }
    },
    methods: {
        changeVcode: function() {
            this.vcode = '/vcode?rand=' + (new Date().getTime().toString(36))
        },
        onLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 加密
                    let params = {
                        username: this.loginForm.username,
                        password: this.util.encrypt(this.loginForm.password),
                        code: this.loginForm.code
                    }
                    this.ajax.post(this.url.login, params, (res) => {
                        if (res.success) {
                            // 保存登录信息
                            this.$store.commit('setUsername', this.loginForm.username)
                            this.$router.push('/index')
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.resultDes,
                                type: 'warning'
                            })

                            this.changeVcode()
                        }
                    }, true)
                } else {
                    console.log('表单填写不完整，请完善。')
                    return false
                }
            })
        }
    }
}
</script>
<style lang="scss">
.login-page {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    .login-box {
        width: 450px;
        margin: 180px auto;
        padding-right: 50px;
        text-align: center;
        .logo {
            display: inline-block;
            margin: 0 0 65px 50px;
            padding-top: 55px;
            width: 200px;
            height: 0;
            color: #fff;
            font-size: 23px;
            background: url(../../assets/img/login-logo.png) no-repeat center;
        }
        label {
            color: #C5DFE6;
        }
        .el-input {
            width: 300px;
        }
        .el-form-item__error {
            color: #f5bf46;
            top: 9px;
            left: 325px;
            width: 100px;
            text-align: left;
        }
        .vcode {
            position: relative;
            img {
                position: absolute;
                width: 53px;
                height: 22px;
                top: 9px;
                right: 10px;
                cursor: pointer;
            }
        }
        .btn-wrap {
            padding-right: 20px;
            text-align: center;
            button {
                padding: 10px 35px;
            }
        }
    }
}
</style>
