<template>
  <div class="me">
    <div class="list">
      这是我的列表
    </div>
    <router-view class="detail"/>
  </div>
</template>

<script>
export default {
  name: 'me',
}
</script>
<style lang="scss">
  .me{
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
