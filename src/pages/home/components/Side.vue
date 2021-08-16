<template>

    <el-menu
        class="common-side-bar"
        :default-active="$store.state.routerName"
        background-color="#304056"
        text-color="#BFCBD9"
        active-text-color="#318DF1"
        @select="select"
    >
        <el-menu-item index="ProjectList">
            <i class="iconfont" >&#xe631;</i>&nbsp;&nbsp;首  页
        </el-menu-item>

       <!-- <el-submenu index="ApiTest">
            <template slot="title">
                <i class="el-icon-view"></i>
                <span slot="title">接口自动化</span>
            </template>-->

            <!--<el-menu-item-group>-->
                <el-menu-item v-for="item of side_menu" :index="item.url" :key="item.url" :disabled="$store.state.routerName === 'ProjectList'">
                    <span class="iconfont" v-html="item.code"></span>&nbsp;&nbsp;{{item.name}}
                </el-menu-item>
           <!-- </el-menu-item-group>
        </el-submenu>-->
      <!--  <el-menu-item index="Pressure" disabled>
            &nbsp;<span class="iconfont">&#xe61f;</span>&nbsp;&nbsp;压力测试
        </el-menu-item>-->


    </el-menu>
</template>

<script>
    export default {
        name: "Side",
        data() {
            return {
                side_menu: [
                    {name: "任务队列", url: "TaskQueue", code: "&#xe61e;"},
                    {name: "新登录页", url: "New_Login", code: "&#xe61e;"}
                ],
            }
        },
        methods:{
            select(url) {
                this.$store.commit('setRouterName',url);
                this.$router.push({name:url});
                // if (url==="RecordApi") {
                //     window.open(this.$api.webUrl + "/stl/api_record/" + this.$route.path.replace("/dashbord","").split("/").pop())
                // }
                // if (url==="AutoTest") {
                //     window.open(this.$api.webUrl + "/stl/auto_test/" + this.$route.path.replace("/dashbord","").split("/").pop())
                // }
                this.setLocalValue("routerName",url);
            }
        }
    }
</script>

<style scoped>

    .common-side-bar {
        position: fixed;
        top: 48px;
        border-right: 1px solid #ddd;
        height: 100%;
        width: 202px;
        background-color: #fff;
        display: inline-block;
    }
</style>
