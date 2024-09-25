<template>
  <div>
    <div class="header">
      <div style="flex: 1">
        <div class="header-content">
          <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
            <img src="/public/favicon.ico" alt="大狗头" class="logo-img"/>
            <p class="header-title">斗鱼玩机器烂梗收集</p>
          </a>
          <div class="header-actions">
            <el-button type="primary" @click="complaintButton" class="complaint-button">
              <span>上传照片<br>建议/提交BUG</span>
            </el-button>
            <a href="https://gitee.com/hzming1/machine63136-vue3-springboot" target="_blank">
              <img src="@/assets/imgs/gitee.png" alt="gitee" class="icon-img"/>
            </a>
            <a href="https://yuba.douyu.com/user/main/lOdEpeOJzwnR" target="_blank">
              <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img"/>
            </a>
            <a href="https://github.com/SEhzm/machine63136.icu-" target="_blank">
              <img src="@/assets/imgs/github.png" alt="github" class="icon-img"/>
            </a>
            <el-image class="icon-img-rounded" :src="url" :hide-on-click-modal="true" :zoom-rate="1.2" :max-scale="7"
                      lazy :min-scale="0.2"
                      :preview-src-list="['zfb.jpg']"
                      :initial-index="4" fit="cover"/>
            <el-image class="icon-img-rounded" :src="wxurl" :hide-on-click-modal="true" :zoom-rate="1.2" lazy
                      :max-scale="7" :min-scale="0.2"
                      :preview-src-list="['wx.jpg']"
                      :initial-index="4" fit="cover"/>
          </div>
        </div>
      </div>
    </div>

    <div class="tab"> <!--    移动端-->
      <div :class="`tab1 ${item.path === route.path ? 'selected' : 'none'}`" v-for="item in table" :key="item.path"
           @click="navigateTo(item.path)"> {{ item.text }}
      </div>
    </div>

    <div class="main-content">
      <div class="sidebar">
        <el-menu router style="border: none; margin-right: auto"
                 :default-active="$route.path"
                 :default-openeds="['/home', '2']" :collapse="isCollapse">
          <el-button type="primary" @click="toggleCollapse" class="collapse-button">折叠
          </el-button>

          <el-menu-item index="/home">
            <el-icon>
              <HomeFilled/>
            </el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-menu-item index="/AllBarrage">
            <el-icon>
              <List/>
            </el-icon>
            <span>全部烂梗</span>
          </el-menu-item>

          <el-menu-item index="/image">
            <el-icon>
              <Camera/>
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
            <el-icon><ChatDotRound /></el-icon>
            <span>直播间互喷篇</span>
          </el-menu-item>

          <el-menu-item index="/penPlayer">
            <el-icon>🦐</el-icon>
            <span>喷选手篇</span>
          </el-menu-item>

          <el-menu-item index="/p1">
            <el-icon><plus/></el-icon>
            <span>+1篇</span>
          </el-menu-item>

          <el-menu-item index="/QMLW">
            <el-icon>
              <User/>
            </el-icon>
            <span>群魔乱舞篇</span>
          </el-menu-item>

          <el-menu-item index="/QUQU">
            <img src="@/assets/imgs/Z.png" alt="Z!!" class="menu-icon"/>
            <span>QUQU篇</span>
          </el-menu-item>


        </el-menu>
      </div>
      <div class="content">
        <router-view/>
      </div>
    </div>
  </div>

</template>


<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {ref} from 'vue';

const table = [
  {text: '首页', path: '/home'},
  {text: '+1', path: '/p1'},
  {text: '喷玩机器篇', path: '/penWJQ'},
  {text: '喷选手篇', path: '/penPlayer'},
  {text: '群魔乱舞篇', path: '/QMLW'},
  {text: '全部烂梗', path: '/AllBarrage'},
  {text: 'QUQU篇', path: '/QUQU'},
  {text: '时光相册', path: '/image'},
];
const route = useRoute();
const router = useRouter();

function navigateTo(path: string): void {
  router.push(path);
}

const isCollapse = ref(false);

const complaintButton = () => {
  window.open("https://www.wjx.cn/vm/rQUgnS0.aspx#");
};

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

const $route = useRoute();
console.log($route.path);
const url = "https://pic.imgdb.cn/item/66992905d9c307b7e9f0136e.png";
const wxurl =
    "https://pic.imgdb.cn/item/66dd952dd9c307b7e9321a73.png";
</script>

<style lang="scss">

@media (min-width: 601px) {
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
  }

  .el-menu.el-menu--vertical.v-enter-to {
    background-color: rgba(255, 255, 255, 0) !important;
  }

  .el-menu .el-menu-item:hover {
    outline: 0 !important;
    color: #2E95FB !important;
    background: linear-gradient(270deg, #F2F7FC 0%, #FEFEFE 100%) !important;
  }


  .header {
    height: 55px;
    opacity: 1;
    display: flex;
    align-items: center;
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
  }

  .header-title {
    color: #ff552e;
    font-size: 35px;
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

  .collapse-button {
    margin-top: 2%;
    align-content: center;
    width: 96%;
    margin-left: 2%;
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
    width: 20px;
    height: 20px;
    border-radius: 5px;
    margin-right: 5px;
  }

  .complaint-button {
    width: 95px;
    height: 30px;
    font-size: 12px;
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
    overflow-x: auto;
    white-space: nowrap;
    //关掉滑动条
    //scrollbar-width: none;
    //-ms-overflow-style: none;
    //
    //&::-webkit-scrollbar { /* Webkit browsers (Chrome, Safari) */
    //  width: 8px;
    //}

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }

    & > div {
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

    & > div:hover,
    & > .selected {
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