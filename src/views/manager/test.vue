<template>
    <div class="search-item">
      <el-popover
          placement="bottom"
          width="475"
          ref="popover"
          trigger="focus"
          :visible-arrow="false"
          style="padding-top: 0"
          v-model="visible">
        <div class="search-content">
          <div class="search-his" v-show="historySearch.length > 0">
            <div>
              <span class="title">搜索历史</span>
              <span class="clear" @click="clearHistory"><i class="el-icon-circle-close"></i>清空</span>
            </div>
            <el-tag
                v-for="tag in historySearch"
                :key="tag.name"
                size="small"
                closable
                style="margin-right: 10px; margin-top: 10px; cursor: pointer"
                @click="handleSearch(tag.name)"
                :type="tag.type">
              {{tag.name}}
            </el-tag>
          </div>
  
          <div :class="'search-hot ' + (historySearch.length > 0 ? 'mt' : '') ">
            <span class="title">热门搜索</span>
            <ul class="hot-list">
              <li v-for="(item, index) in items" :key="index" class="hot-item">
                <span v-if="index < 3" class="top">
                  <i class="iconvs vs-hot"></i>
                </span>
                <span v-else>
                  {{ index + 1 }}
                </span>
                <span @click="handleSearch(item)">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-popover>
      <el-input
          size="medium"
          :placeholder="tipsWord"
          style="width: 500px"
          clearable
          v-popover:popover
          @keyup.enter.native="searchRequest"
          v-model="search">
        <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer" @click="searchRequest"></i>
      </el-input>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        isMouseOver: false,
        search: '',
        tipsWord: '',
        historySearch: [
          { name: '标签一66666', type: 'info' },
          { name: '标签二无敌无敌', type: 'info' },
          { name: '标签三66', type: 'info' },
          { name: '标签四1', type: 'info' },
          { name: '标签四2', type: 'info' },
          { name: '标签四3', type: 'info' },
          { name: '标签四4', type: 'info' },
          { name: '标签五', type: 'danger' }
        ],
        items: [
          '重生之我是都市霸主',
          '热搜',
          '热搜重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主重生之我是都市霸主',
          '热搜',
          '热搜',
          '热搜',
          '热搜',
          '热搜',
          '热搜',
          '热搜'
        ]
      }
    },
    methods: {
      handleSearch(word) {
        this.search = word
        this.searchRequest()
      },
      clearHistory() {
        this.historySearch = []
      },
      searchRequest() {
        const params = {
          word: this.search || this.tipsWord
        }
        const queryString = new URLSearchParams(params).toString();
        const url = `${window.location.origin}/video/search?${queryString}`;
        window.open(url, '_blank');
      }
    },
    mounted() {
      this.tipsWord = this.items[0]
    }
  };
  </script>
  
  <style scoped>
  .search-item ::v-deep .el-input .el-input__inner {
    border-radius: 8px !important;
  }
  
  .search-content span.title {
    display: inline-block;
    font-size: 15px;
    font-weight: bold;
  }
  
  .search-content .search-his span.clear {
    float: right;
    cursor: pointer;
  }
  
  .search-content .search-his span.clear:hover {
    color: #00aeec;
  }
  
  .search-content .mt {
    margin-top: 10px;
  }
  
  .search-content .search-hot {
    width: 100%;
  }
  
  .search-content .search-hot ul.hot-list {
    width: 100%;
    display: flex;
    padding: 0;
    flex-wrap: wrap;
    margin-top: 5px;
    list-style: none;
  }
  
  .search-content .search-hot ul.hot-list li.hot-item {
    width: 50%;
    height: 30px;
    font-size: 15px;
    display: flex;
    cursor: pointer;
    align-items: center;
  }
  
  .search-content .search-hot ul.hot-list li.hot-item span:first-child {
    width: 10%;
    color: #999999;
    text-align: center;
    display: inline-block;
  }
  
  .search-content .search-hot ul.hot-list li.hot-item span:last-child {
    margin-left: 5px;
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .search-content .search-hot ul.hot-list li.hot-item span.top {
    color: #EA322BFF;
  }
  
  .search-content .search-hot ul.hot-list li.hot-item:hover {
    background-color: #f2f2f2;
  }
  
  </style>
  
  