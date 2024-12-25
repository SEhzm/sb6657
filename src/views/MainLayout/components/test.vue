<template>
    <el-button type="primary" @click="open = true">Begin Tour</el-button>
  
    <el-divider />
  
    
      <el-button ref="ref1">Upload</el-button>
      
     
  
    <el-tour v-model="open">
      <el-tour-step :target="ref1?.$el" title="Upload File">
        <div>Put you files here.</div>
      </el-tour-step>
    </el-tour>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { MoreFilled } from '@element-plus/icons-vue'
  import type { ButtonInstance } from 'element-plus'
  
  const ref1 = ref<ButtonInstance>()

  
  const open = ref(false)
  </script>