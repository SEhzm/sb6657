<template>
  <div>
    <div class="header">
      <div style="flex: 1">
        <div class="header-content">
          <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
            <img src="/public/favicon.ico" alt="大狗头" class="logo-img" />
            <p class="header-title">斗鱼玩机器烂梗收集</p>
          </a>

          <div class="header-actions">
            <img src="@/assets/imgs/hot.png" alt="热门" style="width: 24px;height: 24px;cursor:pointer;margin-right: 10px"
              class="hotBarrageImg" @click="hotDialog = true">
            <div @click="hotDialog = true" class="hotBarrage"
              style="cursor:pointer;width:300px;overflow: hidden; text-overflow: ellipsis;color: black;white-space: nowrap;">
              <transition name="fade">
                <span :key="currentBarrageIndex" class="hotBarrageSpan">热门：{{
                  data.hotBarrageOf10[currentBarrageIndex]?.barrage }}</span>
              </transition>
            </div>

            <div style="margin-right: 20px;" class="elinput">
              <el-input v-model="searchQuery" clearable placeholder='搜索烂梗...' style="font-size: 18px;">
                <template #prefix>
                  <el-icon>
                    <search />
                  </el-icon>
                </template>
              </el-input>
            </div>

            <el-button type="primary" @click="complaintButton" class="complaint-button">
              <span>上传照片<br>建议/提交BUG</span>
            </el-button>
            <a href="https://gitee.com/hzming1/sb6657" target="_blank">
              <img src="@/assets/imgs/gitee.png" alt="gitee" class="icon-img" />
            </a>
            <a href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
              <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
            </a>
            <a href="https://github.com/SEhzm/sb6657/" target="_blank">
              <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
            </a>
              <el-image id="myDiv" class="icon-img-rounded" :src="url" :hide-on-click-modal="true" :zoom-rate="1.2"
                :max-scale="7" lazy :min-scale="0.2" :preview-src-list="['zfb.jpg']" :initial-index="4" fit="cover" />
            <el-image class="icon-img-rounded" :src="wxurl" :hide-on-click-modal="true" :zoom-rate="1.2" lazy
              :max-scale="7" :min-scale="0.2" :preview-src-list="['wx.jpg']" :initial-index="4" fit="cover" />
          </div>
        </div>

        <!-- 24h热门弹幕弹出框 -->
        <el-dialog v-model="hotDialog" title="24h热门烂梗"><el-button style=""
            @click="hotDialogOf7day = true, hotDialog = false">查看近七天热门</el-button>
          <el-table v-loading="loading" stripe :data="data.hotBarrageOf10" empty-text="我还没有加载完喔~~" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{ cursor: 'Pointer' }" @row-click="copyText">
            <el-table-column width="45" fixed prop="" label="top10">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column><el-table-column prop="barrage" min-width="90" label="烂梗" />
            <el-table-column label="" align="center" width="85">
              <el-button type="primary" label="操作">复制</el-button>
            </el-table-column>
            <el-table-column prop="cnt" label="复制次数" width="55">
              <template #default="scope">
                {{ scope.row.cnt }}k
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <!-- 七天热门弹幕弹出框 -->
        <el-dialog v-model="hotDialogOf7day" title="七天热门烂梗">
          <el-table v-loading="loading" stripe :data="data.hotBarrageOf7day" empty-text="我还没有加载完喔~~" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{ cursor: 'Pointer' }" @row-click="copyText">
            <el-table-column width="35" fixed prop="" label="排名">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column><el-table-column prop="barrage" min-width="90" label="烂梗" />
            <el-table-column label="" align="center" width="85">
              <el-button type="primary" label="操作">复制</el-button>
            </el-table-column>
            <el-table-column prop="cnt" label="复制次数" width="55">
              <template #default="scope">
                {{ scope.row.cnt }}k
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <div class="QueryTable" v-if="searchQuery">
          <el-table v-loading="loading" :data="filteredItems" stripe @row-click="copyToQueryTableText"
            style="cursor:pointer" empty-text="可能没有这条烂梗或请手动刷新页面">
            <el-table-column prop="barrage" label="弹幕"></el-table-column>
            <el-table-column label="" align="center" width="85">
              <el-button type="primary">复制</el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="tab"> <!--    移动端-->
      <div :class="`tab1 ${item.path === route.path ? 'selected' : 'none'}`" v-for="item in table" :key="item.path"
        @click="navigateTo(item.path)"> {{ item.text }}
      </div>
    </div>

    <div class="main-content" style="position: relative;">
      <div class="sidebar">
        <el-menu router style="border: none; margin-right: auto" :default-active="$route.path">
          <el-menu-item index="/home">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-menu-item index="/AllBarrage">
            <el-icon>
              <List />
            </el-icon>
            <span>全部烂梗</span>
          </el-menu-item>

          <el-menu-item index="/image">
            <el-icon>
              <Camera />
            </el-icon>
            <span>时光相册</span>
          </el-menu-item>

          <el-menu-item index="/penWJQ">
            <el-icon>
              玩
            </el-icon>
            <span>喷玩机器篇</span>
          </el-menu-item>

          <el-menu-item index="/ZbjHuPen">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>直播间互喷篇</span>
          </el-menu-item>

          <el-menu-item index="/penPlayer">
            <el-icon>🦐</el-icon>
            <span>喷选手篇</span>
          </el-menu-item>

          <el-menu-item index="/p1">
            <el-icon>
              <plus />
            </el-icon>
            <span>+1篇</span>
          </el-menu-item>

          <el-menu-item index="/QMLW">
            <el-icon>
              <User />
            </el-icon>
            <span>群魔乱舞篇</span>
          </el-menu-item>

          <el-menu-item index="/QUQU">
            <img src="@/assets/imgs/Z.png" alt="Z!!" class="menu-icon" />
            <span>QUQU篇</span>
          </el-menu-item>


        </el-menu>
      </div>
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, computed, onMounted, onUnmounted , onBeforeUnmount} from 'vue';
import request from "@/utils/request";
import { ElMessage, ElNotification } from 'element-plus';

