<template>
    <div>
      <!-- 预设标签 -->
      <h3>预设标签</h3>
      <div class="preset-tags">
        <el-button
          v-for="(tag, index) in presetTags"
          :key="index"
          @click="addTag(tag)"
          type="text"
          style="margin-right: 10px; margin-bottom: 10px;"
        >
          {{ tag }}
        </el-button>
      </div>
    
      <!-- 已添加标签 -->
      <h3>已添加标签</h3>
      <el-input-tag
      draggable 
        v-model="addedTags"
        closable
        @close="removeTag"
        placeholder="已添加标签"
        style="width: 300px;"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 预设标签
  const presetTags = ref(['标签1', '标签2', '标签3', '标签4']);
  
  // 已添加标签
  const addedTags = ref([]);
  
  // 添加标签到已添加标签栏
  const addTag = (tag) => {
    if (!addedTags.value.includes(tag)) {
      addedTags.value.push(tag);
      presetTags.value = presetTags.value.filter(t => t !== tag);
    }
  };
  
  // 删除已添加标签
  const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t !== tag);
    presetTags.value.push(tag);
  };
  </script>
  
  <style scoped>
  h3 {
    margin-top: 20px;
  }
  
  /* 预设标签按钮的样式 */
  .preset-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .preset-tags .el-button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  </style>
  