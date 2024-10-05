<template xmlns="http://www.w3.org/1999/html">
  <div class="boomouder">
    <img src="https://pic.imgdb.cn/item/66f7a491f21886ccc022f12a.png" alt="6657boom" class="boom6657">
  </div>
  <div class="home">
    <div class="card" style="line-height: 30px;margin-top: 40px;">
      <div><b>
          <em style="font-size: 17px;color: red;">新增时光相册2015年-2024年(可评论)，新增在线投稿弹幕</em></b>
      </div>
    </div>

    <div class="card" style="line-height: 30px; margin-top:8px ;">
      <p>你好 <br>
        这是一个收集6657烂梗的网站: <span class="dgq63136">
          <a href="https://sb6657.cn" style="color: red;">sb6657.cn
          </a></span>尽情欣赏你们的烂梗吧。
        <br>
      </p>
    </div>

    <div class="card" style="line-height: 0px; margin-top: 8px;">
      <div>
        <el-button type="primary" @click="getRandomItem">点我随机一条弹幕</el-button>
        <el-table v-loading="loading" v-if="randomlySelectedItem" :data="[randomlySelectedItem]"
          style="font-family: 微软雅黑; font-size: 20px;"
          :header-cell-style="{ fontSize: '14px', whitespace: 'normal !important' }" :cell-style="{ cursor: 'Pointer' }"
          @row-click="copyText">
          <el-table-column prop="barrage" label="弹幕"></el-table-column>
          <el-table-column label="" align="center" width="85">
            <el-button type="primary">复制</el-button>
          </el-table-column>
        </el-table>
        <div v-else>
          <p>《未选择随机项》----出错啦，请手动刷新</p>
        </div>
      </div>
    </div>

    <div class="card" style="line-height: 45px; margin-top: 10px; margin-bottom: 10px; min-height: 80px;">
      <div>
        <span style="position: absolute; font-size: 22px; margin-top: -20px; color: blue;">
          --------搜索在这，🦐吗---------
        </span>
        <el-input v-model="searchQuery" :placeholder=searchBarrageMeg
          style="background-color: yellow;font-size: 30px; margin-top: 30px;" :prefix-icon="Search">
        </el-input>
        <el-table v-loading="loading" v-if="searchQuery" :data="filteredItems" stripe @row-click="copyText"
          style="font-size: 19px;" :cell-style="{ cursor: 'Pointer' }" empty-text="可能没有这条烂梗或请手动刷新页面">
          <el-table-column prop="barrage" label="弹幕"></el-table-column>
          <el-table-column label="" align="center" width="85">

            <el-button type="primary">复制</el-button>

          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="card" style="margin-top: 8px; text-align: center;">

      <div>
        <p>这里是投稿烂梗，上面才是搜索</p>
        <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
          <el-form-item label="分栏" :label-width="auto" prop="table">
            <el-select v-model="data.table" placeholder="选择上传的分栏">
              <el-option label="喷玩机器篇" value="machine_penWJQ" />
              <el-option label="直播间互喷篇" value="machine_ZbjHuPen" />
              <el-option label="喷选手篇" value="machine_penPlayer" />
              <el-option label="+1" value="machine_p1" />
              <el-option label="群魔乱舞篇" value="machine_QMLW" />
              <el-option label="QUQU" value="machine_QUQU" />
            </el-select>
          </el-form-item>
          <el-form-item label="烂梗内容" prop="barrage">
            <el-input maxlength="255" v-model="data.barrage" autocomplete="off" />
          </el-form-item>
          <el-button type="primary" @click="saveBarrage" style="font-size: 20px;">
            投稿
          </el-button>
        </el-form>
      </div>

      <el-backtop :right="50" :bottom="50" />
    </div>
    <div class="card" style="line-height: 30px;margin-top: 10px;">
      友情链接 <a href="https://dgq63136.icu" target="_blank">dgq63136.icu</a>

    </div>
    <div class="footer">
      <!-- <a href="https://beian.miit.gov.cn/" target="_blank">基于腾讯云服务器搭建<a style="font-size: 11px">(离服务器到期还有{{ ServerDate
          }}天)</a></a> -->
      <!-- </a>&nbsp;&nbsp;&nbsp;&nbsp; 
          Copyright
        ©HZM 2024
        桂ICP备2024022150号</a> &nbsp;
      <img src="https://ywtb.mps.gov.cn/newhome/templates/Zwfw_Fwmh/img/main/foot-ga.png" alt="">
      <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=45040302000258"
        target="_blank">桂公网安备45040302000258号</a> -->
    </div>
  </div>

  <div class="el-footer">
    基于腾讯云服务器搭建<text style="font-size: 11px">(离服务器到期还有{{ ServerDate }}天)</text>
    <text> 域名所有：<a href="https://yuba.douyu.com/member/LW7rKJ9qVVwG/main/news" target="_blank">@陈苏何</a></text>
  </div>


</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import request from "@/utils/request";
import { ElMessage, ElNotification } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import autoExecPng from "@/assets/autoexec.vue";

const loading = ref(true)