const hotDialog = ref(false)
const hotDialogOf7day = ref(false)
const loading = ref(true)
const table = [
  { text: '首页', path: '/home' },
  { text: '+1', path: '/p1' },
  { text: '喷玩机器篇', path: '/penWJQ' },
  { text: '喷选手篇', path: '/penPlayer' },
  { text: '群魔乱舞篇', path: '/QMLW' },
  { text: '全部烂梗', path: '/AllBarrage' },
  { text: 'QUQU篇', path: '/QUQU' },
  { text: '时光相册', path: '/image' },
];
const route = useRoute();
const router = useRouter();
const searchQuery = ref('');
const data = reactive({
  tableData: [],
  table: '',
  barrage: '',
  hotBarrageOf10: [],
  hotBarrageOf7day: [],
})
const load = () => {
  request.get('/machine/allBarrage/Page', {})
    .then(res => {
      // console.log(res);
      data.tableData = res.data || [];
      loading.value = false
    })
    .catch(err => {
      console.error('加载数据失败:', err);
    });
};

load();
const hotBarrageOf10 = () => {
  request.get('/machine/hotBarrageOfAll')
    .then(res => {
      data.hotBarrageOf10 = res.data.slice(0, 10) || [];
      // console.log(data.hotBarrageOf10)
    }).catch(err => {
      console.error('加载数据失败:', err);
    })
}
hotBarrageOf10()
const hotBarrageOf7 = () => {
  request.get('/machine/hotBarrageOf7Day')
    .then(res => {
      data.hotBarrageOf7day = res.data || [];
    }).catch(err => {
      console.error('加载数据失败:', err);
    })
}
hotBarrageOf7()
const currentBarrageIndex = ref(0);
let intervalId;

// 开始切换
function startSwitching() {
  intervalId = setInterval(() => {
    currentBarrageIndex.value = (currentBarrageIndex.value + 1) % data.hotBarrageOf10.length;
  }, 5000); // 每五秒切换一次
}

// 在组件挂载时启动定时器
onMounted(() => {
  startSwitching();
});

