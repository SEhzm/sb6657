<template xmlns="http://www.w3.org/1999/html">
    <div class="boomouder">
        <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom"
            class="boom6657">
    </div>
    <AnnualHotList class="AnnualHotList"></AnnualHotList>
    <div class="home">
        <div class="card first-card">
            <div>
                <b>
                    <p class="announcement">
                        新增时光相册(可评论)，新增在线投稿弹幕。玩神照片可以在上方上传照片上传至相册
                    </p>
                    <!-- <p class="announcement-highlight">
                        最新推出了油猴TamperMonkey插件，可以在直播间直接搜索进行复制和一键发送，
                        <a href="https://sb6657.cn/#/Tampermonkey" target="_blank">点我安装！</a>
                    </p> -->
                    <p class="announcement-highlight">左上角新加2024年度TOP20烂梗评选，具体时间如弹框所示，每人每阶段有三票</p>
                </b>
            </div>
        </div>

        <div class="card second-card">
            <p>
                你好 <br>
                这是一个收集6657烂梗的网站:
                <span class="dgq63136">
                    <a href="https://sb6657.cn">sb6657.cn</a>
                </span>
                尽情欣赏你们的烂梗吧。
            </p>
        </div>

        <div class="card third-card">
            <div>
                <el-button type="primary" @click="getRandOne">点我随机一条弹幕</el-button>
                <el-table v-loading="loading" :data="data.tableData" class="barrage-table" @row-click="copyText">
                    <el-table-column prop="barrage" />
                    <el-table-column label="" align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="card fourth-card">
            <div>
                <span style="position: absolute; font-size: 20px; margin-top: -20px; color: blue;">
                    --------需点击右侧搜索按钮---------
                </span>
                <el-input v-model="searchQuery" :placeholder="searchBarrageMeg" clearable class="search-input"
                    @input="onSearchQueryChange">
                    <template #append>
                        <el-button type="primary" @click="queryBarrage">
                            <el-icon>
                                <Search />
                            </el-icon>
                        </el-button>
                    </template>
                </el-input>
                <el-table v-loading="loading" v-if="isInput" :data="data.filteredItems" stripe @row-click="copyText" :cell-style="{ cursor: 'Pointer',fontSize:'large' }">
                    <el-table-column prop="barrage" label="弹幕"></el-table-column>
                    <el-table-column label="" align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="card fifth-card">
            <div>
                <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
                    <el-form-item label="分栏" :label-width="auto" prop="table">
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
                    <el-form-item label="烂梗内容" prop="barrage">
                        <el-input maxlength="255" v-model="data.barrage" autocomplete="off" show-word-limit
                            type="textarea" />
                    </el-form-item>
                    <el-button type="primary" @click="saveBarrage" class="submit-button">
                        投稿
                    </el-button>
                </el-form>
            </div>
            <el-backtop :right="50" :bottom="50" />
        </div>
<ChatRoom class="ChatRoom"></ChatRoom>
        <div class="card sixth-card">
            友情链接 <a href="https://dgq63136.icu" target="_blank">dgq63136.icu</a>
        </div>
    </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { ElMessage, ElNotification } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import autoExecPng from "@/assets/autoexec.vue";

import ChatRoom from '@/components/ChatRoom.vue';
import AnnualHotList from '@/components/AnnualHotList.vue';


const loading = ref(true)
const isInput = ref(false)
const data = reactive({
    getRandOne: [],
    filteredItems: [],
    tableData: [],
    table: '',
    barrage: '',
})
const autoexec = () => {
    if (!sessionStorage.getItem("firstOpening")) {
        httpInstance.get("https://api.vvhan.com/api/visitor.info")
            .then(res => {
                const resData = res;
                localStorage.setItem("ip", res.ip)
                ElNotification({
                    icon: autoExecPng,
                    dangerouslyUseHTMLString: true,
                    title: '你好',
                    message: /* HTML */`
            <p>
                欢迎来自<b>${resData.location || '地球'}</b>的朋友<br/>  
                ${resData.system || '外星操作系统'} ${resData.browser || '牛逼浏览器'}<br/>
                IP: ${resData.ip || '地球'} 
            </p>
            `,
                    offset: 50,
                    customClass: "myClass",
                    duration: 1000
                })
                sessionStorage.setItem("firstOpening", 1)
            })
    }
}

