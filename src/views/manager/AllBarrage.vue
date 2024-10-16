<template>
  <div>
    <div class="cardTable" style="position: relative;">
      <p style="position: absolute;right: 65px;margin-top: 10px;z-index: 4;pointer-events: none;">
        Look!是排序诶➡️<br><text
          style="position: absolute;right: 5px;">{{ sortOrder==null?'默认':sortOrder=='asc'?'升序':'降序' }}</text></p>
      <el-button type="primary" class="handleAdd" @click="handleAdd">
        投稿弹幕
      </el-button>

      <el-table v-loading="loading" stripe :data="data.tableData" empty-text="我还没有加载完喔~~" class="eldtable"
        :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
        :cell-style="{ cursor: 'Pointer' }" @row-click="copyText" @sort-change="handleSortChange">
        <el-table-column width="58" prop="id" label="序号"></el-table-column>
        <el-table-column prop="barrage" min-width="90" label="弹幕" />
        <!-- <el-table-column prop="like" min-width="15" label="赞" @click="console.log('11')">
          <el-button type="" label="操作"><svg t="1728735969486" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4268" width="32" height="32"><path d="M939.358251 423.424662c-23.01825-37.252439-62.924121-60.779272-107.019409-63.209624-2.755764-0.38681-5.510504-0.579191-8.347109-0.579191l-152.202471-0.121773c6.649444-28.975938 10.015098-58.653865 10.015098-88.657202 0-28.223808-3.213181-57.139372-9.556657-85.952604-0.447185-2.043542-1.098008-4.006244-1.932002-5.866614-15.820314-57.302077-67.37755-96.841605-127.282918-96.841605-72.827679 0-132.081201 59.254545-132.081201 132.081201 0 3.334955 0.132006 6.66991 0.406253 10.015098-2.196015 57.211003-32.108279 109.947088-80.269162 141.363611-14.447037 9.42465-18.524912 28.773324-9.099239 43.220361 9.414417 14.437827 28.752858 18.535145 43.220361 9.099239 65.811892-42.925648 106.429984-115.325585 108.656699-193.684234 0.030699-1.332345-0.010233-2.663666-0.14224-3.996011-0.203638-2.012843-0.304945-4.016477-0.304945-6.019087 0-38.381146 31.233352-69.614497 69.614497-69.614497 32.57593 0 60.474326 22.204721 67.824735 53.997821 0.356111 1.534959 0.823761 3.019777 1.402953 4.453429 4.696975 22.814612 7.076162 45.579081 7.076162 67.743894 0 37.485753-6.222725 74.352405-18.494213 109.592001-3.324722 9.546424-1.819438 20.111037 4.02671 28.345582 5.856381 8.245801 15.332197 13.146415 25.448602 13.156648l193.226816 0.101307c1.423419 0.264013 2.857071 0.426719 4.300956 0.477884 24.116257 0.9967 45.935192 13.614066 58.603723 34.090423 7.838525 12.31242 11.438517 26.800389 10.431583 41.939181-0.080841 0.945535-0.121773 1.911536-0.11154 2.877537 0 0.854461 0.040932 1.697665 0.11154 2.53166 0.010233 0.335644-0.030699 0.661056-0.11154 0.976234-0.101307 0.376577-0.193405 0.772596-0.284479 1.159406l-74.972529 330.391802c-0.914836 1.281179-1.738597 2.6432-2.449795 4.046153-5.937223 11.762905-14.660908 21.48329-25.346271 28.172643-10.746762 6.812149-23.059182 10.614755-35.757388 11.06194-0.854461-0.061398-513.766226-0.224104-513.766226-0.224104-0.467651-0.020466-0.935302-0.030699-1.402953-0.030699 0 0-111.01542 0.172939-112.718201 0.457418-1.932002 0-3.446495-1.50426-3.446495-3.415796l0.299829-416.334173c0-1.901303 1.545192-3.446495 3.01466-3.456728l1.245364 0.121773c1.174756 0.132006 2.653433 0.284479 3.52836 0.193405l83.82822-0.222057 0 339.367221c0 17.253966 13.979386 31.233352 31.233352 31.233352s31.233352-13.979386 31.233352-31.233352L281.009092 435.350273c0-1.778506 0-8.631588 0-10.411117 0-17.253966-13.979386-30.928407-31.233352-30.928407-1.50426 0-117.547183 0.304945-119.402437 0.304945-36.34272 0-65.913199 29.566386-65.913199 65.893756l-0.299829 416.334173c0 36.337603 29.571503 65.902966 65.913199 65.902966 2.541893 0 111.406323-0.457418 111.406323-0.457418 0.457418 0.020466 0.925069 0.030699 1.382487 0.030699 0 0 511.458671 0.274246 512.505513 0.274246 25.469068 0 50.296523-7.197936 71.647807-20.73116 19.612687-12.281721 35.777855-29.881564 46.839795-50.967812 3.660366-5.622044 6.435573-11.875468 8.256034-18.615986 0.11154-0.416486 0.213871-0.823761 0.304945-1.240247l74.881454-330.340637c1.596358-6.212492 2.257413-12.586666 2.00261-18.992563C960.892707 473.366098 953.948551 446.331371 939.358251 423.424662z" fill="#515151" p-id="4269"></path><path d="M450.027553 518.650467c-17.253966 0-31.233352 13.979386-31.233352 31.233352l0 30.470989c0 17.253966 13.979386 31.233352 31.233352 31.233352 17.253966 0 31.233352-13.979386 31.233352-31.233352l0-30.470989C481.260905 532.629853 467.281519 518.650467 450.027553 518.650467z" fill="#515151" p-id="4270"></path><path d="M693.805696 518.650467c-17.253966 0-31.233352 13.979386-31.233352 31.233352l0 30.470989c0 17.253966 13.979386 31.233352 31.233352 31.233352 17.253966 0 31.233352-13.979386 31.233352-31.233352l0-30.470989C725.039048 532.629853 711.058638 518.650467 693.805696 518.650467z" fill="#515151" p-id="4271"></path><path d="M648.940882 660.09492c-14.304797-9.393951-33.592073-5.398964-43.159986 8.763594-0.132006 0.193405-13.614066 19.754926-34.171264 19.754926-19.98824 0-32.423457-18.09717-33.266661-19.368116-9.17087-14.427594-28.254507-18.809391-42.834574-9.770528-14.650675 9.109472-19.155269 28.366048-10.055007 43.016723 11.214413 18.047028 41.96988 48.588625 86.156242 48.588625 43.962258 0 75.104535-30.318516 86.572728-48.222281C667.404396 688.461991 663.216004 669.500127 648.940882 660.09492z" fill="#515151" p-id="4272"></path></svg>
        </el-button>
        </el-table-column> -->
        <el-table-column label="" align="center" width="85">
          <el-button type="primary" label="操作">复制</el-button>
        </el-table-column>
        <el-table-column prop="cnt" label="复制次数" width="55" sortable="custom" />
      </el-table>
    </div>

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
            <el-option label="木柜子篇" value="machine_mygo" />
            <el-option label="直播间互喷篇" value="machine_ZbjHuPen" />
            <el-option label="喷选手篇" value="machine_penPlayer" />
            <el-option label="+1" value="machine_p1" />
            <el-option label="群魔乱舞篇" value="machine_QMLW" />
            <el-option label="QUQU" value="machine_QUQU" />
          </el-select>
        </el-form-item>
        <el-form-item label="弹幕内容" prop="barrage">
          <el-input maxlength="255" v-model="data.barrage" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit type="textarea" />
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

  <el-backtop :right="50" :bottom="50">UP</el-backtop>