// 在组件销毁前清除定时器
onUnmounted(() => {
  clearInterval(intervalId);
});



// 过滤搜索结果
const filteredItems = computed(() => {
  const query = searchQuery.value?.toLowerCase();
  if (!query) return [];
  return data.tableData.filter(item => {
    const itemStr = `${item.name}${item.barrage}${item.description}`.toLowerCase();
    return itemStr.includes(query);
  });
});
const open2 = () => {
  ElMessage({
    message: '复制成功',
    type: 'success',
  })
};

const open4 = () => {
  ElMessage({
    message: '复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器',
    type: 'error',
  })
};

//复制搜索结果方法
const copyToQueryTableText = (row) => {
  console.log(row)
  const textToCopy = row.barrage;
  let tempInput = document.createElement('input');
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select(); // 选择对象
  try {
    document.execCommand('Copy'); // 执行浏览器复制命令
    // 复制成功，可以显示提示信息
    open2();
    console.log('内容已复制到剪贴板');
    request.post('/machine/addCnt', {
      table: 'allbarrage',
      id: row.id
    })
    setTimeout(() => hotBarrageOf10(), 200);// 200 毫秒后执行 hotBarrageOf10
    setTimeout(() => hotBarrageOf7(), 200);// 200 毫秒后执行 hotBarrageOf10
  } catch (err) {
    // 复制失败，可以显示错误信息
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};
// 复制热门弹幕方法
const copyText = (row) => {
  // console.log(row)
  const textToCopy = row.barrage;
  let tempInput = document.createElement('input');
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select(); // 选择对象
  try {
    document.execCommand('Copy'); // 执行浏览器复制命令
    // 复制成功，可以显示提示信息
    open2();
    console.log('内容已复制到剪贴板');
    request.post('/machine/addCnt', {
      table: row.tableName,
      id: row.barrageId
    })
    setTimeout(() => hotBarrageOf10(), 200);// 200 毫秒后执行 hotBarrageOf10
    setTimeout(() => hotBarrageOf7(), 200);// 200 毫秒后执行 hotBarrageOf10
  } catch (err) {
    // 复制失败，可以显示错误信息
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};

function navigateTo(path: string): void {
  router.push(path);
}
//定时一小时弹出支持我！！！
setTimeout(function() {
    // IE浏览器
    if (document.all) {
        const myDiv = document.getElementById("myDiv") as HTMLElement | null;
        if (myDiv) {
            myDiv.click();
        }
    }
    // 其它浏览器
    else {
        const myDiv = document.getElementById("myDiv") as HTMLElement | null;
        if (myDiv) {
            const e = document.createEvent("MouseEvents");
            e.initEvent("click", true, true);
            myDiv.dispatchEvent(e);
        }
    }
},  60 * 60 * 1000);   // 一小时


const $route = useRoute();
console.log($route.path);
const url = "https://pic.imgdb.cn/item/66992905d9c307b7e9f0136e.png";
const wxurl =
  "https://pic.imgdb.cn/item/66dd952dd9c307b7e9321a73.png";
</script>

<style lang="scss" scoped>
@media (min-width: 601px) {

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .hotBarrageSpan {
    color: #e4d6b8;
    border-bottom: 1px solid #e4d6b8;
    padding-bottom: 1px;
  }

  .QueryTable {
    padding: 20px;
    z-index: 100;
    position: absolute;
    width: 500px;
    background-color: white;
    border-radius: 10px;
    right: 265px;
    box-shadow: 0px 0px 35px rgb(37, 19, 19);
  }

  .elinput {
    .el-input__wrapper {
      border-radius: 95px;
      border: 0;
      box-shadow: 0 0 0 0px;
    }
  }


  .tab {
    display: none;
  }

  .el-menu {
    background-color: transparent !important;
  }

  .el-menu-item,
  .el-sub-menu .el-menu-item {
    color: black;
    background-color: transparent !important;
  }


  .el-menu-item.is-active,
  .el-sub-menu .el-menu-item.is-active {
    background-color: rgba(255, 255, 255, 0.5) !important;
    color: black;
    border-radius: 5px;
  }

  .el-menu.el-menu--vertical.v-enter-to {
    background-color: rgba(255, 255, 255, 0) !important;
  }

  .el-menu .el-menu-item:hover {
    outline: 0 !important;
    color: #2E95FB !important;
    background: linear-gradient(270deg, #F2F7FC 0%, #FEFEFE 100%) !important;
    border-radius: 5px;
  }


  .header {
    height: 55px;
    display: flex;
    align-items: center;
    width: 100%;
    z-index: 1000;
  }

  .header-content {
    padding-left: 20px;
    display: flex;
    align-items: center;
  }

  .logo-link {
    display: block;
    width: 370px;
    height: 50px;
  }

  .logo-img {
    height: 40px;
    float: left;
    margin: 5px;
    border-radius: 5px;
  }

  .header-title {
    color: #ff552e;
    font-size: 30px;
    align-items: center;
  }

  .header-actions {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
  }

  .complaint-button {
    margin-right: 10px;
  }

  .icon-img {
    width: 31px;
    margin-right: 15px;
  }

  .icon-img-rounded {
    width: 31px;
    height: 31px;
    margin-right: 15px;
    border-radius: 5px;
  }

  .main-content {
    display: flex;
  }

  .sidebar {

    width: auto;
    border-right: 0px solid #ddd;
    min-height: calc(100vh - 60px);
  }



  .menu-icon {
    height: 18px;
    margin-right: 10px;
  }

  .content {
    flex: 1;
    width: 0;
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .hotBarrageSpan {
    color: black;
    border-bottom: 1px solid #e4d6b8;
    padding-bottom: 1px;
  }

  .el-overlay-dialog {
    z-index: 3;
  }

  .el-dialog {
    width: 100vw;
  }

  .hotBarrage {
    position: absolute;
    margin-top: 200px;
    left: 30px;
    z-index: 1;
    color: black;
  }

  .hotBarrageImg {
    z-index: 1;
    top: 200px;
    position: absolute;
    left: 2px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .QueryTable {
    padding: 20px;
    z-index: 1000;
    position: absolute;
    width: 100%;
    background-color: white;
    border-radius: 10px;
    right: 0px;
    box-shadow: 0px 0px 35px rgb(37, 19, 19);
  }

  .elinput {
    .el-input__wrapper {
      border-radius: 95px;
      border: 0;
      box-shadow: 0 0 0 0px;
    }
  }

  .el-image-viewer__img {
    height: 100px;
    width: 100px;
  }

  .el-image-viewer__mask {
    height: 100px;
    width: 100px;
  }

  .icon-img-rounded {
    margin-top: 5px;
    width: 22px;
    height: 20px;
    border-radius: 5px;
    margin-right: 5px;
  }

  .complaint-button {
    width: 80px;
    height: 30px;
    font-size: 11px;
    margin-right: 5px;
  }

  .icon-img {
    margin-top: 5px;
    height: 20px;
    width: 20px;
    margin-right: 5px;
  }

  .sidebar {
    display: none;
  }

  .header-actions {
    display: flex;
    justify-content: flex-end;
    margin-left: 0;
  }

  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .logo-link {
    display: none;
  }

  header-title {
    display: none;
  }

  //移动端
  .tab {
    display: flex;
    overflow-x: scroll;
    white-space: nowrap;
    //关掉滑动条
    // scrollbar-width: none;
    // -ms-overflow-style: none;

    &::-webkit-scrollbar {
      /* Webkit browsers (Chrome, Safari) */
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }

    &>div {
      position: relative;
      white-space: nowrap;
      padding: 10px 15px;
      margin-right: 10px;
      border-radius: 15px 15px 0 0;
      transition: all 0.3s ease;
      font-size: 15px;
      color: #000000;
      background-color: #fff;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 100%;
        background-color: transparent;
        transition: all 0.3s ease;
      }
    }

    .none {
      background-color: #93a2b9;
      padding: 10px;
    }

    &>div:hover,
    &>.selected {
      color: #fff;
      background-color: #007BFF;

      &::before {
        background-color: #007BFF;
      }

    }
  }

  //移动端

}
</style>