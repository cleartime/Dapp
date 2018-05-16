<template>
  <div id="app">
    <div class="nav">
      <img src="./assets/logo.png" alt="">
      <div>
        <el-input placeholder="搜索作品、资源" v-model="searchTitle">
          <i slot="prefix" class="el-input__icon el-icon-search" @click='search'></i>
        </el-input>
        <el-tabs @tab-click="tab" v-model="activeName">
          <el-tab-pane label="优秀作品" name="1">优秀作品</el-tab-pane>
          <el-tab-pane label="学习资源" name="2">学习资源</el-tab-pane>
          <el-tab-pane label="作品排行榜" name="3">作品排行榜</el-tab-pane>
          <el-tab-pane label="资源排行榜" name="4">资源排行榜</el-tab-pane>
          <el-tab-pane label="我有作品" name="5">我有作品</el-tab-pane>
          <el-tab-pane label="我有资源" name="6">我有资源</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="list" v-if="list.length" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <ul>
        <li v-for="(i, index) in list" :key="index" @click='go(i.url)' class="item">
          <h2>{{i.title}}</h2>
          <p>{{i.description}}</p>
        </li>
      </ul>
      <el-pagination @current-change='change' background layout="prev, pager, next" :total="total" class="pagination">
      </el-pagination>
    </div>
    <div class="from">
      <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
        <el-form status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item label="作品标题">
            <el-input v-model="item.title" placeholder="Nebulas 星云链" ref="title"></el-input>
          </el-form-item>
          <el-form-item label="作品描述">
            <el-input type="textarea" :rows="3" ref="description" placeholder="星云链是全球首个区块链搜索引擎，发掘区块链价值新维度。通过定义区块链世界的基本价值尺度，帮助用户更高效地发现和使用区块链上日渐丰富的的价值信息。" v-model="item.description">
            </el-input>
          </el-form-item>
          <el-form-item label="作品地址">
            <el-input v-model="item.url" placeholder="https://nebulas.io/" ref="url"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add">提交</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  
  </div>
</template>

<script>
  import Api from './untils/until'
  let api = new Api('n1tyM9ErCqXiAfnfXCSgqiGPHzz43nYcyWc');
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
        },
        start: 0,
        end: 10,
        total: 0,
        filter:{
          key: 'type',
          value: 'product'
        },
        list: []
      }
    },
    created() {
      this.len();
      this.init(0);
    },
    methods: {
      init() {
        this.loading = !this.loading;
        api.get(this.start, this.end, this.filter).then(r => {
          this.list = r;
          this.loading = !this.loading;
        })
      },
      change(num) {
        this.start = (num - 1) * 10;
        this.end = this.start + 10;
        this.init();
      },
      len() {
        api.getAll(this.filter).then(r => this.total = r)
      },
      add() {
        if (!this.item.title) {
          this.$message.error(`${this.title}标题不能为空哦！`);
          this.$refs.title.focus();
          return
        }
        if (!this.item.description) {
          this.$message.error(`${this.title}描述不能为空哦！`);
          this.$refs.description.focus();
          return
        }
        if (!this.item.url) {
          this.$message.error(`${this.title}地址不能为空哦！`);
          this.$refs.url.focus();
          return
        }
        api.set(this.item).then(r => {
          this.serialNumber = r;
        })
      },
      query() {
        this.loading = true;
        api.query(this.serialNumber).then(r => {
          if (!r.code) {
            this.$message({
              message: `添加${this.title}成功！`,
              type: 'success'
            });
            // this.list.push(this.item)
            this.activeName = '1';
            clearInterval(time);
            time = null;
            this.loading = false;
            this.dialogTableVisible = false;
          }
        })
      },
      search() {
        api.search(this.searchTitle).then(r => this.list = r)
      },
      go(url) {
        if (!url) return
        location.href = url;
      },
      tab(e, d) {
        if (e.paneName === '1') {
          this.filter.value = 'product';
          this.init();
        }
        if (e.paneName === '2') {
          this.filter.value = 'resource';
          this.init();
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
    background: url('./assets/bg.jpg') no-repeat center center;
    background-size: 100% 100%;
    min-height: 100vh;
  }
  
  .nav {
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    padding: 30px 0;
    width: 1000px;
    display: flex;
    img {}
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
  }
  
  .list {
    width: 1000px;
    margin: auto;
    ul {
      list-style: none;
      .item {
        background: #fffefe;
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 5px;
        &:hover {
          cursor: pointer;
          background: #f7f7f7;
        }
        h2 {
          line-height: 22px;
          font-size: 22px;
          color: #404040;
        }
        p {
          color: #919191;
          font-size: 14px;
        }
      }
    }
    .pagination{
      padding: 20px 0 40px;
      text-align: center;
    }
  }
  
  .el-tabs__content {
    display: none
  }
</style>
