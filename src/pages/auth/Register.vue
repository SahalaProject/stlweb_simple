<template>
  <el-container class="login">
    <div id="rlogo">
      <el-main style="padding: 0px">
        <el-row>
          <el-col :span="24">
            <div>
              <div id="form-title" style="color: white">自动化测试平台</div>
              <form id="submit-form">
                <div id="form-content">
                  <div id="form-msg">用户注册</div>
                  <div id="form-inputs">
                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 438px;
                          padding-left: 10px;
                        "
                        >&#xe61c;</i
                      >
                      <input
                        placeholder="用户名"
                        type="text"
                        id="user"
                        v-model="registerForm.username"
                      />
                      <div
                        class="err_msg"
                        id="user_err"
                        v-html="usernameInvalid"
                        @mouseover="usernameInvalid = ''"
                      ></div>
                    </div>

                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 375px;
                          padding-left: 10px;
                        "
                        >&#58975;</i
                      >
                      <input
                        placeholder="真实姓名"
                        type="text"
                        id="real_name"
                        v-model="registerForm.real_name"
                      />
                      <div
                        class="err_msg"
                        id="real_name_err"
                        v-html="realnameInvalid"
                        @mouseover="realnameInvalid = ''"
                      ></div>
                    </div>

                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 312px;
                          padding-left: 10px;
                        "
                        >&#xe652;</i
                      >
                      <input
                        placeholder="密码"
                        type="password"
                        id="pwd"
                        v-model="registerForm.password"
                      />
                      <div
                        class="err_msg"
                        id="pwd_err"
                        v-html="passwordInvalid"
                        @mouseover="passwordInvalid = ''"
                      ></div>
                    </div>
                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 250px;
                          padding-left: 10px;
                        "
                        >&#xe652;</i
                      >
                      <input
                        placeholder="确认密码"
                        type="password"
                        id="repwd"
                        v-model="registerForm.repwd"
                      />
                      <div
                        class="err_msg"
                        id="repwd_err"
                        v-html="repwdInvalid"
                        @mouseover="repwdInvalid = ''"
                      ></div>
                    </div>
                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 190px;
                          padding-left: 10px;
                        "
                        >&#xe668;</i
                      >
                      <input
                        placeholder="邮箱"
                        type="email"
                        id="email"
                        v-model="registerForm.email"
                      />
                      <div
                        class="err_msg"
                        id="email_err"
                        v-html="emailInvalid"
                        @mouseover="emailInvalid = ''"
                      ></div>
                    </div>
                    <div class="form-submit">
                      <button
                        type="button"
                        class="btn btn-primary"
                        id="submitBtn"
                        @click="submitForm"
                      >
                        立即注册
                      </button>
                    </div>
                  </div>
                  <div class="form-foot">
                    <span
                      >已有账户，<router-link to="/login"
                        >立即登陆</router-link
                      ></span
                    >
                  </div>
                </div>
              </form>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </div>
  </el-container>
</template>


<script>
export default {
  name: "Register",
  data() {
    return {
      registerForm: {
        username: "",
        real_name: "",
        password: "",
        repwd: "",
        email: "",
      },
      passwordInvalid: "",
      usernameInvalid: "",
      realnameInvalid: "",
      repwdInvalid: "",
      emailInvalid: "",
    };
  },
  methods: {
    validateUser() {
      const uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
      if (!uPattern.test(this.registerForm.username)) {
        this.usernameInvalid = "用户名4到16位,只能是字母,数字,下划线,连字符";
        return false;
      }
      return true;
    },

    validateRealName() {
      const uPattern = /^[\u4e00-\u9fa5]{2,8}$/;
      if (!uPattern.test(this.registerForm.real_name)) {
        this.realnameInvalid = "真实姓名2到8位汉字";
        return false;
      }
      return true;
    },

    validatePassword() {
      const pPattern = /^[a-zA-Z\d_]{6,}$/;
      if (!pPattern.test(this.registerForm.password)) {
        this.passwordInvalid = "密码至少6位数";
        return false;
      }
      return true;
    },

    validateRepwd() {
      if (this.registerForm.password !== this.registerForm.repwd) {
        this.repwdInvalid = "确认密码和密码不一致";
        return false;
      }
      return true;
    },

    validateEmail() {
      const ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!ePattern.test(this.registerForm.email)) {
        this.emailInvalid = "邮箱格式不正确";
        return false;
      }
      return true;
    },

    handleRegisterSuccess(resp) {
      if (resp["success"]) {
        this.$router.push("/login");
      } else {
        this.$message.error({
          message: resp["msg"],
          duration: 2000,
          center: true,
        });
      }
    },
    submitForm(formName) {
      if (
        this.validateUser() &&
        this.validateRealName() &&
        this.validatePassword() &&
        this.validateRepwd() &&
        this.validateEmail()
      ) {
        this.$api.register(this.registerForm).then((resp) => {
          this.handleRegisterSuccess(resp);
        });
      }
    },
  },
};
</script>

<style scoped>
#rlogo {
  background: url("~@/assets/images/loginlogo.png");
  /* background-size: 100% 100%;
  height: 115%;
  width: 100%; */
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #1F1F1F;
  background-position: center;
  background-attachment: fixed;
}
</style>
