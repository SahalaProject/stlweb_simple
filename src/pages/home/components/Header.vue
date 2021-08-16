<template>
    <div>
        <div class="nav-header">



            <span style="color: white; font-size: 25px; margin-left: 10px" v-text="this.mainName"></span>
            <span class="right">
                <div style="float: right; color: #d9d9d9; margin-right: 100px">

                    <i class="iconfont">&#xee32;</i>
                    <el-dropdown>
                        <span v-text="this.$store.state.user" style="padding-left: 5px; font-size: large" class="el-dropdown-link" ></span>
                        <el-dropdown-menu slot="dropdown" mode="horizontal">
                            <el-dropdown-item><a style="padding-left: 10px;" @click="modPwd">修改密码</a></el-dropdown-item>
                            <el-dropdown-item><a style="padding-left: 10px;" @click="readLog">查看日志</a></el-dropdown-item>
                            <el-dropdown-item v-if="this.usertype > 2"><a style="padding-left: 10px;" @click="management">权限管理</a></el-dropdown-item>
                            <el-dropdown-item><a style="padding-left: 10px;" @click="handleLogOut">退出登录</a></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </span>

        </div>

        <el-dialog
                        title="修改密码"
                        :visible.sync="dialogVisible"
                        width="30%"
                        align="center"
                    >
                        <el-form
                            :model="nodeForm"
                            :rules="rules"
                            ref="nodeForm"
                            label-width="70px"
                            class="project">
                            <el-form-item label="旧密码" prop="password">
                            <el-input type="password" v-model="nodeForm.oldpwd"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="password">
                            <el-input type="password" v-model="nodeForm.password"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="repwd">
                            <el-input type="password" v-model="nodeForm.repwd"></el-input>
                            </el-form-item>
                        </el-form>


                        <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleConfirm('nodeForm')">确 定</el-button>
                        </span>
        </el-dialog>
        <el-dialog
                        class="logdialog"
                        :visible.sync="readlogtext"
                        width="50%"
                    >
                        <el-select v-model="value" class="logselect" placeholder="debug日志" width="100px" @change="changelog">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            >
                            </el-option>
                        </el-select>
                        <el-input type="textarea" v-text="this.logtext" class="readlog"></el-input>
        </el-dialog>
        <el-dialog
                        title="权限管理"
                        :visible.sync="permanagement"
                        width="40%"
                        align="center"

                    >
                        <el-form
                            :model="managementform"
                            ref="managementform"
                            label-width="100px"
                            :inline="true"
                            class="project">
                            <el-form-item label="用户名:" prop="username" class="managentname">
                                <el-select v-model="usernamevalue" placeholder="请选择用户" @change="changeusername" class="managementcls">
                                    <el-option
                                        v-for="item in usernameoptions"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="用户角色:" prop="user" class="managentname">
                                <el-select v-model="uservalue" placeholder="请选择角色" @change="changeuser" class="managementcls">
                                    <el-option
                                        v-for="item in useroptions"
                                        :key="item.type"
                                        :label="item.label"
                                        :value="item.type">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-transfer
                                v-model="csvalue"
                                :data="csdata"
                                :titles="['未配置项目', '已配置项目']"
                                style="text-align: left; display: inline-block; margin-left: -20px; margin-top: 10px; margin-bottom: 30px;">
                            </el-transfer>

                        </el-form>

                        <span slot="footer" class="dialog-footer">
                        <el-button @click="permanagement = false">取 消</el-button>
                        <el-button type="primary" @click="changemanagement('managementform')">确 定</el-button>
                        </span>
        </el-dialog>
    </div>

</template>

