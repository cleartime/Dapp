<template>
  <div id="app">
    <div class="nav">
      <a href="/"><img src="./assets/logo.png" alt="" class="logo" height="80"></a>
      <div class="right">
        <span @click='login' v-if="!from" class="login">快捷登录入口</span>
        <p class="mine" @click='record' v-else><span v-if='list.length'>查看我的快递记录</span><span>{{from}}</span></p>
      </div>
    </div>
    <div class="bg">
      <div class="con">
        <transition name="bouncelnDown" mode="out-in">
          <ul class="kd" v-if='showkd'>
            <li v-for="i in comlist" @click='choose(i)'>
              <img :src="require(`@/assets/icon/${i.no}.png`)" alt="">
              <p>{{i.com}}</p>
            </li>
          </ul>
        </transition>
        <div class="bot">
          <img :src="require(`@/assets/icon/${comicon}.png`)" alt="" height="56" class="company" v-if='comicon' @click='showkd=!showkd' :class="com_choose?'choose':''">
          <img src="./assets/company.png" alt="" class="company" v-if='!comicon' @click='showkd=!showkd' :class="com_act?'act':''">
          <input ref="input" type="number" v-model="item.no" placeholder="快递单号" :class="input_act?'act':''">
          <img @click='query' src="./assets/search.png" alt="" height="40" class="search">
        </div>
      </div>
    </div>
    <el-dialog title="我的快递" :visible.sync="con_visible" width="30%" center>
      <ul>
        <li v-for='i in list'>
          <span class="time">{{i.datetime}}</span>
          <span class="remark">{{i.remark}}</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
          <el-button @click="con_visible = false">取 消</el-button>
          <el-button type="primary" @click="con_visible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Api from "./untils/until";
import company from "./untils/company";
import { setTimeout } from "timers";
let time = null;
let api = new Api("n1ucvbnSeFx1qMkPLc73wPU3FNN2aZmoEEX");
let kuaidi_api = "http://v.juhe.cn/exp/index";
export default {
  name: "App",
  data() {
    // 3362937148645
    // sto
    return {
      con_visible: false,
      com_choose: false,
      com_act: false,
      input_act: false,
      showkd: false,
      comicon: "",
      comlist: company,
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
    // this.record();
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
    choose(obj) {
      this.item.com = obj.no;
      this.comicon = obj.no;
      this.showkd = !this.showkd;
      this.com_choose = !this.com_choose;
      setTimeout(() => {
        this.com_choose = !this.com_choose;
      }, 300);
    },
    login_query(r) {
      api.query(r).then(r => {
        if (!r.code) {
          time = null;
          this.from = r.data.from;
          this.$notify({
            title: `登入成功`,
            message: "您可以查询快递啦!",
            type: "success"
          });
          this.record();
        }
      });
    },
    record() {
      api.get().then(r => {
        if (r == "null") {
          r = [];
        }
        this.list = r || [];
      });
    },
    set(data) {
      api.set(data).then(r => {
        this.list = data.reverse();
        this.con_visible = true;
      });
    },
    query() {
      if (!this.from) {
        this.$message({
          message: "请先登录",
          type: "warning"
        });
        return;
      }
      if (this.list.length) {
        this.con_visible = true;
        return;
      }
      if (!this.item.com) {
        this.showkd = !this.showkd;
        this.com_act = !this.com_act;
        setTimeout(() => {
          this.com_act = !this.com_act;
        }, 1000);
        this.$message({
          message: "请先选择快递公司",
          type: "warning"
        });
        return;
      }
      if (!this.item.no) {
        this.$refs.input.focus();
        this.input_act = !this.input_act;
        setTimeout(() => {
          this.input_act = !this.input_act;
        }, 500);
        this.$message({
          message: "请填写快递单号",
          type: "warning"
        });
        return;
      }
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
$color: #607778;
#app {
  color: $color;
  font-size: 16px;
  .nav {
    width: 1400px;
    margin: 0 auto;
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    .right {
      font-size: 20px;
      cursor: pointer;
      .login {
        animation: login_act 1s ease-in infinite;
      }
      .mine {
        display: flex;
        flex-direction: column;
        span {
          line-height: 30px;
        }
        span:last-child {
          font-size: 12px;
        }
      }
    }
  }
  .bg {
    height: 600px;
    background: url("./assets/bg.png") no-repeat center center;
    width: 100vw;
    background-size: cover;
    .con {
      position: relative;
      color: #fff;
      width: 800px;
      margin: 0 auto;
      height: 500px;
      .bot {
        box-shadow: 0px 1px 20px 8px #596c70;
        box-sizing: border-box;
        width: 100%;
        position: absolute;
        bottom: 10px;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        border-radius: 5px;
        padding-right: 20px;
        padding-left: 5px;
        .company {
          &.act {
            animation: com_act ease 1s;
          }
          &.choose {
            animation: com_choose 0.3s;
          }
          width: 56px;
          cursor: pointer;
          padding-right: 5px;
        }
        .search {
          cursor: pointer;
          text-align: center;
          padding-left: 20px;
        }
        input {
          border: none;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          flex: 1;
          width: 100%;
          height: 60px;
          line-height: 60px;
          outline: none;
          padding-left: 20px;
          font-size: 30px;
          color: $color;
          background: #fff;
          &::-webkit-input-placeholder {
            font-size: 16px;
            color: #ccc;
          }
          &.act {
            animation: input_act 0.5s;
          }
          &:focus {
            box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.35);
          }
        }
      }
      .kd {
        border: 1px solid #ccc;
        top: 5px;
        left: 0;
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        li {
          cursor: pointer;
          padding: 13px 0;
          font-size: 12px;
          box-sizing: border-box;
          text-align: center;
          width: 10%;
          color: $color;
          transition: all 0.3s;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }
}

.el-dialog {
  border-radius: 10px;
  width: 800px !important;
  height: 500px !important;
  overflow: auto;
  .el-button--primary {
    background-color: $color !important;
    border-color: $color !important;
  }
  li {
    line-height: 30px;
    display: flex;
    .time {
      width: 160px;
    }
    .remark {
      flex: 1;
    }
  }
}
/**从上往下**/

.bouncelnDown-enter-active,
.bouncelnDown-leave-active {
  transition: all 0.5s;
}

.bouncelnDown-enter,
.bouncelnDown-leave-active {
  opacity: 0;
  transform: translateY(100%);
}

@keyframes com_act {
  0% {
    transform: translateY(-10px);
  }
  50% {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes input_act {
  0% {
    border-radius: 10px;
    transform: scale(1);
  }
  75% {
    border-radius: 10px;
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes com_choose {
  0% {
    border-radius: 5px;
    transform: scale(0);
  }
  25% {
    border-radius: 5px;
    transform: scale(1);
  }
  50% {
    border-radius: 5px;
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes login_act {
  to {
    opacity: 0;
  }
  from {
    opacity: 1;
  }
}
</style>
