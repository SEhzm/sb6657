<template>
  <div class="video" :style="{ left: `${x}vw`, top: `${y}px` }" @mousedown="startDrag">
    <span style="display: block;text-align: center;font-size: 20px">实时直播流</span>
    <videoPlay></videoPlay>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, onBeforeUnmount} from 'vue'
// 用于存储元素X和Y位置的响应性引用
const x = ref(74);
const y = ref(200);

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

</script>

<style>
.video{
  z-index: 1;
  background-color: #fff;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  width: 520px;
}
</style>