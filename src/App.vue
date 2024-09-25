<template>
  <div>
    <RouterView/>
      <StarrySky class="starrySky"/>
<!--    实时直播-->
    <!-- <div class="videos" :style="{ left: `${x}vw`, top: `${y}px` }" @mousedown="startDrag" v-show="isVideoVisible">
      <span style="display: block;text-align: center;font-size: 20px">实时直播流 (应该是挂了，被限流了😅)</span>
      <videoPlay></videoPlay>
      <el-button class="close-button" @click="closeVideo"><svg t="1725098483582" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4538" width="16" height="16"><path d="M0 0h1024v1024H0z" fill="#FF0033" fill-opacity="0" p-id="4539"></path><path d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z" fill="#111111" p-id="4540"></path></svg></el-button>
    </div> -->
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, onBeforeUnmount} from 'vue'
// 用于存储元素X和Y位置的响应性引用
const x = ref(71.5);
const y = ref(500);

const isVideoVisible = ref(true);

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
const closeVideo = () => {
  isVideoVisible.value = false;
};
</script>
<style>

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
}

@media (min-width: 601px) {
  .videos {
    width: 520px;
    right: 30px;
    position: fixed;
    cursor: Move; /* 设置鼠标样式为可移动状态 */
    z-index: 100;
    background-color: #fff;
    border-radius: 15px;
    padding: 10px;
  }
}
@media (max-width: 600px) {
  .videos{
    margin-top: 50px;
    width: 300px;
  }
  .starrySky{
    display: none;
  }
}
</style>