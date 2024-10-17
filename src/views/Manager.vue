<template>
  <div>
    <div class="tab">
      <!-- 移动端 -->
      <div class="tab-container">
        <div :class="`tab1 ${item.path === route.path ? 'selected' : 'none'}`" v-for="(item, index) in table"
          :key="item.path" @click="navigateTo(item.path)">
          {{ item.text }}
        </div>
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
            <el-icon>玩</el-icon>
            <span>喷玩机器篇</span>
          </el-menu-item>

          <el-menu-item index="/mygo">
            <el-icon>
              <Female />
            </el-icon>
            <span>木柜子篇</span>
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


<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, } from "vue";
import httpInstance from "@/apis/httpInstance";

const loading = ref(true);
const table = [
  { text: "首页", path: "/home" },
  { text: "+1", path: "/p1" },
  { text: "喷玩机器篇", path: "/penWJQ" },
  { text: "木柜子篇", path: "/mygo" },
  { text: "喷选手篇", path: "/penPlayer" },
  { text: "群魔乱舞篇", path: "/QMLW" },
  { text: "全部烂梗", path: "/AllBarrage" },
  { text: "QUQU篇", path: "/QUQU" },
  { text: "时光相册", path: "/image" },
];
const route = useRoute();
const router = useRouter();

const data = reactive({
  filteredItems: [],
  tableData: [],
  table: "",
  barrage: "",
  hotBarrageOf10: [],
  hotBarrageOf7day: [],
});

const hotBarrageOf10 = () => {
  httpInstance
    .get("/machine/hotBarrageOfAll")
    .then((res) => {
      data.hotBarrageOf10 = res.data.slice(0, 10) || [];
      // console.log(data.hotBarrageOf10)
      loading.value = false;
    })
    .catch((err) => {
      console.error("加载数据失败:", err);
    });
};
hotBarrageOf10();

function navigateTo(path) {
  router.push(path);
}

const $route = useRoute();
console.log($route.path);
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 10;
  border: none;
}

@media (min-width: 601px) {
  .el-dialog {
    --el-dialog-width: 50%;
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
    color: #2e95fb !important;
    background: linear-gradient(270deg, #f2f7fc 0%, #fefefe 100%) !important;
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

  .eldtable {
    width: 100% !important;
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
    scrollbar-width: none; // 确保 Firefox 也隐藏滚动条
    -ms-overflow-style: none; // IE 和 Edge
    -webkit-overflow-scrolling: touch; // 启用原生滚动效果
    touch-action: pan-x; // 允许水平滚动，阻止其他触摸行为
  }

  .tab-container {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
  }

  .tab1 {
    position: relative;
    white-space: nowrap;
    padding: 10px 5px;
    margin-right: 10px;
    border-radius: 15px 15px 0 0;
    transition: all 0.3s ease;
    font-size: 14px;
    color: #000000;
    background-color: #fff;
    flex-shrink: 0; // 防止缩小
    touch-action: pan-x;
  }

  .tab1::before {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    background-color: transparent;
    transition: all 0.3s ease;
  }

  .none {
    background-color: #93a2b9;
    padding: 10px;
  }

  .tab1:hover,
  .selected {
    color: #fff;
    background-color: #007bff;
    

    &::before {
      background-color: #007bff;
    }
    padding-left: 15px; /* 左侧 padding 增加 10px */
    padding-right: 15px; /* 右侧 padding 增加 10px */

  }

  .tab::-webkit-scrollbar {
    /* Webkit browsers (Chrome, Safari) */
    height: 8px;
  }

  .tab::-webkit-scrollbar-track {
    background: transparent;
  }

  .tab::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  //移动端
}
</style>