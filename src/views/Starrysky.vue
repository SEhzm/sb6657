<template>
  <el-popover placement="left" title="" :width="200" trigger="hover" :visible="diaochaSetTime"
    content="官方交流🐧:327113203">
    <template #reference>
      <el-button id="diaocha" type="plain" @mouseover="diaochaSetTime = 1000"
        @click="dialogVisible = 'true'">官方交流🐧</el-button>
    </template>
  </el-popover>
  <el-dialog v-model="dialogVisible" style="" draggable="true" title="官方交流🐧" width="410px">
    <img src="https://cdn.hguofichp.cn/qrcode_1745479143567%20(1).jpg" alt="" style="width: 385px;height: 685px;">
  </el-dialog>
  <div id="bg">
    <div class="body" id="bodyId">
      <div class="stars" ref="starsRef">
        <div class="star" v-for="(item, index) in starsCount" :key="index"></div>
      </div>
    </div>
  </div>
  <div class="draggable chat-room-draggable" :style="{ left: `${chatX}vw`, top: `${chatY}px` }"
    @mousedown="startDrag($event, 'chat')" v-show="isChatVisible">
    <ChatRoom></ChatRoom>
    <el-button class="close-button" @click="closeChat" type="primary">
      <svg t="1725098483582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4538" width="16" height="16">
        <path d="M0 0h1024v1024H0z" fill="#ff0505" fill-opacity="0" p-id="4539"></path>
        <path
          d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z"
          fill="#ff0505" p-id="4540"></path>
      </svg>
    </el-button>
  </div>
  <!-- <div v-if="route.path === '/home'"
    class="draggable annual-hot-list-draggable" 
    :style="{ left: `${annualX}vw`, top: `${annualY}px` }" 
    @mousedown="startDrag($event, 'annual')"
    v-show="isHotVisible"
  >
    <AnnualHotList></AnnualHotList>
    <el-button class="close-button-1" @click="closeHot" type="primary">
      <svg t="1725098483582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4538" width="16" height="16">
        <path d="M0 0h1024v1024H0z" fill="#ff0505" fill-opacity="0" p-id="4539"></path>
        <path d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z" fill="#ff0505" p-id="4540"></path>
      </svg>
    </el-button>
  </div> -->
</template>

<script setup>
import ChatRoom from '@/components/ChatRoom.vue';
import AnnualHotList from '@/components/AnnualHotList.vue';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import httpInstance from '@/apis/httpInstance';

// 用于存储元素X和Y位置的响应性引用
const chatX = ref(85);
const chatY = ref(110);
const annualX = ref(8.2);
const annualY = ref(120);
const isChatVisible = ref(true);
const isHotVisible = ref(true);
const dialogVisible = ref(false)
// 是否正在拖动的标志
const isDragging = ref(false);
let currentDraggingComponent = null;
const diaochaSetTime = ref(true)
// onMounted(() => {
//   if (!localStorage.getItem('diaochawenjuan')) {
//     localStorage.setItem('diaochawenjuan', '2')
//   }
// })

setTimeout(() => {
  diaochaSetTime.value = false
  // if(localStorage.getItem('diaochawenjuan')>0){
  //   setTimeout(() => {
  //     localStorage.setItem('diaochawenjuan',localStorage.getItem('diaochawenjuan')-1)
  //     document.getElementById('diaocha').click();
  //   },30 * 1000);
  // }
}, 2 * 1000)

// 开始拖动的函数
const startDrag = (event, component) => {
  currentDraggingComponent = component;
  // 记录初始鼠标位置
  const initialMouseX = event.clientX;
  const initialMouseY = event.clientY;

  // 记录初始元素位置
  const initialX = component === 'chat' ? chatX.value : annualX.value;
  const initialY = component === 'chat' ? chatY.value : annualY.value;

  // 开始拖动，设置为true
  isDragging.value = true;

  // 当鼠标移动时执行的函数
  const dragging = (moveEvent) => {
    // 只有在拖动时才执行
    if (isDragging.value) {
      // 计算鼠标移动的距离
      const deltaX = moveEvent.clientX - initialMouseX;
      const deltaY = moveEvent.clientY - initialMouseY;

      // 更新元素的位置
      if (component === 'chat') {
        chatX.value = initialX + deltaX / 19.2;
        chatY.value = initialY + deltaY;
      } else if (component === 'annual') {
        annualX.value = initialX + deltaX / 19.2;
        annualY.value = initialY + deltaY;
      }
    }
  };

  // 鼠标释放时停止拖动的函数
  const stopDrag = () => {
    // 结束拖动，设置为false
    isDragging.value = false;

    // 移除事件监听器
    document.removeEventListener('mousemove', dragging);
    document.removeEventListener('mouseup', stopDrag);
  };

  // 添加鼠标移动和释放时的事件监听器
  document.addEventListener('mousemove', dragging);
  document.addEventListener('mouseup', stopDrag);
};

