<template>
  <div class="menu">
      <ul>
        <li v-for="(i,index) in list" @click="link(i)">
          {{i.name}}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'app-menu',
  data(){
      return{
          list:[{
              name: '邮件',
              url: '/'
          },{
              name: '好友',
              url: 'Friends'
          },{
              name: '设置',
              url: 'Seting'
          }]
      }
  },
    methods:{
      link(i){
          this.$router.push(i.url);
      }
    }
}
</script>

<style scoped lang="scss">

</style>
