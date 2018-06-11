<template>
  <div class="seting">
    <div class="list">
      这是设置列表
    </div>
    <router-view class="detail"/>
  </div>
</template>

<script>
    export default {
        name: 'seting',
    }
</script>
<style lang="scss">
  .seting{
    display: flex;
    justify-content: space-between;
    .list{
      flex: 2;
    }
    .detail{
      flex: 3;
    }
  }
</style>