const autoexec = () => {
  request.get("https://api.vvhan.com/api/visitor.info")
    .then(res => {
      const resData = res;
      localStorage.setItem("ip", res.ip)
      ElNotification({
        icon: autoExecPng,
        dangerouslyUseHTMLString: true,
        title: '你好',
        message:
          "<p>欢迎来自<b>" +
          resData.location +
          "</b>的朋友<br/> " +
          resData.system +
          resData.browser +
          " <br>IP: " +
          resData.ip +
          "</p>",
        offset: 50,
        customClass: "myClass",
        duration: 2000
      })
    })
}
autoexec()
const searchQuery = ref('');
const randomlySelectedItem = ref(null);

const targetDate = new Date('2041-06-07');
const diudiugaokao = ref(0);

const DaoJiShiDate = new Date('2024-10-23');
const DaoJiShi = ref(0);

const TxServerDate = new Date('2025-02-20');
const ServerDate = ref(0);


const rules = ({
  table: [
    { required: true, message: '请选择分栏', trigger: 'blur' },
  ],
  barrage: [
    { required: true, message: '请输入烂梗', trigger: 'blur' },
  ]
})

//提交
const saveBarrage = () => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入烂梗");
  } else {
    request.post('/machine/addUnaudit', {
      ip: localStorage.getItem('ip'),
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      load()
      data.dialogFormVisible = false;
      data.barrage = '';
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    })
  }
}


const data = reactive({
  tableData: [],
  table: '',
  barrage: '',
})
var searchBarrageMeg = ref('请稍等！或者请手动刷新页面,搜索不可能是空的');
const load = () => {
  request.get('/machine/allBarrage/Page', {})
    .then(res => {
      // console.log(res);
      data.tableData = res.data || [];
      // console.log(data.tableData)
      getRandomItem();
      searchBarrageMeg = ref('搜索烂梗...');
      loading.value = false;
    })
    .catch(err => {
      console.error('加载数据失败:', err);
    });
};

load();
//在数组中随机弹幕
const getRandomItem = () => {
  if (data.tableData.length > 0) {
    const randomIndex = Math.floor(Math.random() * data.tableData.length);
    randomlySelectedItem.value = data.tableData[randomIndex];
  }
};

// 过滤搜索结果
const filteredItems = computed(() => {
  const query = searchQuery.value?.toLowerCase();
  if (!query) return [];
  return data.tableData.filter(item => {
    const itemStr = `${item.name}${item.barrage}${item.description}`.toLowerCase();
    return itemStr.includes(query);
  });
});


const open2 = () => {
  ElMessage({
    message: '复制成功',
    type: 'success',
  })
};

const open4 = () => {
  ElMessage({
    message: '复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器',
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



const calculateCountdown = () => {
  const now = new Date();
  const diffTime1 = targetDate - now;
  const diffTime2 = DaoJiShiDate - now;
  const diffTime3 = TxServerDate - now;
  diudiugaokao.value = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));
  DaoJiShi.value = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
  ServerDate.value = Math.ceil(diffTime3 / (1000 * 60 * 60 * 24));
};


// 在组件挂载时计算倒计时
onMounted(() => {
  calculateCountdown();
  // 设置一个定时器每天更新一次倒计时
  setInterval(calculateCountdown, 1000 * 60 * 60 * 24);
});

</script>


<style scoped lang="scss">
.header-text {
  margin-left: 25px;
  font-size: 27px;
  color: red;
}

.dog_head {
  margin-top: -10px;
  height: 70px;
  position: absolute;
}

.biabiabia {
  margin-top: -40px;
  height: 85px;
  position: absolute;
  margin-left: 10px;
}

.good {
  position: absolute;
  margin-top: -144px;
  height: 175px;
  margin-left: 300px;
}

.dgq63136 {
  margin-top: 120px;
  font-size: 24px;
  font-weight: bold;
}

.footer {
  text-align: center;
  font-size: 17px;
  margin-left: -250px;
}

@media (min-width: 601px) {
  .boom6657 {
    left: calc(50vw - 153px);
    position: absolute;
    height: 200px;
    border-radius: 10px;
  }

  .boomouder {
    height: 200px;
  }

  .home {
    width: 90%;
  }

  .el-footer {
    z-index: 200;
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100% !important;
    text-align: center;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
    margin-left: -153px;
  }
}

@media (max-width: 600px) {
  .myClass {
    width: 200px;
    height: 200px;
  }

  .boom6657 {
    position: absolute;
    border-radius: 10px;
    width: 192px;
    height: 108px;
    left: 25%;
  }

  .boomouder {
    height: 105px !important;
  }

  .myClass {
    --el-notification-width: 290px;
    height: 20px;
    width: 20px !important;
  }

  .header-text {
    margin-left: 25px;
    font-size: 17px;
    color: red;
  }

  .DGjvpai {
    display: none;
  }

  .biabiabia {
    margin-top: -40px;
    height: 85px;
    position: absolute;
    margin-left: 10px;
  }

  .Addform {
    width: 90vw;
    padding: 0;
  }

  .good {
    position: absolute;
    margin-top: -53px;
    height: 60px;
    margin-left: 100px;
  }

  .dgq63136 {
    font-size: 17px;
    font-weight: bold;
  }

  .footer {
    margin-left: 0px;
    font-size: 14px;
  }

  .el-footer {
    text-align: center;
    font-family: Arial;
    position: fixed;
    bottom: 2px;
    font-size: 12px;
    width: 100%;
  }
}
</style>