</template>

<script setup>
import { ref, reactive } from 'vue'
import httpInstance from "@/apis/httpInstance";
import { ElNotification } from 'element-plus'

const loading = ref(true)

const rules = ({
  table: [
    { required: true, message: '请选择分栏', trigger: 'blur' },
  ],
  barrage: [
    { required: true, message: '请输入弹幕', trigger: 'blur' },
  ]
})
const sortOrder = ref(null)
const data = reactive({
  tableData: [],
  total: 0,
  pageSize: 200, //每页个数
  currentPage: 1, //起始页码
  dialogFormVisible: false,
  table: '',
  barrage: '',
})

const load = (pageNum = 1) => {
  httpInstance.get('/machine/all/Page', {
    params: {
      pageNum: pageNum,
      pageSize: data.pageSize
    }
  }).then(res => {
    // console.log(res)
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
    loading.value = false;
  }).catch(err => {
    console.error('加载数据失败:', err)
  })
}

load(data.currentPage)
//点击排序按钮执行的方法
const handleSortChange = ({ prop, order }) => {
  if (prop === 'cnt') {
    data.currentPage = 1;
    fetchSortedData(order, data.currentPage);
  }
};
const scrollToTop = () => {
  window.scrollTo({
    // top: document.documentElement.offsetHeight, //回到底部
    top: 0, //回到顶部
    behavior: "smooth", //smooth 平滑；auto:瞬间
  });
};
const handlePageChange = (page) => {
  data.currentPage = page;
  scrollToTop();
  if (sortOrder.value === null) {
    load(page)
  } else if (sortOrder.value === 'desc') {
    fetchSortedData("desc", page)
  } else {
    fetchSortedData("ascending", page)
  }
}

