<template>
    <div class="hotlog-ranking">
      <el-card>
        <h2>今日弹幕热榜</h2>
        <el-table :data="data.rankingData" style="width: 100%">
          <el-table-column prop="rank" label="排名" width="80"></el-table-column>
          <el-table-column prop="barrage" label="弹幕" width="350"></el-table-column>
          <el-table-column prop="cnt" label="复制次数" width="120"></el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button @click="copyBarrage(scope.row.barrage)" type="primary" size="small">复制</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="fetchRanking"
          :current-page="currentPage"
        >
        </el-pagination>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import request from "@/utils/request"
  
  const data = reactive({
    rankingData: [],
    currentPage: 1,
    pageSize: 10,
    total: 0
  })
  
  // 获取弹幕热榜数据
  const fetchRanking = (page = 1) => {
    request.get('/hotlog/ranking', {
      params: {
        page,
        pageSize: data.pageSize
      }
    }).then(res => {
      if (res.data && res.data.success) {
        const { items, total } = res.data.data
        data.rankingData = items
        data.total = total
      } else {
        ElMessage.error('获取弹幕热榜数据失败')
      }
    }).catch(error => {
      console.error('API 请求失败: ', error)
      ElMessage.error('加载数据失败，请稍后重试')
    })
  }
  
  // 复制弹幕
  const copyBarrage = (barrage) => {
    navigator.clipboard.writeText(barrage).then(() => {
      ElMessage.success('弹幕复制成功')
    }).catch(() => {
      ElMessage.error('复制失败')
    })
  }
  
  // 页面挂载时初始化数据
  onMounted(() => {
    fetchRanking(data.currentPage)
  })
  </script>
  
  <style scoped>
  .hotlog-ranking {
    padding: 20px;
  }
  </style>