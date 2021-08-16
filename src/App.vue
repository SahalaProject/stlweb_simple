<template>
    <div id="app">
        <router-view v-if="isShow"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'App',
        provide () {
    return {
      reload: this.reload
    }
  },
    data () {
    return {
      isShow: true
    }
  },
  methods: {
      reload() {
          this.isShow = false;
          this.$nextTick(function () {
              this.isShow = true
          })
      }
  }
    }
</script>

<style>

    html, body {
        height:100%;
        width:100%;
        overflow:hidden;
        margin:0;
        padding:0;
        background: #fff;
    }

    body {
        color: #333;
        font-family: "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", STHeitiSC-Light, "Microsoft YaHei", "微软雅黑", Arial, sans-serif
    }
</style>