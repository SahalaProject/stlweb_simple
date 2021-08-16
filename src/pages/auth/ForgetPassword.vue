<template>
    <el-container class="login">
        <el-header>
            <el-row>
                <el-col
                    :span="4"
                    :offset="1"
                >
                    <div>

                    </div>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="padding: 0px">
            <el-row>
                <el-col :span="7">
                    <div class="bottom-left">
                        <!-- <img src="~@/assets/images/forget2.png"> -->
                    </div>

                </el-col>
                <el-col :span="24">
                    <div>
                        <form id="submit-form">
                            <div id="form-content">
                                <div id="form-msg">重置密码</div>
                                <div id="form-inputs">
                                    <div class="form-input-div">
                                        <i class="iconfont"
                                           style="position: absolute; bottom: 312px; padding-left: 10px">&#xe61c;</i>
                                        <input placeholder="用户名" type="text" id="user"
                                               v-model="forgetForm.username">
                                        <div class="err_msg" id="user_err" v-html="usernameInvalid"
                                             @mouseover="usernameInvalid=''"></div>
                                    </div>
                                    <div class="form-input-div">
                                        <i class="iconfont"
                                           style="position: absolute; bottom: 250px; padding-left: 10px">&#xe652;</i>
                                        <input placeholder="密码" type="password" id="pwd"
                                               v-model="forgetForm.password">
                                        <div class="err_msg" id="pwd_err" v-html="passwordInvalid"
                                             @mouseover="passwordInvalid= ''"></div>
                                    </div>
                                    <div class="form-input-div">
                                        <i class="iconfont"
                                           style="position: absolute; bottom: 190px; padding-left: 10px">&#xe652;</i>
                                        <input placeholder="确认密码" type="password" id="repwd" v-model="forgetForm.repwd">
                                        <div class="err_msg" id="repwd_err" v-html="repwdInvalid"
                                             @mouseover="repwdInvalid= ''"></div>
                                    </div>

                                    <div class="form-submit">
                                        <button type="button" class="btn btn-primary" id="submitBtn"
                                                @click="submitForm">立即修改
                                        </button>
                                    </div>
                                </div>
                                <div class="form-foot">
                                    <span><router-link to="/login">返回登录</router-link></span>
                                </div>

                            </div>
                        </form>

                    </div>

                </el-col>
                <el-col :span="7">
                    <div class="bottom-right">
                        <!-- <img src="~@/assets/images/forget3.png"> -->
                    </div>
                </el-col>
            </el-row>

        </el-main>
    </el-container>

</template>


<script>

    export default {
        name: "ForgetPassword",
        data() {
            return {
                forgetForm: {
                    username: '',
                    password: '',
                    repwd: '',
                },
                passwordInvalid: "",
                usernameInvalid: '',
                repwdInvalid: '',
            };
        },
        methods: {
            validateUser() {
                const uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
                if (!uPattern.test(this.forgetForm.username)) {
                    this.usernameInvalid = '用户名4到16位,只能是字母,数字,下划线,连字符';
                    return false
                }
                return true
            },

            validatePassword() {
                const pPattern = /^[a-zA-Z\d_]{6,}$/;
                if (!pPattern.test(this.forgetForm.password)) {
                    this.passwordInvalid = "密码至少6位数";
                    return false
                }
                return true
            },

            validateRepwd() {
                if (this.forgetForm.password !== this.forgetForm.repwd) {
                    this.repwdInvalid = '确认密码和密码不一致';
                    return false
                }
                return true
            },


            handleFindSuccess(resp) {
                if (resp['success']) {
                    this.$router.push('/login')
                } else {
                    this.$message.error({
                        message: resp["msg"],
                        duration: 2000,
                        center: true
                    })
                }
            }
            ,
            submitForm(formName) {
                if (this.validateUser() && this.validatePassword() && this.validateRepwd()) {
                    this.$api.forgetpassword(this.forgetForm).then(resp => {
                        this.handleFindSuccess(resp)
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
