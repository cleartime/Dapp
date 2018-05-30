<template>
  <div id="app">
    <div class="nav">
      <div>
        <span @click='login' v-if="!from">登录</span>
       <span @click='record' v-else>我的记录</span>
      </div>
      <span>{{from}}</span>
    </div>
    <input type="text" v-model="item.no">
    <span @click='query'>查快递</span>
    <ul>
      <li v-for='i in list'>
        <span>{{i.datetime}}</span>
        <span>{{i.remark}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Api from "./untils/until";
import { setInterval } from "timers";
// import { upload } from "./untils/index";
let time = null;
let api = new Api("n1hXSMMrD9TTKabTnJL6AUAv1cuxenWexY8");
let kuaidi_api = "http://v.juhe.cn/exp/index";
export default {
  name: "App",
  data() {
    return {
      list: [],
      from: "",
      item: {
        no: "3362937148645",
        com: "sto",
        dtype: "",
        key: "e9ac621879183be591b4747bb4ae76ed"
      }
    };
  },
  created() {
    // this.init();
  },
  mounted() {
    this.getout();
  },
  methods: {
    login() {
      api.login().then(r => {
        time = setInterval(() => {
          if (!time) {
            clearInterval(time);
          } else {
            this.login_query(r);
          }
        }, 3000);
      });
    },
    login_query(r) {
      api.query(r).then(r => {
        if (!r.code) {
          time = null;
          this.from = r.data.from;
        }
      });
    },
    record() {
      api.get().then(r => {
        this.list = r;
      });
    },
    set(data) {
      api.set(data).then(r => {
        this.list = data.reverse();
      });
    },
    query() {
      axios
        .get(kuaidi_api, {
          params: this.item
        })
        .then(res => {
          let data = res.data.result;
          this.set(data.list);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getout() {
      if (typeof webExtensionWallet === "undefined") {
        this.$alert("请先在谷歌浏览器安装星云链钱包插件", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            if (action === "confirm") {
              window.open(
                "https://github.com/ChengOrangeJu/WebExtensionWallet"
              );
              return;
            }
            this.$message({
              type: "warning",
              message: `没有装插件不能添加哦！`
            });
          }
        });
        return false;
      }
      return true;
    },
    init(obj) {},
    reset() {}
  }
};
</script>

<style lang='scss'>
</style>