<script>

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.nodeForm.repwd !== '') {
                        this.$refs.nodeForm.validateField('repwd');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.nodeForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                mainName: "网站名称",
                dialogVisible: false,
                readlogtext: false,
                permanagement: false,
                logtext: "无日志",
                projectInfo: {},
                csdata: [],
                csvalue: [],
                usertype: 1,
                managementform:{
                    usernamecode:'',
                    projectcode:'',
                    usercode:'1'
                },
                nodeForm: {
                    username: this.$store.state.user,
                    password: '',
                    repwd: '',
                    oldpwd: '',
                },
                rules: {
                    password: [
                        {validator: validatePass, trigger: 'blur' },
                        {min: 6, message: '密码至少6位数', trigger: 'blur'},
                        {max: 17, message: '密码至多17位数', trigger: 'blur'}
                    ],
                    repwd: [
                        {validator: validatePass2, trigger: 'blur' },
                        {min: 6, message: '密码至少6位数', trigger: 'blur'},
                        {max: 17, message: '密码至多17位数', trigger: 'blur'}
                    ],
                },
                options: [{
                  value: '1',
                  label: 'debug日志'
                }, {
                  value: '2',
                  label: '异步日志'
                }, {
                  value: '3',
                  label: '心跳日志'
                }],
                useroptions: [{
                  type: '1',
                  label: '普通用户'
                }, {
                  type: '4',
                  label: '管理员'
                }, {
                  type: '3',
                  label: '超级管理员'
                }],
                usernameoptions: [],
                projectoptions: [],
                value: '',
                usernamevalue: '',
                uservalue:'普通用户',
                projectvalue:'',
            };
        },

        methods: {
            handleLogOut () {
                this.$store.commit("isLogin", null);
                this.setLocalValue("token", null);
                this.$router.push({name:"Login"});
            },

            readLog () {
                console.log("查看日志");
                this.readlogtext = true;
                this.getLogText()
            },

            modPwd () {
                this.dialogVisible = true
            },

            management() {
                console.log("权限管理");
                this.getallusername();
                this.permanagement = true;
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
            },

            handleConfirm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.forgetpassword(this.nodeForm).then(resp => {
                            this.handleFindSuccess(resp)
                        })
                    }
                });
            },

            getProjectDetail() {
                            const pk = this.$route.params.id;
                            this.$api.getProjectDetail(pk).then(res => {
                                this.projectInfo = res;
                                this.mainName = "项目名称: " + this.projectInfo.name
                            });
            },

            getLogText() {
                this.$api.getLogText({params: {type: 1}}).then(resp => {
                    this.logtext = resp;
                })
            },

            getallusername() {
                this.$api.getusername().then(resp => {
                    this.usernameoptions = resp.msg.allusername;
                })
            },

            getmanagentusertype() {
                this.$api.getusertype().then(resp => {
                    this.usertype = resp.msg;
                })
            },

            changeusername() {
                this.managementform['usernamecode'] = this.usernamevalue;
                const data = [];
                const data2 = [];
                this.$api.getprojecName({params: {uid: this.usernamevalue}}).then(resp => {
                    for (let i = 0; i < resp.msg.projectallname.length; i++){
                        data.push({
                            key: resp.msg.projectallname[i]["code"],
                            label:resp.msg.projectallname[i]["name"],
                        })
                    }
                    for (let i = 0; i < resp.msg.user_have.length; i++){
                        data2.push(
                            resp.msg.user_have[i],
                        )
                    }

                });
                console.log(data2);
                this.csdata = data;
                this.csvalue = data2;
            },

            changeuser() {
                this.managementform['usercode'] = this.uservalue;
            },

            changemanagement(data) {
                this.managementform['projectcode'] = this.csvalue;
                this.$refs[data].validate((valid) => {
                    if (valid) {
                        this.$api.changeManagement(this.managementform).then(resp => {
                            if(resp['success']) {
                                this.permanagement = false;
                                this.$notify.success({
                                    title: '提示',
                                    message: '更新权限成功',
                                    duration: 1000
                                })
                            } else {
                                this.$notify.error({
                                    title: '提示',
                                    message: resp["msg"],
                                    duration: 1000
                                })
                            }

                        });
                    }
                });

            },

            changelog() {
                if(this.value === '1') {
                    this.$api.getLogText({params: {type: 1}}).then(resp => {
                        this.logtext = resp;
                    })
                }
                if(this.value === '2') {
                    this.$api.getLogText({params: {type: 2}}).then(resp => {
                        this.logtext = resp;
                    })
                }
                if(this.value === '3') {
                    this.$api.getLogText({params: {type: 3}}).then(resp => {
                        this.logtext = resp;
                    })
                }
            },
        },
        name: "Header",
        mounted() {
            this.getProjectDetail();
            this.getmanagentusertype();
        }

    }
</script>

<style scoped>
    .left {
        width: 180px;
        left: 20px;
        display: inline-block;
        position: fixed;
        z-index: 900;
        top: -5px;
    }

    .right {
        position: fixed;
        left: 300px;
        right: 0;
        top: 0;

    }

    .right div a:hover {
        color: darkcyan;
    }

    .logo {
        background: white;
        height: 40px;
    }

    .nav-header {
        background: #242F42;
        margin: 0 auto;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #ddd;
        height: 49px;
        line-height: 49px;
    }
    .readlog {
        width: 100%;
        height: 600px;
        overflow-x: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
        text-align:left;
    }
    .logselect {
        text-align:left;
        text-align-last:left;
        height: 50px;
        top:-20px
    }
    .managementcls {
        /*width: 170px;*/
        margin-left: 20px;
    }
    /*.managentname{*/
    /*    width: 200px;*/
    /*}*/
</style>
