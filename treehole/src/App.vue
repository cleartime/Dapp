<template>
  <div id="app">
    <div class="nav">
      <img src="./assets/logo.png" alt="" @click='init'>
      <div>
        <el-input placeholder="搜索作品、资源" v-model="searchTitle">
          <i slot="prefix" class="el-input__icon el-icon-search" @click='search'></i>
        </el-input>
        <el-tabs @tab-click="tab" v-model="activeName">
          <el-tab-pane label="优秀作品" name="1">优秀作品</el-tab-pane>
          <el-tab-pane label="学习资源" name="2">学习资源</el-tab-pane>
          <el-tab-pane label="作品排行榜" name="3">优秀作品排行榜</el-tab-pane>
          <el-tab-pane label="资源排行榜" name="4">优秀资源排行榜</el-tab-pane>
          <el-tab-pane label="我有作品" name="5">我有作品</el-tab-pane>
          <el-tab-pane label="我有资源" name="6">我有资源</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="list" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,.5)">
      <ul class='list-item' :class="filter.value === 'product' ? 'product' : 'resource'">
        <li v-for="(i, index) in list" :key="index" class="item" :class="filter.value === 'product' ? 'product' : 'resource'" v-if='index<10' @click='go(i.url,1)'>
          <div class="top" v-if="filter.value === 'product'">
            <img :src="i.imgurl" alt="">
          </div>
          <div class="bottom">
            <h2><span>{{i.title}}</span> <span class="see" v-if="filter.value === 'resource'"><el-button type="primary" size='small' round @click='go(i.url)'>查看资源</el-button></span></h2>
            <p>{{i.description}}</p>
          </div>
        </li>
        <li v-if='list.length<10 && list.length>0' class="item" :class="filter.value === 'product' ? 'product' : 'resource plus'" @click='addlist'><i class="el-icon-plus avatar-uploader-icon"></i></li>
      </ul>
      <el-pagination @current-change='change' background layout="prev, pager, next" :total="total" class="pagination" v-if="list.length">
      </el-pagination>
    </div>
    <div class="from">
      <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
        <el-form status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item :label="`${this.title}标题`">
            <el-input v-model="item.title" :placeholder="item.type === 'product' ? 'Nebulas 星云链' : '星云链官方论坛'" ref="title"></el-input>
          </el-form-item>
          <el-form-item :label="`${this.title}描述`">
            <el-input type="textarea" :rows="3" ref="description" :placeholder="item.type === 'product' ? '星云链是全球首个区块链搜索引擎，发掘区块链价值新维度。通过定义区块链世界的基本价值尺度，帮助用户更高效地发现和使用区块链上日渐丰富的的价值信息。' : '星云链官方社区，资讯，技术讨论，知识库，官方周报一往打尽'" v-model="item.description">
            </el-input>
          </el-form-item>
          <el-form-item :label="`${this.title}地址`">
            <el-input v-model="item.url" :placeholder="item.type === 'product' ? 'https://nebulas.io/' : 'http://nasfans.io/forum.php'" ref="url"></el-input>
          </el-form-item>
          <el-form-item :label="`${this.title}图标`" v-if="item.type === 'product'">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeAvatarUpload">
              <img v-if="item.imgurl" :src="item.imgurl" class="avatar">
              <div v-else>
                <p class="avatar-uploader-tip">图片需小于50KB</p>
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add" :loading="loading">发布{{title}}</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  
  </div>
</template>