autoexec()
const searchQuery = ref('');

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
        httpInstance.post('/machine/addUnaudit', {
            ip: localStorage.getItem('ip'),
            table: data.table,
            barrage: data.barrage
        }).then(res => {
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
//搜索
const queryBarrage = () => {
    console.log(searchQuery.value)
    httpInstance.post('/machine/Query', {
        QueryBarrage: searchQuery.value
    }).then(res => {
        isInput.value = true;
        loading.value = false;
        data.filteredItems = res.data || [];
    })
}


var searchBarrageMeg = ref('搜索烂梗...');
// const load = () => {
//   httpInstance.get('/machine/allBarrage/Page', {})
//     .then(res => {
//       // console.log(res);
//       data.tableData = res.data || [];
//       // console.log(data.tableData)
//       searchBarrageMeg = ref('搜索烂梗...➡️➡️');
//       loading.value = false;
//     })
//     .catch(err => {
//       console.error('加载数据失败:', err);
//     });
// };

const getRandOne = () => {
    httpInstance.get('/machine/getRandOne')
        .then(res => {
            data.tableData = [res.data];
            // console.log(res)
            loading.value = false;
        }).catch(err => {
            console.error("随机失败")
        })
}
getRandOne();


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

let lastCallTime = 0;
let lastMousePosition = null;
let mousePositionCnt = 0;
const copyText = (row) => {
    const currentTime = new Date().getTime();
    const currentMousePosition = { x: event.clientX, y: event.clientY };
    // 检查鼠标位置是否变化
    if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
        mousePositionCnt++;
        console.log(mousePositionCnt)
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
            PageNum: data.currentPage,
            table: 'allbarrage',
            id: row.id
        }).then(() => {
            setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
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

const onSearchQueryChange = () => {
    data.filteredItems = [];
    isInput.value = false;
};
</script>

<style scoped lang="scss">
.boomouder {
    height: 200px;

    .boom6657 {
        left: calc(50vw - 153px);
        position: absolute;
        height: 200px;
        border-radius: 10px;
    }
}

.home {
    width: 90%;

    .card {
        line-height: 30px;

        &.first-card {
            margin-top: 10px;
        }

        &.second-card {
            margin-top: 8px;
        }

        &.third-card {
            line-height: 0px;
            margin-top: 8px;
        }

        &.fourth-card {
            line-height: 50px;
            margin-top: 10px;
            margin-bottom: 10px;
            min-height: 80px;
        }

        &.fifth-card {
            margin-top: 8px;
            text-align: center;
        }

        &.sixth-card {
            margin-top: 10px;
            z-index: 300;
        }
    }

    .announcement {
        font-size: 14px;
    }

    .announcement-highlight {
        font-size: 18px;
        color: red;

        a {
            color: red;
        }
    }

    .barrage-table {
        font-family: 微软雅黑;
        font-size: 20px;
        cursor: pointer;

        ::v-deep(.el-table__header-wrapper) {
            font-size: 14px;
            white-space: normal !important;
        }
    }

    .search-input {
        font-size: 16px;
        margin-top: 30px;
    }

    .submit-button {
        font-size: 20px;
    }

    .dgq63136 {
        font-size: 23px;
        font-weight: bold;
        a{
            color: red;
        }
    }
}
@media (min-width: 601px) {
    .ChatRoom{
        display: none;
    }
    .AnnualHotList{
        display: none;
    }
}
@media(max-width :600px){
    .AnnualHotList{
        margin-bottom: 20px;
    }
    .boomouder {
    height: 150px;

        .boom6657 {
            position: absolute;
            border-radius: 10px;
            width: 192px;
            height: 108px;
            left: 25%;
        }
    }
    .home {
        width: 100%;
    }
    
}
</style>