const open2 = () => {
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


// 从后端获取排序后的数据
const fetchSortedData = (order, pageNum = 1) => {
  loading.value = true;
  sortOrder.value = order === 'ascending' ? 'asc' : order === null ? null : 'desc';
  console.log(sortOrder.value);
  if (sortOrder.value === null) {
    load()
  } else {
    httpInstance.get('/machine/sortAllBarrage', {
      params: {
        pageNum: pageNum,
        pageSize: data.pageSize,
        order: sortOrder.value
      }
    })
      .then(res => {
        data.tableData = res.data.list; // 使用后端返回的数据更新 tableData
        data.total = res.data?.total || 0
      })
      .finally(() => {
        data.currentPage = 1
        loading.value = false;
      });
  }
};

let lastCallTime = 0;
let lastMousePosition = null;
let mousePositionCnt = 0;
const copyText = (row) => {
  const currentTime = new Date().getTime();
  const currentMousePosition = { x: event.clientX, y: event.clientY };
  // 检查鼠标位置是否变化
  if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
    mousePositionCnt++;
    if (mousePositionCnt > 4) {
      ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
        confirmButtonText: '好吧，我错了',
      })
    }
  } else {
    mousePositionCnt = 0;
  }
  // 检查是否已经过了 1.5 秒
  if (currentTime - lastCallTime < 1500) {
    ElNotification({
      title: '请勿刷次数',
      message: '复制成功，但次数没有增加',
      type: 'warning',
    });
    const textToCopy = row.barrage;
    let tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select(); // 选择对象
    try {
      document.execCommand('Copy'); // 执行浏览器复制命令
    } catch (err) {
      // 复制失败，可以显示错误信息
      ElNotification({
        title: '复制失败',
        message: '复制操作失败，请稍后重试',
        type: 'error',
      });
      console.error('复制失败:', err);
    }
    document.body.removeChild(tempInput); // 清理临时元素
    lastCallTime = currentTime;
    lastMousePosition = currentMousePosition;
    return;
  }
  lastMousePosition = currentMousePosition;
  lastCallTime = currentTime;
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
    httpInstance.post('/machine/addCnt', {
      sortOrder: sortOrder.value,
      PageNum: data.currentPage,
      table: 'allbarrage',
      id: row.id
    }).then(() => {
      // console.log(sortOrder.value);
      if (sortOrder.value === null) {
        setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
      } else if (sortOrder.value === 'desc') {
        setTimeout(() => fetchSortedData('desc', data.currentPage), 50);
      } else {
        setTimeout(() => fetchSortedData('ascending', data.currentPage), 50);
      }
    });
  } catch (err) {
    // 复制失败，可以显示错误信息
    ElNotification({
      title: '复制失败',
      message: '复制操作失败，请稍后重试',
      type: 'error',
    });
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput); // 清理临时元素
};

//点击新增按钮
const handleAdd = () => {
  data.table = ''
  data.barrage = ''
  data.dialogFormVisible = true
}
//提交并关闭
const saveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入弹幕");
  } else {
    httpInstance.post('/machine/addUnaudit', {
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
    httpInstance.post('/machine/addUnaudit', {
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
  z-index: 3;
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
  margin-top: 15px;
  margin-left: 150px
}

@media (min-width: 601px) {
  .cardTable {
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
    cursor: cell;
  }

  .dialogFormVisible {
    font-size: 15px;
  }

  .handleAdd {
    z-index: 100;
    position: absolute;
    font-size: 13px;
    margin-left: 100px
  }

}
</style>