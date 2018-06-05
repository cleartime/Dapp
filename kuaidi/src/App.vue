<template>
  <div id="app" v-loading="loading">
    <div class="nav">
      <a href="/"><img src="./assets/logo.png" alt="" class="logo" height="80"></a>
      <ul class="menu">
        <li @click='rule=!rule'>
          使用教程
        </li>
        <li @click='help=!help'>
          帮助教程
        </li>
        <li>
          <el-tooltip effect="dark" content="1047105447@qq.com" placement="top-start">
            <el-button>联系方式</el-button>
          </el-tooltip>
        </li>
      </ul>
      <div class="right">
        <span @click='login' v-if="!from" class="login">快捷登录入口</span>
        <p class="mine" v-else>
          <el-dropdown @command="command_fn">
            <span class="el-dropdown-link">个人中心<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">快递记录</el-dropdown-item>
              <el-dropdown-item command="b">{{from}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </p>
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
          <input ref="input" type="number" v-model="item.no" placeholder="请填写快递单号" :class="input_act?'act':''">
          <img @click='query' src="./assets/search.png" alt="" height="40" class="search">
        </div>
      </div>
    </div>
    <div class="foot">
      <p class="caret" contenteditable>星云链查快递提供精准实用的快递网点查询、快递网点电话查询、快递派送范围查询等</p>
      <p class="tip">星云链查快递@2018 | 使用 <a href="https://nebulas.io/cn/" target="_blank">星云链 驱动</a> | <a href="https://incentive.nebulas.io/cn/signup.html?invite=bFZxb" target="_blank">提交DAPP获得 100NAS 币</a></p>
    </div>
    <el-dialog title="我的快递" :visible.sync="con_visible" width="30%" center>
      <ul class="con_visible">
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
  
    <el-dialog title="使用教程" :visible.sync="rule" width="30%" center>
      <el-steps :active="active" finish-status="success">
        <el-step title="第一步">2</el-step>
        <el-step title="第二步">3</el-step>
        <el-step title="完成">4</el-step>
      </el-steps>
      <!-- <ul class="rule">
          <li>
            <span>第一步：</span>
            <p style="line-height: 25px">快捷登录<br>看到右上角一闪一闪的按钮了么= =<br>(如已登入则跳过)</p>
          </li>
          <li>
            <span>第二步：</span>
            <p>点击<img src="./assets/company.png" alt="" height="50">选择快递公司</p>
          </li>
          <li>
            <span>第三步：</span>
            <p>输入快递单号</p>
          </li>
          <li>
            <span style="margin-left:-1em">最后一步：</span>
            <p>点击<img src="./assets/search.png" alt="" height="50">完成搜索</p>
          </li> -->
      <!-- </ul> -->
      <div class="rule-con">
        <p v-if="active==0">准备好了么，请点击第一步</p>
        <p v-else-if="active==1">点击<img src="./assets/company.png" alt="" height="50">选择快递公司</p>
        <p v-else-if="active==2">输入快递单号</p>
        <p v-else>点击<img src="./assets/search.png" alt="" height="50">完成搜索</p>
      </div>
  
      <span slot="footer" class="dialog-footer">
                              <el-button @click="rule = false">取 消</el-button>
                              <el-button type="primary" @click="next">{{this.active==0?'第一步':this.active==1?'第二步':this.active==2?'最后一步':'我学会了'}}</el-button>
                            </span>
    </el-dialog>
    <el-dialog title="帮助教程" :visible.sync="help" width="30%" center>
      <el-steps direction="vertical">
        <el-step title="下载安装chrome星云钱包插件。" description="1.WebExtensionWallet 类似以太坊的MetaMask。
        2.点WebExtensionWallet链接，进入项目主页，下载zip压缩包。然后解压。
        3.chrome浏览器地址栏输入 chrome://extensions/ 进入到浏览器扩展程序管理页面。
        4.打开右上角开发者模式开关。
        5.点击 加载已解压到扩展程序 ，然后选择第2步下载解压的文件夹。"></el-step>
        <el-step title="安装完钱包插件后, 需要创建钱包" description="1.创建钱包。 保存好你创建的钱包和密钥库文件(私钥)。
        2.解锁创建的钱包。获取你的钱包地址(公钥)
        3.获取测试币.  https://testnet.nebulas.io/claim/ 申请后到账需要一两分钟。（主网上线后，需要购买真实NAS币。大概0.01NAS即可参与。）"></el-step>
        <el-step title="钱包插件选择" description="钱包插件选择测试网和中文界面。（主网上线后，需要选择Mainnet）"></el-step>
        <el-step title="最后" description="安装好插件和创建钱包后。回到《星云链查快递》查快递 = = "></el-step>
      </el-steps>
  
      <span slot="footer" class="dialog-footer">
                              <el-button @click="help = false">取 消</el-button>
                              <el-button type="primary" @click="help = false">我知道了</el-button>
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
// ec241dbe0d93ef61582d3c10ac36f660cf16e8ca6b5998253955d5fede3a5cf5
// let api = new Api("n1k1WqwF6AKw4AoLvL9NWxwZUhiEBDBCvFi"); //text
let api = new Api("n1gqhmKjDqsFJ4D5kwjhxnqkqt4kcdMha9k"); //pro
let kuaidi_api = "http://v.juhe.cn/exp/index";
// if (!process.env.NODE_ENV === "production") {
// kuaidi_api = `${location.origin}/exp/index`;
// }
export default {
  name: "App",
  data() {
    // 3362937148645
    // sto
    return {
      active: 0,
      help: false,
      loading: false,
      rule: false,
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
        // 3362937148645
        no: "",
        // sto
        com: "",
        dtype: "",
        key: "e9ac621879183be591b4747bb4ae76ed"
      }
    };
  },
  created() {
    this.init();
    if (!process.env.NODE_ENV !== "production") {
      this.item.no = "3362937148645";
      this.item.com = "sto";
    }
  },
  mounted() {
    window.addEventListener("message", e => {
      log(e);
      if (e.data && e.data.resp === "Error: Transaction rejected by user") {
        this.loading && (this.loading = false);
        clearInterval(time);
        this.$notify({
          title: `提示`,
          message: "您取消了本次交易!",
          type: "warning"
        });
      }
    });
    if (!this.getout()) return;
    // axios
    //   .post("https://Mainnet.nebulas.io/v1/user/getTransactionReceipt", {
    //     hash: "da0f2d5735e52098df40f4e5a6f3d496a79991c229c28e89dd9acccc41d9abc7"
    //   })
    //   .then(d => {
    //     log(d);
    //   });
  },
  methods: {
    init() {
      window.postMessage(
        {
          target: "contentscript",
          data: {},
          method: "getAccount"
        },
        "*"
      );
      window.addEventListener("message", e => {
        if (e.data && e.data.data) {
          if (e.data.data.account) {
            this.from = e.data.data.account;
            this.record();
            // this.getall();
          }
        }
      });
    },
    next() {
      if (this.active++ > 2) (this.active = 0), (this.rule = false);
    },
    login() {
      if (!this.getout()) return;
      !this.loading && (this.loading = true);
      this.from &&
        api.login(this.from).then(r => {
          this.loading && (this.loading = false);
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
      !this.loading && (this.loading = true);
      api.query(r).then(r => {
        if (!r.code) {
          this.loading && (this.loading = false);
          time = null;
          this.from = r.data.from;
          this.$notify({
            title: `登入成功`,
            message: "您可以查询快递啦!",
            type: "success"
          });
          // this.record();
        }
      });
    },
    set_query(r) {
      !this.loading && (this.loading = true);
      api.query(r).then(r => {
        if (!r.code) {
          this.loading && (this.loading = false);
          time = null;
          this.$notify({
            title: `查询成功`,
            message: "快递信息已经出现拉!",
            type: "success"
          });
          // this.list = data.reverse();
          this.con_visible = true;
        }
      });
    },
    record() {
      !this.loading && (this.loading = true);
      api
        .get(this.from)
        .then(r => {
          this.loading && (this.loading = false);
          if (r == null || r == "null") {
            r = [];
            this.$message({
              message:
                "您还没有查过快递哦！，查询成功之后，我们就会帮您记录下哦！",
              type: "warning"
            });
            return;
          }
          this.list = r || [];
          this.$message({
            message: "您有一个快递记录，点击个人中心，我的记录可以查看哦！",
            type: "success"
          });
        })
        .catch(e => {
          this.loading && (this.loading = false);
        });
    },
    getall() {
      !this.loading && (this.loading = true);
      api
        .getuser(this.from)
        .then(r => {
          this.loading && (this.loading = false);
          if (r == null || r == "null") {
            r = [];
          }
          this.list = r || [];
        })
        .catch(e => {
          this.loading && (this.loading = false);
        });
    },
    set(data) {
      !this.loading && (this.loading = true);
      api.set(this.from, data).then(r => {
        this.loading && (this.loading = false);
        time = setInterval(() => {
          if (!time) {
            clearInterval(time);
          } else {
            this.set_query(r);
          }
        }, 3000);
      });
    },
    query() {
      if (!this.getout()) return;
      if (!this.from) {
        this.$message({
          message: "请先登录",
          type: "warning"
        });
        return;
      }
      // if (this.list.length) {
      //   this.con_visible = true;
      //   return;
      // }
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
      !this.loading && (this.loading = true);
      axios
        .get(kuaidi_api, {
          params: this.item
        })
        .then(res => {
          this.loading && (this.loading = false);
          let data = res.data.result;
          if (!data) {
            this.$message({
              message: res.data.reason,
              type: "warning"
            });
            return;
          }
          this.list = data.list;
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
    command_fn(e) {
      if (e == "a") {
        if (!this.list.length) {
          this.$message({
            type: "warning",
            message: `快递记录为空，请先查询您的快递`
          });
          return;
        }
        this.con_visible = true;
      }
    }
  }
};
</script>

<style lang='scss'>
$color: #607778;
#app {
  color: $color;
  font-size: 16px;
  .nav {
    .menu {
      margin-right: 10px;
      flex: 1;
      justify-content: flex-end;
      display: flex;
      li {
        &:hover {
          color: #409eff;
          background-color: #ecf5ff;
        }
        a {
          text-decoration: none;
          color: $color;
          &:hover {
            color: #409eff;
            background-color: #ecf5ff;
          }
        }
        margin: 0 10px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
      }
    }
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

.foot {
  width: 1400px;
  margin: 0 auto;
  .sm {
    line-height: 25px;
  }
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      margin: 10px 20px;
    }
  }
  .tip {
    font-size: 14px;
    text-align: center;
    margin-top: 50px;
    a {
      color: $color;
    }
  }
  .caret {
    padding-right: 4px;
    box-sizing: border-box;
    font: bold 200% Consolas, Monaco, monospace;
    border-right: 0.1em solid;
    width: 1230px !important;
    /* # of chars */
    margin: 2.5em auto;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    animation: typing 3s steps(45, end), blink-caret 0.5s infinite alternate;
  }
}

.el-dialog {
  .rule-con {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    width: 100%;
    p {
      img {
        padding: 0 10px;
      }
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 30px;
    }
  }
  border-radius: 10px;
  width: 800px !important;
  height: 600px !important;
  .el-step__description {
    padding-right: 0 !important;
    line-height: 30px !important;
  }
  .el-step__title {
    color: $color !important;
  }
  overflow: auto;
  .el-button--primary {
    background-color: $color !important;
    border-color: $color !important;
  }
  .con_visible {
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
  .rule {
    font-weight: bold;
    font-size: 18px;
    padding-left: 31%;
    li {
      span {
        padding-right: 50px;
      }
      p {
        display: flex;
        align-items: center;
        img {
          padding: 0 20px;
        }
      }
      line-height: 80px;
      line-height: 80px;
      display: flex;
    }
  }
  .rulep {
    margin-bottom: -10px;
    text-align: center;
  }
}

.el-tooltip {
  padding: 0 10px;
  font-size: 20px;
  font-weight: bold;
  border: none !important;
}

.el-dropdown {
  span {
    color: $color;
    font-weight: bold;
    font-size: 20px !important;
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

@keyframes typing {
  from {
    width: 0;
  }
}

@keyframes blink-caret {
  50% {
    border-right: none;
    border-color: none;
  }
}

@media screen and (max-width: 1280px) {
  body {
    transform: scale(0.8) translateY(-120px);
    .bg {
      width: 1660px !important;
      transform: translateX(-160px);
    }
  }
}
</style>
