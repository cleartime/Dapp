<template>
  <div id="app">
    <Menu class="left"/>
    <router-view class="right"/>
  </div>
</template>
<script>
    import Menu from '@/components/Menu.vue'
    export default {
        name: 'app',
        components: {
            Menu
        }
    }
</script>
<style lang="scss">
  #app{
    display: flex;
    justify-content: space-between;
    .left{
      flex: 1;
    }
    .right{
      flex: 3;
    }
  }
</style>
