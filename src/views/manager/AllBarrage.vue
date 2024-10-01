<template>
  <div>
    <div class="card">
      <el-button type="primary" class="handleAdd" @click="handleAdd">
        投稿弹幕
      </el-button>

      <el-table stripe :data="data.displayedData" empty-text="因本页烂梗较多，可能会出现卡顿" class="eldtable"
        :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
        :cell-style="{ cursor: 'Pointer' }" @row-click="copyText" @scroll="handleScroll">
        <el-table-column width="70" prop="id" label="序号"></el-table-column>
        <el-table-column prop="barrage" min-width="90" label="弹幕" />
        <el-table-column label="" align="center" width="85">
          <el-button type="primary" label="操作">复制</el-button>
        </el-table-column>
        <el-table-column prop="cnt" label="复制次数" width="55" />
      </el-table>
    </div>

    <el-backtop :right="50" :bottom="50">UP</el-backtop>
    <div class="pagination-wrapper">
      <!-- 分页 -->
      <div>
        <el-pagination background="red" layout="prev, pager, next, jumper" :total="data.total" :pager-count=4
          :page-size="data.pageSize" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>
    <el-dialog v-model="data.dialogFormVisible" draggable title="投稿弹幕" width="82%">
      <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
        <el-form-item label="分栏" :label-width="100" prop="table">
          <el-select v-model="data.table" placeholder="选择上传的分栏">
            <el-option label="喷玩机器篇" value="machine_penWJQ" />
            <el-option label="直播间互喷篇" value="machine_ZbjHuPen" />
            <el-option label="喷选手篇" value="machine_penPlayer" />
            <el-option label="+1" value="machine_p1" />
            <el-option label="群魔乱舞篇" value="machine_QMLW" />
            <el-option label="QUQU" value="machine_QUQU" />
          </el-select>
        </el-form-item>
        <el-form-item label="弹幕内容" prop="barrage">
          <el-input maxlength="255" v-model="data.barrage" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.dialogFormVisible = false">关闭</el-button>
          <el-button type="primary" @click="saveBarrage">
            投稿并关闭
          </el-button>
          <el-button type="primary" @click="continuousSaveBarrage">
            连续投稿
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick, reactive } from 'vue'
import request from "@/utils/request";
import { ElNotification } from 'element-plus'



const rules = ({
  table: [
    { required: true, message: '请选择分栏', trigger: 'blur' },
  ],
  barrage: [
    { required: true, message: '请输入弹幕', trigger: 'blur' },
  ]
})

const data = reactive({
  tableData: [],
  copiedData: [],
  displayedData: [], // 当前展示的数据
  pageSize: 200,
  total: 0,
  currentPage: 1, //起始页码
  dialogFormVisible: false,
  table: '',
  barrage: '',
  ip: '',
  loadingMore: false, // 控制是否正在加载更多数据
})

const load = (pageNum = 1) => {
  request.get('/machine/allBarrage/Page', {
    params: {
      status: 0
    }
  }).then(res => {
    // console.log(res)
    data.tableData = res.data || [];
    data.total = data.tableData.length;
    data.displayedData = data.tableData.slice(0, data.pageSize); 
    // console.log(data.tableData)
  }).catch(err => {
    console.error('加载数据失败:', err)
  })
}


load(data.currentPage)
const handlePageChange = (page) => {
  loaded(page);
}

const loaded =(n) => {
  if (data.tableData.length > 0) {
    data.displayedData = [];
    data.displayedData = data.tableData.slice(0+(n-1)*(data.pageSize), n*(data.pageSize)); 
  }
};



const open2 = () => {
  load()
  ElNotification({
    message: '复制成功',
    type: 'success',
  })
};

const open4 = () => {
  ElNotification({
    message: '复制失败',
    type: 'error',
  })
};

const copyText = (row) => {
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
      PageNum: data.currentPage,
      table: 'allbarrage',
      id: row.id
    }).then(() => {
      setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
    });
  } catch (err) {
    // 复制失败，可以显示错误信息
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};


//点击新增按钮
const handleAdd = () => {
  ElNotification({
    title: '温馨提醒',
    message: '请注意你的行为，不要上传违反法律的内容，后台能监控到你',
    type: 'warning',
  })
  data.table = ''
  data.barrage = ''
  data.dialogFormVisible = true
}

//提交并关闭
const saveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    request.post('/machine/addUnaudit', {
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      load()
      data.dialogFormVisible = false;
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}

//连续提交
const continuousSaveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    request.post('/machine/addUnaudit', {
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      load()
      data.barrage = ''
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}


</script>

<style scoped>
.eldtable {
  font-size: 18px;
  white-space: nowrap;
  overflow-x: auto;
}

.pagination-wrapper {
  display: flex;
  margin-top: 20px;
}

.handleAdd {
  z-index: 100;
  position: absolute;
  font-size: 18px;
  margin-left: 150px
}



@media (min-width: 601px) {
  .card {
    width: 80%;
  }

}


@media (max-width: 600px) {
  .el-pagination {
    margin: 0;
    --el-pagination-button-width: 22px;
  }

  .eldtable {
    font-size: 16px;
    white-space: nowrap;
    overflow-x: auto;
  }

  .dialogFormVisible {
    font-size: 15px;
  }

  .handleAdd {
    z-index: 100;
    position: absolute;
    font-size: 13px;
    margin-left: 150px
  }
}
</style>