//星星
let starsRef = ref(null);
const starsCount = 200; //星星数量
const distance = 700; //间距
onMounted(() => {
  let starNodes = Array.from(starsRef.value.children);
  starNodes.forEach((item) => {
    let speed = 0.2 + Math.random() * 1;
    let thisDistance = distance + Math.random() * 300;
    item.style.transformOrigin = `0 0 ${thisDistance}px`;
    item.style.transform = `
        translate3d(0,0,-${thisDistance}px)
        rotateY(${Math.random() * 460}deg)
        rotateX(${Math.random() * -50}deg)
        scale(${speed},${speed})`;
  });
});

// -------流星脚本开始-------
const createMeteor = () => {
  let meteor = document.createElement("div");
  meteor.classList.add("meteor");
  meteor.style.position = "absolute";
  meteor.style.height = "2px";
  meteor.style.background = "linear-gradient(to right, #fff, rgba(0, 0, 0, 0))";
  meteor.style.width = Math.random() * 10 + 100 + "px";
  meteor.style.right = Math.random() * window.innerWidth + "px";
  meteor.style.top = Math.random() * (window.innerHeight / 3) + "px";
  document.getElementById("bodyId").prepend(meteor);

  // 获取流星的初始位置
  const meteorRect = meteor.getBoundingClientRect();
  // 计算滑动距离
  const distance = window.innerHeight / 2 - meteorRect.top + Math.random() * 50;
  // 设置动画持续时间，根据距离和随机速度计算
  const duration = (distance / (160 + Math.random() * 50)) * 1000; // 调整速度倍数
  // 创建动画，斜着向下滑动
  meteor.style.animation = `myMeteor ${duration}ms linear forwards`;
  // 修改 myMeteor 动画
  const myMeteor = `@keyframes myMeteor {
    0% {
      transform: translate(0, 0) rotate(-30deg); // 初始位置
    }
    90%{
      opacity: .8;
    }
    100% {
      opacity: 0;
      transform: translate(-${distance}px, ${distance}px) rotate(-30deg); // 终点位置
    }
  }`;

  // 将 CSS 代码添加到 style 标签中
  const style = document.createElement("style");
  style.innerHTML = myMeteor;
  document.head.appendChild(style);

  // 移除流星
  setTimeout(() => {
    meteor.remove();
  }, duration);
};

const createMeteorInterval = setInterval(() => {
  createMeteor();
}, 5000 + Math.random() * 2000);
// -------流星脚本结束-------

// 在组件销毁时清除定时器
onBeforeUnmount(() => {
  clearInterval(createMeteorInterval);
});

const closeChat = () => {
  httpInstance.get('/machine/chat/status').then(res => {
  });
  isChatVisible.value = false;
};
const closeHot = () => {
  isHotVisible.value = false;
};
</script>

<style scoped>
.close-button:hover {
  color: black;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  width: 30px;
  height: 25px;
}

.close-button-1 {
  position: absolute;
  top: 5px;
  left: 460px;
  background: transparent;
  width: 30px;
  height: 25px;
}

#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -100;
}

.body {
  position: absolute;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: radial-gradient(200% 100% at bottom center,
      #f7f7b6,
      #e96f92,
      #1b2947);
  background: radial-gradient(200% 110% at top center,
      #1b2947 10%,
      #75517d 40%,
      #e96f92 65%,
      #f7f7b6);
  background-attachment: fixed;
  overflow: hidden;
}

@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }

  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(-360deg);
  }
}

.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 55%;
  animation: rotate 100s infinite linear;
  bottom: 0;
}

.star {
  width: 2px;
  height: 2px;
  background: #f7f7b6;
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden;
}

.draggable {
  box-shadow: 0px 7px 30px 0px rgba(100, 100, 111, 0.3);
  background-color: white;
  border-radius: 10px;
  margin-top: -50px;
  width: 250px;
  right: 30px;
  position: fixed;
  cursor: Move;
  /* 设置鼠标样式为可移动状态 */
  z-index: 100;
}

#diaocha {
  position: fixed;
  top: 55%;
  right: 0;
  writing-mode: vertical-rl;
  text-orientation: upright;
  white-space: nowrap;
  height: 70px;
  width: 30px;
  z-index: 1000;
}

@media (max-width: 600px) {
  .draggable {
    margin-top: 50px;
  }

  .close-button {
    display: none;
  }

  .chat-room-draggable {
    display: none;
  }

  .annual-hot-list-draggable {
    display: none;
  }

  #diaocha {
    position: fixed;
    top: 55%;
    right: 0;
    writing-mode: vertical-rl;
    text-orientation: upright;
    white-space: nowrap;
    height: 60px;
    width: 13px;
    font-size: 11px;
    z-index: 1000;
    padding: 8px 10px;
  }
}
</style>