<script>
  import Api from './untils/until'
  import {
    upload
  } from './untils/index'
  let api = new Api('n1urT5iXQcDHXvSg2e6Kk4wa9Lhgs94z9iX');
  let time = null;
  export default {
    name: 'App',
    data() {
      return {
        loading: false,
        activeName: '1',
        searchTitle: '',
        dialogTitle: '',
        title: '',
        dialogTableVisible: false,
        showfront: true,
        serialNumber: false,
        mask: false,
        item: {
          title: '',
          description: '',
          url: '',
          type: 'product',
          imgurl: ''
        },
        start: 0,
        end: 10,
        total: 0,
        filter: {
          key: 'type',
          value: 'product'
        },
        list: []
      }
    },
    created() {
      this.init();
    },
    mounted(){

      //to check if the extension is installed
      //if the extension is installed, var "webExtensionWallet" will be injected in to web page
      if (typeof (webExtensionWallet) === "undefined") {
         this.$alert('请先在谷歌浏览器安装星云链钱包插件', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
            window.open('https://github.com/ChengOrangeJu/WebExtensionWallet');
          }
        });
      } else {}
    },
    methods: {
      init(obj) {
        if (obj) {
          this.list = []
          this.filter.value = obj.type === 'product' ? "product" : "resource";
        }
        this.loading = !this.loading;
        this.len().then(() => {
          api.get(this.start, this.end, this.filter).then(r => {
  
            this.list = r;
            if (obj) {
              console.log('返回得list是')
              console.log(this.list)
              this.list.unshift(obj);
              this.total++
              this.activeName = obj.type === 'product' ? "1" : "2";
            }
            this.loading = !this.loading;
            this.reset();
          })
        });
  
  
      },
      change(num) {
        this.start = (num - 1) * 10;
        this.end = this.start + 10;
        this.init();
      },
      len() {
        return api.len(this.filter).then(r =>this.total = r)
      },
      add() {
        if (!this.item.title) {
          this.$message.error(`${this.title}标题不能为空哦！`);
          this.$refs.title.focus();
          return
        }
        if (this.item.title.length>36) {
          this.$message.error(`${this.title}标题需小于36个字符！`);
          this.$refs.title.focus();
          return
        }
        if (!this.item.description) {
          this.$message.error(`${this.title}描述不能为空哦！`);
          this.$refs.description.focus();
          return
        }
        if (this.item.description.length>120) {
          this.$message.error(`${this.title}描述需小于120个字符！`);
          this.$refs.description.focus();
          return
        }
        if (!this.item.url) {
          this.$message.error(`${this.title}链接地址不能为空哦！`);
          this.$refs.url.focus();
          return
        }
        if (!/^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(this.item.url)) {
          this.$message.error(`${this.title}链接地址格式不正确！`);
          this.$refs.url.focus();
          return
        }
        if (this.item.type === 'product' && !this.item.imgurl) {
          this.$message.error(`请上传${this.title}图标！`);
          this.$refs.url.focus();
          return
        }
        
        this.loading = !this.loading;
        api.set(this.item).then(r => {
          this.start = 0;
          this.end = 10;
          this.loading = !this.loading;
          this.serialNumber = r;
        })
      },
      query() {
        this.loading = !this.loading;
        api.query(this.serialNumber).then(r => {
          if (!r.code) {
            this.$message({
              message: `添加${this.title}成功！`,
              type: 'success'
            });
            clearInterval(time);
            time = null;
            this.loading = false;
            this.dialogTableVisible = false;
            this.init(this.item);
          }
        })
      },
      search() {
        this.start = 0;
        this.end = 10;
        this.total = 10;
        this.loading = !this.loading;
        if(!this.searchTitle){
          this.init();
          return
        }
        api.search(this.searchTitle).then(r => {
          this.loading = !this.loading;
          this.list = r
        })
      },
      go(url,type) {
        if (!url) return
        if(type && this.filter.value === 'resource') return
        window.open(url);
      },
      addlist() {
        if (this.filter.value === 'product') {
          this.dialogTableVisible = !this.dialogTableVisible;
          this.title = '作品';
          this.item.type = 'product';
        }
        if (this.filter.value === 'resource') {
          this.dialogTableVisible = !this.dialogTableVisible;
          this.title = '资源';
          this.item.type = 'resource';
        }
        this.dialogTitle = `我有${this.title}`;
      },
      tab(e) {
        this.reset();
        this.start = 0;
        this.end = 10;
        this.total = 10;
        if (e.paneName === '1') {
          this.filter.value = 'product';
          this.init();
        }
        if (e.paneName === '2') {
          this.filter.value = 'resource';
          this.init();
        }
        if (e.paneName === '3') {
          this.$notify.info({
            title: '消息',
            message: '作品排行榜功能正在开发中，敬请期待！'
          });
          return
        }
        if (e.paneName === '4') {
          this.$notify.info({
            title: '消息',
            message: '资源排行榜功能正在开发中，敬请期待！'
          });
          return
        }
        if (e.paneName === '5') {
          this.dialogTableVisible = !this.dialogTableVisible;
          this.title = '作品';
          this.item.type = 'product';
        }
        if (e.paneName === '6') {
          this.dialogTableVisible = !this.dialogTableVisible;
          this.title = '资源';
          this.item.type = 'resource';
        }
        this.dialogTitle = `我有${this.title}`;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type.includes('image');
        const isLt2M = file.size / 1024 / 1024 < .5;
        if (!isJPG) {
          this.$message.error('上传图片格式不正确!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 50KB!');
        }
        upload(file).then(r => this.item.imgurl = r)
      },
      reset() {
        this.item = {
          title: '',
          des: '',
          url: '',
          imgurl: '',
        }
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

<style lang='scss'>
  #app {
    background: url('../static/bg.jpg') no-repeat center center;
    background-size: 100% 100%;
    min-height: 100vh;
  }
  
  .nav {
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 30px 0 50px;
    width: 1000px;
    display: flex;
    &>div {
      display: flex;
      justify-content: flex-end;
      flex: 1;
      .el-input {
        height: 30px;
        margin-right: 20px;
        width: 150px;
      }
    }
    .el-tabs__item {
      padding: 0 10px
    }
  }
  
  .list {
    width: 1000px;
    margin: auto;
    .el-loading-mask{
      height: 1218px;
      .el-loading-spinner{
        top: 20%;
      }
    }
    .list-item.product {
      flex-wrap: wrap;
      display: flex;
      list-style: none;
      .item.product {
        height: 250px;
        box-sizing: border-box;
        background: #fffefe;
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 6px;
        transition: all .5s;
        text-align: center;
        flex: 0 0 19%;
        margin-left: 1%;
        max-width: 20%;
        cursor: pointer;
        &:nth-child(1),
        &:nth-child(6),
        &:nth-child(11) {
          margin-left: 0;
        }
        &:hover {
          transform: translateY(-16px) scale(1.1);
          box-shadow: 1px 1px 3px 3px #ddd;
        }
        .top {
          height: 50%;
          img {
            border-radius: 50%;
            height: 100px;
            width: 100px;
          }
        }
        .bottom {
          width: 150px;
          height: 50%;
          h2 {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 22px;
            color: #404040;
            line-height: 50px;
          }
          p {
            text-align: left;
            color: #919191;
            font-size: 14px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
      }
    }
    .list-item.resource {
      list-style: none;
      .item.resource {
        background: #fff;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 10px;
        border-bottom: 1px solid #eee;
        transition: all .5s;
        &:hover{
          transform: translateY(-16px) scale(1.1);
          box-shadow: 1px 1px 3px 3px #ddd;
          background-color: #f7f7f7;
        }
        h2 {
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
          .see {
            color: #409EFF;
            text-align: right;
          }
        }
        p{
          line-height: 20px;
          color: #919191;
        }
        .avatar-uploader-icon {
          line-height: 20px;
          height: 20px;
        }
        &.plus {
          cursor: pointer;
          text-align: center
        }
      }
    }
    .pagination {
      padding: 20px 0 40px;
      text-align: center;
    }
  }
  
  .el-tabs__content {
    display: none
  }
  
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-tip {
    position: absolute;
    top: 20px;
    text-align: center;
    left: 0;
    right: 0;
    color: red
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
