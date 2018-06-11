<template>
  <div class="friends">
    <div class="list">
      这是好友列表
    </div>
    <router-view class="detail"/>
  </div>
</template>

<script>
    export default {
        name: 'friends',
    }
</script>
<style lang="scss">
  .friends{
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
