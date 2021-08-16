<template>
  <el-container class="login">
    <div id="logo">
      <el-main style="padding: 80px">
        <el-row>
          <el-col :span="24">
            <div>
              <div id="form-title" style="color: white">自动化测试平台</div>
              <form id="submit-form">
                <div id="form-content">
                  <div id="form-msg">用户登录</div>
                  <div id="form-inputs">
                    <div class="form-input-div">
                      <i
                        class="iconfont"
                        style="
                          position: absolute;
                          bottom: 250px;
                          padding-left: 10px;
                        "
                        >&#xe61c;</i
                      >
                      <input
                        placeholder="用户名"
                        type="text"
                        id="email"
                        v-model="loginForm.username"
                      />
                      <div
                        class="err_msg"
                        id="email_err"
                        v-html="usernameInvalid"
                        @mouseover="usernameInvalid = ''"
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
                        >&#xe652;</i
                      >
                      <input
                        placeholder="密码"
                        type="password"
                        id="pwd"
                        v-model="loginForm.password"
                      />
                      <div
                        class="err_msg"
                        id="pwd_err"
                        v-html="passwordInvalid"
                        @mouseover="passwordInvalid = ''"
                      ></div>
                    </div>
                    <div class="form-submit">
                      <button
                        type="button"
                        class="btn btn-primary"
                        id="submitBtn"
                        @click="submitForm"
                        @keyup.enter="submitForm"
                      >
                        立即登录
                      </button>
                    </div>
                  </div>
                  <div class="form-foot">
                    <span
                      >没有账户，<router-link to="/register"
                        >立即注册</router-link
                      >
                      &#12288;&#12288;&#12288; &#12288;&#12288;&#12288;
                      &#12288;&#12288;&#12288;&#12288;
                      &#12288;&#12288;&#12288;&#12288;
                      <!-- <router-link to="/forgetpassword" class="forgot-password">找回密码</router-link> -->
                    </span>
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
  name: "New_Login",

  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      usernameInvalid: "",
      passwordInvalid: "",
    };
  },

  methods: {
    validateUserName() {
      if (this.loginForm.username.replace(/(^\s*)/g, "") === "") {
        this.usernameInvalid = "用户名不能为空";
        return false;
      }
      return true;
    },
    validatePassword() {
      if (this.loginForm.password.replace(/(^\s*)/g, "") === "") {
        this.passwordInvalid = "密码不能为空";
        return false;
      }
      return true;
    },
    handleLoginSuccess(resp) {
      if (resp.success) {
        this.$router.push({ name: "ProjectList" });
        this.$store.commit("isLogin", resp.token);
        this.$store.commit("setUser", resp.user);
        this.$store.commit("setRouterName", "ProjectList");
        this.setLocalValue("token", resp.token);
        this.setLocalValue("user", resp.user);
        this.setLocalValue("routerName", "ProjectList");
      } else {
        this.$message.error({
          message: resp.msg,
          duration: 2000,
          center: true,
        });
      }
    },
    submitForm() {
      if (this.validateUserName() && this.validatePassword()) {
        this.$api.login(this.loginForm).then((resp) => {
          this.handleLoginSuccess(resp);
        });
      }
    },
  // 点击回车键登录
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode === 13) {
        this.submitForm(); // 定义的登录方法
      }
    },
  },

  mounted() {
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
};
</script>

<style scoped>
#logo {
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
