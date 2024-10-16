<!-- 星空背景 -->
<template>
  <div id="bg">
    <div class="body" id="bodyId">
      <div class="stars" ref="starsRef">
        <div
            class="star"
            v-for="(item, index) in starsCount"
            :key="index"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, onBeforeUnmount} from 'vue'
// 用于存储元素X和Y位置的响应性引用
const x = ref(74);
const y = ref(200);
const isAudioVisible = ref(true);
// 是否正在拖动的标志
const isDragging = ref(false);

// 开始拖动的函数
const startDrag = (event) => {
  // 记录初始鼠标位置
  const initialMouseX = event.clientX;
  const initialMouseY = event.clientY;

  // 记录初始元素位置
  const initialX = x.value;
  const initialY = y.value;

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
      x.value = initialX + deltaX / 19.2;
      y.value = initialY + deltaY;
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
        rotateY(${Math.random() * 360}deg)
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

const closeVideo = () => {
  isAudioVisible.value = false;
};
</script>

<style scoped>
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
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: radial-gradient(
      200% 100% at bottom center,
      #f7f7b6,
      #e96f92,
      #1b2947
  );
  background: radial-gradient(
      200% 110% at top center,
      #1b2947 10%,
      #75517d 40%,
      #e96f92 65%,
      #f7f7b6
  );
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



@media (min-width: 601px) {
  .draggable {
    margin-top: -50px;
    width: 450px;
    right: 30px;
    position: fixed;
    cursor: Move; /* 设置鼠标样式为可移动状态 */
    z-index: 100;
  }
}

@media (max-width: 600px) {
.draggable{
  margin-top: 200px;
}

}
</style>