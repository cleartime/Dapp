<template>
  <div id="app">
    <img src="./images/bg2.jpeg" alt="" class="bg">
    <div class="mask" v-if='mask'></div>
    <div @click="mask=!mask"><span>我也要喊话</span></div>
    <div class="add" v-if='mask'>
      <input type="text" placeholder="您的昵称" v-model="item.title">
      <input type="text" placeholder='您想说的话' v-model="item.con">
      <span @click="add">添加</span>
    </div>
    <div class="con">
      <ul>
        <li v-for='(i, index) in list' :key="index">
          <h2>{{i.title}}</h2>
          <div>
            {{i.con}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Api from './untils/until'
  let api = new Api('n1fUTDjA1h1xHeTCxiYqqtx3MT6hNqcjbZG');
  let time = null;
  export default {
    name: 'App',
    data() {
      return {
        loading: false,
        serialNumber: false,
        mask: true,
        item: {
          title: '',
          con: ''
        },
        list: []
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        api.getAll().then(r => this.list = r.filter(t => t.title))
      },
      add() {
        api.set(this.item).then(r => {
          this.serialNumber = r;
        })
      },
      query() {
        this.loading = true;
        api.query(this.serialNumber).then(r => {
          if (!r.code) {
            this.$message({
              message: '您的想法已经石沉树洞',
              type: 'success'
            });
            this.list.push(this.item)
            clearInterval(time);
            time = null;
          }
        })
      }
    },
    watch: {
      serialNumber() {
        time = setInterval(() => {
          this.query()
        }, 3000)
      }
    }
  }
</script>

<style>
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    filter: blur(2px);
    z-index: -1
  }
  
  ul {
    width: 1000px;
    margin: 0 auto;
  }
  
  li {
    color: #fff;
    margin-bottom: 10px;
    list-style: none;
    background: rgba(0, 0, 0, .4);
    box-sizing: border-box;
    padding: 15px;
  }
  
  li h2 {}
  
  li div {}
  
  .mask {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, .5)
  }
  
  .add {
    text-align: center;
    width: 200px;
    position: absolute;
    left: 50%;
    margin-left: -100px;
  }
  
  .add input {
    border-radius: 5px;
    padding-left: 10px;
    display: block;
    line-height: 30px;
    margin-top: 20px;
    border: none;
    outline: none;
  }
  
  .add span {
    background: #713d00;
    padding: 10px;
    color: #fff;
    border-radius: 50%;
  }
</style>
